using Autotube.DTOs.Billing.Enums;
using Autotube.DTOs.PaymentP;
using Autotube.Models;
using Autotube.Repositories.Billing.Quota;
using Autotube.Repositories.Payment;
using Autotube.Services.Billing.Quota;

namespace Autotube.Services.Payment
{
    public class PaymentService
    {
        private readonly PaymentRepository _repo;
        private readonly ILogger<PaymentService> _logger;
        private readonly IUserSubscriptionRepository _userSubscriptionRepository;

        public PaymentService(
            PaymentRepository repo,
            ILogger<PaymentService> logger,
            IUserSubscriptionRepository userSubscriptionRepository
            )
        {
            _repo = repo;
            _logger = logger;
            _userSubscriptionRepository = userSubscriptionRepository;
        }

        public async Task<SubscriptionResponseDto> CreateSubscriptionAsync(
            CreateSubscriptionDto dto,int userId)
        {
            try
            {
                // Validate plan
                var plan = await _repo.GetPlanAsync(dto.SubscriptionPlanId);

                if (plan == null)
                {
                    throw new Exception("Subscription plan not found.");
                }

                // Validate payment gateway
                var gateway = await _repo.GetPaymentGatewayAsync(dto.PaymentGatewayId);

                if (gateway == null)
                {
                    throw new Exception("Payment gateway not found.");
                }

                // Validate card number
                if (dto.CardNumber.Length < 4)
                {
                    throw new Exception(
                        "Card number must contain at least 4 digits.");
                }

                // Save last 4 digits
                var last4 = dto.CardNumber.Substring(
                    dto.CardNumber.Length - 4);

                // Create payment method
                var paymentMethod = new PaymentMethod
                {
                    UserId = userId,
                    PaymentGatewayId = dto.PaymentGatewayId,
                    CardHolderName = dto.CardHolderName,
                    CardLast4 = last4,
                    ExpiryDate = dto.ExpiryDate,
                    CreatedAt = DateTime.UtcNow
                };

                var savedPaymentMethod =
                    await _repo.AddPaymentMethodAsync(paymentMethod);

                // Calculate subscription end date
                DateTime endDate = plan.BillingCycle.ToLower() switch
                {
                    "monthly" => DateTime.UtcNow.AddMonths(1),

                    "yearly" => DateTime.UtcNow.AddYears(1),

                    _ => DateTime.UtcNow.AddMonths(1)
                };

                // Create subscription
                await _repo.CancelActiveSubscriptionAsync(userId);

                var subscription = new Subscription
                {
                    UserId = userId,
                    SubscriptionPlanId = dto.SubscriptionPlanId,
                    PaymentMethodId = savedPaymentMethod.Id,

                    Status = "Active",

                    StartDate = DateTime.UtcNow,
                    EndDate = endDate
                };

                var savedSubscription =
                    await _repo.AddSubscriptionAsync(subscription);

                var quotaSubscription =
    await _userSubscriptionRepository.GetByUserIdAsync(userId);

                var planType = dto.SubscriptionPlanId switch
                {
                    1 => PlanType.Starter,
                    2 => PlanType.Pro,
                    3 => PlanType.Premium,
                    _ => PlanType.Starter
                };

                var credits = PlanCatalog.GetCreditsForPlan(planType);

                if (quotaSubscription == null)
                {
                    quotaSubscription = new UserSubscription
                    {
                        UserId = userId,
                        PlanType = planType,
                        CreditsGranted = credits,
                        CreditsRemaining = credits,
                        StartDate = DateTime.UtcNow,
                        RenewalDate = PlanCatalog.GetNextRenewalDate(
                            planType,
                            DateTime.UtcNow),
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _userSubscriptionRepository.AddAsync(quotaSubscription);
                }
                else
                {
                    quotaSubscription.PlanType = planType;
                    quotaSubscription.CreditsGranted = credits;
                    quotaSubscription.CreditsRemaining = credits;
                    quotaSubscription.StartDate = DateTime.UtcNow;
                    quotaSubscription.RenewalDate =
                        PlanCatalog.GetNextRenewalDate(
                            planType,
                            DateTime.UtcNow);
                    quotaSubscription.IsActive = true;

                    await _userSubscriptionRepository.UpdateAsync(quotaSubscription);
                }

                // Create user quotas based on selected plan
                var quota = new UsageQuota
                {
                    UserId = userId,

                    GapAnalysesUsed = 0,
                    ThumbnailOptimizationsUsed = 0,
                    ScriptGenerationsUsed = 0,
                    VideoGenerationsUsed = 0,
                    ContentGenerationsUsed = 0,

                    PeriodStart = DateTime.UtcNow,
                    PeriodEnd = endDate
                };

                await _repo.SaveQuotaAsync(quota);

                // Return response
                return new SubscriptionResponseDto
                {
                    SubscriptionId = savedSubscription.Id,

                    PlanName = plan.Name,

                    BillingCycle = plan.BillingCycle,

                    Price = plan.Price,

                    Status = savedSubscription.Status,

                    StartDate = savedSubscription.StartDate,
                    EndDate = savedSubscription.EndDate,

                    CardLast4 = last4,

                    PaymentProvider = gateway.ProviderName
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Subscription creation failed.");

                throw;
            }
        }
    }
}