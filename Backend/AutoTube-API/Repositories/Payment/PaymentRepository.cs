using Autotube.Models;
using Autotube.Data;
using Microsoft.EntityFrameworkCore;

namespace Autotube.Repositories.Payment
{
    public class PaymentRepository
    {
        private readonly AutoTubeDbContext _context;

        public PaymentRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        // Create payment method
        public async Task<PaymentMethod> AddPaymentMethodAsync(PaymentMethod paymentMethod)
        {
            _context.PaymentMethods.Add(paymentMethod);

            await _context.SaveChangesAsync();

            return paymentMethod;
        }

        // Create subscription
        public async Task<Subscription> AddSubscriptionAsync(Subscription subscription)
        {
            _context.Subscriptions.Add(subscription);

            await _context.SaveChangesAsync();

            return subscription;
        }

        // Create or update usage quota
        public async Task SaveQuotaAsync(UsageQuota quota)
        {
            var existingQuota = await _context.UsageQuotas
                .FirstOrDefaultAsync(x => x.UserId == quota.UserId);

            if (existingQuota == null)
            {
                _context.UsageQuotas.Add(quota);
            }
            else
            {
                existingQuota.GapAnalysesUsed = quota.GapAnalysesUsed;
                existingQuota.ThumbnailOptimizationsUsed = quota.ThumbnailOptimizationsUsed;
                existingQuota.ScriptGenerationsUsed = quota.ScriptGenerationsUsed;
                existingQuota.VideoGenerationsUsed = quota.VideoGenerationsUsed;
                existingQuota.ContentGenerationsUsed = quota.ContentGenerationsUsed;
                existingQuota.PeriodStart = quota.PeriodStart;
                existingQuota.PeriodEnd = quota.PeriodEnd;
            }

            await _context.SaveChangesAsync();
        }

        // Get subscription Plan

        public async Task<SubscriptionPlan?> GetPlanAsync(int planId)
        {
            return await _context.SubscriptionPlans
                .FirstOrDefaultAsync(x => x.Id == planId);
        }

        // Get active subscription

        public async Task<Subscription?> GetActiveSubscriptionAsync(int userId)
        {
            return await _context.Subscriptions
                .Include(x => x.SubscriptionPlan)
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.Status == "Active");
        }

        // Cancel subscription
        public async Task CancelActiveSubscriptionAsync(int userId)
        {
            var sub = await _context.Subscriptions
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.Status == "Active");

            if (sub != null)
            {
                sub.Status = "Inactive";
                await _context.SaveChangesAsync();
            }
        }



        // Get payment gateway         
        public async Task<PaymentGateway?> GetPaymentGatewayAsync(int gatewayId)
        {
            return await _context.PaymentGateways
                .FirstOrDefaultAsync(x => x.Id == gatewayId);
        }
    }
}
