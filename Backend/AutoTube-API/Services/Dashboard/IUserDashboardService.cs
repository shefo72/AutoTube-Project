using AutoTubeAPI.DTOs.Dashboard;

namespace AutoTubeAPI.Services.Dashboard
{
    public interface IUserDashboardService
    {
        Task<DashboardResponseDto> GetDashboardAsync(int userId);
    }
}