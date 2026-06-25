
using Autotube.DTOs.Dashboard;
using AutoTubeAPI.DTOs.Dashboard;

namespace AutoTubeAPI.Repositories.Dashboard
{
    public interface IUserDashboardRepository
    {
        Task<int> GetTotalAnalysesAsync(int userId);

        Task<int> GetVideosGeneratedAsync(int userId);

        Task<int> GetScriptsGeneratedAsync(int userId);

        Task<int> GetThumbnailsGeneratedAsync(int userId);

        Task<int> GetWeeklyAnalysesAsync(int userId);

        Task<int> GetWeeklyScriptsAsync(int userId);

        Task<int> GetWeeklyVideosAsync(int userId);

        Task<int> GetWeeklyThumbnailsAsync(int userId);

        Task<List<TopOpportunityDto>> GetTopOpportunitiesAsync(int userId);

        Task<List<ActivityDateDto>> GetUserActivityDatesAsync(int userId);
    }
}