using Autotube.Data;
using Autotube.DTOs.Dashboard;
using AutoTubeAPI.DTOs.Dashboard;
using Microsoft.EntityFrameworkCore;

namespace AutoTubeAPI.Repositories.Dashboard
{
    public class UserDashboardRepository : IUserDashboardRepository
    {
        private readonly AutoTubeDbContext _context;

        public UserDashboardRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        // STATS
        public async Task<int> GetTotalAnalysesAsync(int userId)
        {
            return await _context.ContentGapAnalyses
                .CountAsync(x => x.UserId == userId);
        }

        public async Task<int> GetVideosGeneratedAsync(int userId)
        {
            return await _context.GeneratedVideos
                .CountAsync(x =>
                    x.UserId == userId &&
                    x.GenerationStatus == "Completed");
        }

        public async Task<int> GetScriptsGeneratedAsync(int userId)
        {
            return await _context.GeneratedContents
                .CountAsync(x => x.UserId == userId && x.GeneratedScript != null);
        }

        public async Task<int> GetThumbnailsGeneratedAsync(int userId)
        {
            var generated = await _context.GeneratedThumbnails
                .CountAsync(x => x.UserId == userId);

            var uploaded = await _context.UploadedImageThumbnails
                .CountAsync(x => x.UserId == userId);

            return generated + uploaded;
        }

        public async Task<int> GetWeeklyAnalysesAsync(int userId)
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-6);

            return await _context.ContentGapAnalyses
                .CountAsync(x =>
                    x.UserId == userId &&
                    x.CreatedAt != null &&
                    x.CreatedAt >= startDate);
        }

        public async Task<int> GetWeeklyScriptsAsync(int userId)
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-6);

            return await _context.GeneratedContents
                .CountAsync(x =>
                    x.UserId == userId &&
                    x.GeneratedScript != null &&
                    x.CreatedAt != null &&
                    x.CreatedAt >= startDate);
        }

        public async Task<int> GetWeeklyVideosAsync(int userId)
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-6);

            return await _context.GeneratedVideos
                .CountAsync(x =>
                    x.UserId == userId &&
                    x.GenerationStatus == "Completed" &&
                    x.CreatedAt != null &&
                    x.CreatedAt >= startDate);
        }

        public async Task<int> GetWeeklyThumbnailsAsync(int userId)
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-6);

            var generated = await _context.GeneratedThumbnails
                .CountAsync(x =>
                    x.UserId == userId &&
                    x.CreatedAt != null &&
                    x.CreatedAt >= startDate);

            var uploaded = await _context.UploadedImageThumbnails
                .CountAsync(x =>
                    x.UserId == userId &&
                    x.CreatedAt != null &&
                    x.CreatedAt >= startDate);

            return generated + uploaded;
        }

        // Top Opportunities
        public async Task<List<TopOpportunityDto>> GetTopOpportunitiesAsync(int userId)
        {
            return await _context.ContentGapAnalyses
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.GapScore)
                .Take(6)
                .Select(x => new TopOpportunityDto
                {
                    Keyword = x.Keyword,
                    GapScore = x.GapScore,
                    DemandScore = x.DemandScore
                })
                .ToListAsync();
        }

        // Growth Overview (7 days)
        public async Task<List<ActivityDateDto>> GetUserActivityDatesAsync(int userId)
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-6);

            var result = new List<ActivityDateDto>();

            result.AddRange(await _context.ContentGapAnalyses
                .Where(x => x.UserId == userId &&
                            x.CreatedAt != null &&
                            x.CreatedAt >= startDate)
                .Select(x => new ActivityDateDto
                {
                    Date = x.CreatedAt!.Value,
                    Type = "Analysis"
                })
                .ToListAsync());

            result.AddRange(await _context.GeneratedContents
                .Where(x => x.UserId == userId &&
                            x.GeneratedScript != null &&
                            x.CreatedAt != null &&
                            x.CreatedAt >= startDate)
                .Select(x => new ActivityDateDto
                {
                    Date = x.CreatedAt!.Value,
                    Type = "Script"
                })
                .ToListAsync());

            result.AddRange(await _context.GeneratedThumbnails
                .Where(x => x.UserId == userId &&
                            x.CreatedAt != null &&
                            x.CreatedAt >= startDate)
                .Select(x => new ActivityDateDto
                {
                    Date = x.CreatedAt!.Value,
                    Type = "Thumbnail"
                })
                .ToListAsync());

            result.AddRange(await _context.UploadedImageThumbnails
                .Where(x => x.UserId == userId &&
                            x.CreatedAt != null &&
                            x.CreatedAt >= startDate)
                .Select(x => new ActivityDateDto
                {
                    Date = x.CreatedAt!.Value,
                    Type = "ThumbnailUpload"
                })
                .ToListAsync());

            result.AddRange(await _context.GeneratedVideos
                .Where(x => x.UserId == userId &&
                            x.CreatedAt != null &&
                            x.CreatedAt >= startDate &&
                            x.GenerationStatus == "Completed")
                .Select(x => new ActivityDateDto
                {
                    Date = x.CreatedAt!.Value,
                    Type = "Video"
                })
                .ToListAsync());

            return result;
        }
    }
}