using Microsoft.Extensions.Logging;

namespace Autotube.Services.All_in_One.Thumbnail
{

    public class AllImageStorageService
    {
        private const string FolderName = "AllInOne-Thumbnail";

        private readonly IWebHostEnvironment _env;
        private readonly ILogger<AllImageStorageService> _logger;

        public AllImageStorageService(IWebHostEnvironment env, ILogger<AllImageStorageService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public async Task<string> SaveFromUrlAsync(string imageUrl, HttpClient httpClient)
        {
            _logger.LogInformation("Downloading image from URL: {Url}", imageUrl);

            // Download the image
            var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);

            // Save to disk and return the web path
            return await SaveBytesAsync(imageBytes, ".png");
        }

        public async Task<string> SaveFromBase64Async(string base64Data)
        {
            _logger.LogInformation("Saving image from base64 data.");

            // Remove the data URI
            var cleanBase64 = base64Data.Contains(",")
                ? base64Data.Split(',')[1]
                : base64Data;

            var imageBytes = Convert.FromBase64String(cleanBase64);
            return await SaveBytesAsync(imageBytes, ".png");
        }


        // Private Helpers
        private async Task<string> SaveBytesAsync(byte[] bytes, string extension)
        {
            var folderPath = Path.Combine(_env.WebRootPath, FolderName);

            Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(folderPath, fileName);

            await File.WriteAllBytesAsync(fullPath, bytes);

            _logger.LogInformation("Image saved to {Path}", fullPath);

            // Return the URL relative path
            return $"/{FolderName}/{fileName}";
        }

        public string GetAbsolutePath(string relativePath)
        {
            // Remove the leading "/" and combine with wwwroot
            var sanitized = relativePath.TrimStart('/');
            return Path.Combine(_env.WebRootPath, sanitized);
        }
    }
}
