using Autotube.DTOs.ADashboardP;
using Autotube.Models;

namespace Autotube.Repositories.AdmninDashboard
{

    public interface IAdminDashboardRepository
    {

        Task<int> GetTotalUsersAsync();

        Task<int> GetActiveUsersCountAsync();

        Task<decimal> GetMonthlyRevenueAsync();

        Task<double> GetAvgAnalysesPerUserAsync();

        Task<List<UserManagementDto>> GetAllUsersForManagementAsync();
        
        Task<UserDetailsDto?> GetUserDetailsByIdAsync(int userId);

        Task<List<PerformancePointDto>> GetUserPerformanceAsync(int userId);

        Task<Subscription?> GetActiveSubscriptionByUserIdAsync(int userId);

        Task<SubscriptionPlan?> GetSubscriptionPlanByIdAsync(int planId);

        Task<List<Subscription>> GetExpiredActiveSubscriptionsAsync();

        Task<bool> UserExistsAsync(int userId);

        Task<User?> GetUserByIdAsync(int userId);

        Task DeleteUserAsync(User user);

        Task UpdateUserAsync(User user);

        Task AddSubscriptionAsync(Subscription subscription);

        Task UpdateSubscriptionAsync(Subscription subscription);

        Task DeleteSubscriptionsByUserIdAsync(int userId);

        Task SaveChangesAsync();
    }
}