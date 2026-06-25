using Autotube.Models;
using Autotube.Data;
using Microsoft.EntityFrameworkCore;
using Autotube.DTOs.Billing.Enums;

namespace Autotube.Repositories.Billing
{
    public class BillingRepository
    {
        private readonly AutoTubeDbContext _context;

        public BillingRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        // Active subscription
        public async Task<Subscription?> GetSubscriptionAsync(int userId)
        {
            return await _context.Subscriptions
                .Include(x => x.SubscriptionPlan)
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.Status == "Active");
        }


        // Payment method
        public async Task<PaymentMethod?> GetPaymentMethodAsync(int userId)
        {
            return await _context.PaymentMethods
                .Include(x => x.PaymentGateway)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }


        // Usage quota (legacy table — kept for any other callers still using it)
        public async Task<UsageQuota?> GetUsageQuotaAsync(int userId)
        {
            return await _context.UsageQuotas
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }


        // Update payment method
        public async Task UpdatePaymentMethodAsync(
            PaymentMethod paymentMethod)
        {
            _context.PaymentMethods.Update(paymentMethod);

            await _context.SaveChangesAsync();
        }


        public async Task<Dictionary<CreditFeature, int>> GetCreditsSpentByFeatureSinceAsync(
            int userId,
            DateTime since)
        {
            var rows = await _context.CreditTransactions
                .Where(t =>
                    t.UserId == userId &&
                    t.TransactionType == TransactionType.Debit &&
                    t.CreatedAt >= since)
                .GroupBy(t => t.FeatureType)
                .Select(g => new
                {
                    Feature = g.Key,
                    TotalSpent = g.Sum(t => -t.Credits)
                })
                .ToListAsync();

            return rows.ToDictionary(r => r.Feature, r => r.TotalSpent);
        }
    }
}