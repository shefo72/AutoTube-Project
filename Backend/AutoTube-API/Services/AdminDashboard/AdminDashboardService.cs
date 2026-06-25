using Autotube.DTOs.ADashboardP;
using Autotube.Models;
using Autotube.Repositories.AdmninDashboard;

namespace Autotube.Services.AdminDashboard
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IAdminDashboardRepository _repository;

        public AdminDashboardService(
            IAdminDashboardRepository repository)
        {
            _repository = repository;
            
        }


        // Auto expire subscription
        public async Task AutoExpireSubscriptionsAsync()
        {
            // Fetch all "Active" subscriptions where end_date is in the past
            var expiredSubs = await _repository.GetExpiredActiveSubscriptionsAsync();

            // Nothing to do if no expired subscriptions found
            if (!expiredSubs.Any())
                return;

            foreach (var sub in expiredSubs)
            {
                // Business rule: change status from "Active" → "Expired"
                sub.Status = "Expired";
                await _repository.UpdateSubscriptionAsync(sub);


            }

            await _repository.SaveChangesAsync();
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {

            var totalUsers = await _repository.GetTotalUsersAsync();

            var activeUsers = await _repository.GetActiveUsersCountAsync();

            var monthlyRevenue = await _repository.GetMonthlyRevenueAsync();

            var avgAnalyses = await _repository.GetAvgAnalysesPerUserAsync();


            return new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                MonthlyRevenue = monthlyRevenue,
                AvgAnalysesPerUser = avgAnalyses
            };
        }

        // Users
        public async Task<List<UserManagementDto>> GetAllUsersAsync()
        {
            return await _repository.GetAllUsersForManagementAsync();
        }

        public async Task<UserDetailsDto> GetUserDetailsAsync(int userId)
        {
            var details = await _repository.GetUserDetailsByIdAsync(userId);

            if (details == null)
                throw new KeyNotFoundException($"User with ID {userId} was not found.");

            return details;
        }

        // Change plan
        public async Task ChangePlanAsync(int userId, ChangePlanDto dto)
        {
            // Validate plan exists
            var plan = await _repository.GetSubscriptionPlanByIdAsync(dto.SubscriptionPlanId);
            if (plan == null)
                throw new KeyNotFoundException($"Subscription plan with ID {dto.SubscriptionPlanId} was not found.");

            // Validate user exists
            if (!await _repository.UserExistsAsync(userId))
                throw new KeyNotFoundException($"User with ID {userId} was not found.");

            //  Find existing active subscription 
            var activeSub = await _repository.GetActiveSubscriptionByUserIdAsync(userId);

            var today = DateTime.UtcNow;

            if (activeSub != null)
            {
                activeSub.SubscriptionPlanId = dto.SubscriptionPlanId;
                activeSub.StartDate = today;
                activeSub.EndDate = today.AddDays(30);
                activeSub.Status = "Active";

                await _repository.UpdateSubscriptionAsync(activeSub);
            }
            else
            {
                // No active subscription — create a brand new one
                var newSubscription = new Subscription
                {
                    UserId = userId,
                    SubscriptionPlanId = dto.SubscriptionPlanId,
                    StartDate = today,
                    EndDate = today.AddDays(30),
                    Status = "Active"
                };

                await _repository.AddSubscriptionAsync(newSubscription);
            }

            // Persist the change to the database
            await _repository.SaveChangesAsync();


        }

        // Delete user
        public async Task DeleteUserAsync(int userId)
        {
            var user = await _repository.GetUserByIdAsync(userId);

            if (user == null)
                throw new KeyNotFoundException($"User with ID {userId} was not found.");

            await _repository.DeleteSubscriptionsByUserIdAsync(userId);

            await _repository.DeleteUserAsync(user);
            await _repository.SaveChangesAsync();
        }

        // Update Plan status
        public async Task UpdateUserStatusAsync(int userId, UpdateSubscriptionStatusDto dto)
        {
            //  Validate status value 
            var validStatuses = new[] { "Active", "Inactive" };

            if (!validStatuses.Contains(dto.Status))
                throw new ArgumentException(
                    $"Invalid status '{dto.Status}'. Valid values are: {string.Join(", ", validStatuses)}."
                );

            //  Validate user exists 
            if (!await _repository.UserExistsAsync(userId))
                throw new KeyNotFoundException($"User with ID {userId} was not found.");

            //  Find the active subscription 
            var activeSub = await _repository.GetActiveSubscriptionByUserIdAsync(userId);

            if (activeSub == null)
                throw new KeyNotFoundException(
                    $"No active subscription found for user ID {userId}. Cannot update status."
                );

            // Apply the new status
            activeSub.Status = dto.Status;
            await _repository.UpdateSubscriptionAsync(activeSub);
            await _repository.SaveChangesAsync();
        }
    }
}
