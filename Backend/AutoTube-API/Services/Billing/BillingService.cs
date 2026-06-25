using Autotube.DTOs.Billing;
using Autotube.DTOs.Billing.Enums;
using Autotube.DTOs.BillingUsageP;
using Autotube.Repositories.Billing;
using Autotube.Services.Billing.Quota;

namespace Autotube.Services.Billing
{
    public class BillingService
    {
        private readonly BillingRepository _repo;
        private readonly IQuotaService _quotaService;
        private readonly ILogger<BillingService> _logger;

        public BillingService(
            BillingRepository repo,
            IQuotaService quotaService,
            ILogger<BillingService> logger)
        {
            _repo = repo;
            _quotaService = quotaService;
            _logger = logger;
        }

        // User subscription
        public async Task<SubscriptionDto?> GetSubscriptionAsync(
            int userId)
        {
            var subscription =
                await _repo.GetSubscriptionAsync(userId);

            if (subscription == null)
            {
                return null;
            }

            return new SubscriptionDto
            {
                SubscriptionId = subscription.Id,

                PlanName =
                    subscription.SubscriptionPlan?.Name ?? "",

                BillingCycle =
                    subscription.SubscriptionPlan?.BillingCycle ?? "",

                Price =
                    subscription.SubscriptionPlan?.Price ?? 0,

                Status = subscription.Status ?? "",

                StartDate = subscription.StartDate,

                EndDate = subscription.EndDate
            };
        }

        // Payment method
        public async Task<PaymentMethodDto?> GetPaymentMethodAsync(
            int userId)
        {
            var paymentMethod =
                await _repo.GetPaymentMethodAsync(userId);

            if (paymentMethod == null)
            {
                return null;
            }

            return new PaymentMethodDto
            {
                Id = paymentMethod.Id,

                CardHolderName =
                    paymentMethod.CardHolderName ?? "",

                CardLast4 =
                    paymentMethod.CardLast4 ?? "",

                ExpiryDate =
                    paymentMethod.ExpiryDate ?? "",

                PaymentProvider =
                    paymentMethod.PaymentGateway?.ProviderName
            };
        }

        // Credits summary — minimal data for the header "X / Y Credits"
        // badge. Calls IQuotaService directly and nothing else, so it stays
        // cheap enough to call on every page load (no per-feature
        // aggregation query, unlike GetUsageQuotaAsync below).
        public async Task<CreditsSummaryDto> GetCreditsSummaryAsync(
            int userId)
        {
            var quota = await _quotaService.GetQuotaAsync(userId);

            return new CreditsSummaryDto
            {
                CreditsRemaining = quota.CreditsRemaining,
                CreditsGranted = quota.CreditsGranted
            };
        }


        public async Task<UsageQuotaDto?> GetUsageQuotaAsync(
            int userId)
        {

            var quota = await _quotaService.GetQuotaAsync(userId);

            var planType = Enum.Parse<PlanType>(quota.Plan);
            var cycleStart = GetApproximateCycleStart(planType, quota.RenewalDate);

            var spentByFeature =
                await _repo.GetCreditsSpentByFeatureSinceAsync(userId, cycleStart);

            return new UsageQuotaDto
            {
                GapAnalysesUsed =
                    spentByFeature.GetValueOrDefault(CreditFeature.GapAnalysis),

                ScriptGenerationsUsed =
                    spentByFeature.GetValueOrDefault(CreditFeature.ScriptGeneration),

                VideoGenerationsUsed =
                    spentByFeature.GetValueOrDefault(CreditFeature.VideoGeneration),

                ThumbnailGenerationsUsed =
                    spentByFeature.GetValueOrDefault(CreditFeature.ThumbnailText)
                    + spentByFeature.GetValueOrDefault(CreditFeature.ThumbnailImage),

                AnalyticsUsed =
                    spentByFeature.GetValueOrDefault(CreditFeature.Analytics),

                AllInOneGenerationsUsed =
                    spentByFeature.GetValueOrDefault(CreditFeature.AllInOneGeneration),

                CreditsGranted = quota.CreditsGranted,

                CreditsRemaining = quota.CreditsRemaining,

                ResetDate =
                    quota.RenewalDate.ToString("MMMM d, yyyy")
            };
        }

        // Update payment method
        public async Task<bool> UpdatePaymentMethodAsync(
            int userId,
            UpdatePaymentMethodDto dto)
        {
            var paymentMethod =
                await _repo.GetPaymentMethodAsync(userId);

            if (paymentMethod == null)
            {
                return false;
            }

            // Validate card number
            if (dto.CardNumber.Length < 4)
            {
                throw new Exception(
                    "Card number must contain at least 4 digits.");
            }

            // Save last 4 digit only
            string last4 =
                dto.CardNumber.Substring(
                    dto.CardNumber.Length - 4);

            // Update data
            paymentMethod.CardHolderName =
                dto.CardHolderName;

            paymentMethod.CardLast4 =
                last4;

            paymentMethod.ExpiryDate =
                dto.ExpiryDate;


            // Save changes
            await _repo.UpdatePaymentMethodAsync(
                paymentMethod);

            return true;
        }

        private static DateTime GetApproximateCycleStart(PlanType plan, DateTime renewalDate)
        {
            return plan switch
            {
                PlanType.Starter => renewalDate.AddMonths(-1),
                PlanType.Pro => renewalDate.AddMonths(-1),
                PlanType.Premium => renewalDate.AddYears(-1),
                _ => renewalDate.AddMonths(-1)
            };
        }
    }
}