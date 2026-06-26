using Autotube.Models;

namespace Autotube.Repositories.Billing.Quota
{
    public interface IUserSubscriptionRepository
    {
        Task<UserSubscription?> GetByUserIdAsync(int userId);

        Task AddAsync(UserSubscription subscription);

        Task UpdateAsync(UserSubscription subscription);
    }
}
