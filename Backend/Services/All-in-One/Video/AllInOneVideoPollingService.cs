using Autotube.Data;
using Microsoft.EntityFrameworkCore;

namespace Autotube.Services.All_in_One.Video
{
    public class AllInOneVideoPollingService : IAllInOneVideoPollingService
    {
        private readonly AutoTubeDbContext _context;
        private readonly IAllInOnePiAPIService _piApi;
        private readonly ILogger<AllInOneVideoPollingService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public AllInOneVideoPollingService(
            AutoTubeDbContext context,
            IAllInOnePiAPIService piApi,
            ILogger<AllInOneVideoPollingService> logger,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _piApi = piApi;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public async Task ProcessPendingVideosAsync()
        {
            var videos = await _context.AllInOnes
                .Where(x => x.Status == "Generating Video"
                         && x.PiApiTaskId != null)
                .ToListAsync();

            if (!videos.Any())
                return;

            var httpClient = _httpClientFactory.CreateClient();

            foreach (var item in videos)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(item.PiApiTaskId))
                        continue;

                    var result =
                        await _piApi.GetTaskStatusAsync(item.PiApiTaskId);

                    var status = result.Status?.ToLower();

                    // Still Processing
                    if (status == "processing")
                    {
                        item.UpdatedAt = DateTime.UtcNow;
                        continue;
                    }

                    // failed
                    if (status == "failed")
                    {
                        item.Status = "Failed";
                        item.ErrorMessage = "PiAPI video generation failed";
                        item.UpdatedAt = DateTime.UtcNow;
                        continue;
                    }

                    // completed
                    if (status == "completed")
                    {
                        if (string.IsNullOrWhiteSpace(result.VideoUrl))
                        {
                            item.Status = "Failed";
                            item.ErrorMessage = "Video URL missing from PiAPI";
                            continue;
                        }

                        var savedPath =
                            await DownloadVideoAsync(result.VideoUrl, item.Id, httpClient);

                        item.VideoPath = savedPath;
                        item.Status = "Completed";
                        item.UpdatedAt = DateTime.UtcNow;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Polling failed for AllInOne Id {Id}", item.Id);

                    item.Status = "Failed";
                    item.ErrorMessage = ex.Message;
                    item.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
        }

        // Download Video
        private async Task<string> DownloadVideoAsync(
            string url,
            int id,
            HttpClient httpClient)
        {
            var bytes = await httpClient.GetByteArrayAsync(url);

            var folder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "videos",
                "allinone"
            );

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = $"AllInOne_video{id}.mp4";
            var fullPath = Path.Combine(folder, fileName);

            await File.WriteAllBytesAsync(fullPath, bytes);

            return $"/videos/allinone/{fileName}";
        }
    }
}
