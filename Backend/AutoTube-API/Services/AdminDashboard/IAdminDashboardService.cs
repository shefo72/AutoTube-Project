using Autotube.DTOs.ADashboardP;

namespace Autotube.Services.AdminDashboard
{
    public interface IAdminDashboardService
    {
        Task AutoExpireSubscriptionsAsync();

        Task<DashboardStatsDto> GetDashboardStatsAsync();

        Task<List<UserManagementDto>> GetAllUsersAsync();

        Task<UserDetailsDto> GetUserDetailsAsync(int userId);

        Task ChangePlanAsync(int userId, ChangePlanDto dto);

        Task DeleteUserAsync(int userId);

        Task UpdateUserStatusAsync(int userId, UpdateSubscriptionStatusDto dto);
    }
}
