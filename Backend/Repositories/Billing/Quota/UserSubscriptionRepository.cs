using Autotube.Data;
using Autotube.Models;
using Microsoft.EntityFrameworkCore;

namespace Autotube.Repositories.Billing.Quota
{
    public class UserSubscriptionRepository : IUserSubscriptionRepository
    {
        private readonly AutoTubeDbContext _context;

        public UserSubscriptionRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        public async Task<UserSubscription?> GetByUserIdAsync(int userId)
        {
            return await _context.UserSubscriptions
                .Where(s => s.UserId == userId && s.IsActive)
                .OrderByDescending(s => s.Id)
                .FirstOrDefaultAsync();
        }

        public async Task AddAsync(UserSubscription subscription)
        {
            await _context.UserSubscriptions.AddAsync(subscription);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(UserSubscription subscription)
        {
            _context.UserSubscriptions.Update(subscription);
            await _context.SaveChangesAsync();
        }
    }

}
