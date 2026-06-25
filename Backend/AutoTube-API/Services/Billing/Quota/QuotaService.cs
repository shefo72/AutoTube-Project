using Autotube.DTOs.Billing;
using Autotube.DTOs.Billing.Enums;
using Autotube.Exceptions;
using Autotube.Models;
using Autotube.Repositories.Billing.Quota;

namespace Autotube.Services.Billing.Quota
{
    public class QuotaService : IQuotaService
    {
        private readonly IUserSubscriptionRepository _subscriptionRepository;
        private readonly ICreditTransactionRepository _transactionRepository;

        public QuotaService(
            IUserSubscriptionRepository subscriptionRepository,
            ICreditTransactionRepository transactionRepository)
        {
            _subscriptionRepository = subscriptionRepository;
            _transactionRepository = transactionRepository;
        }

        public async Task<bool> HasEnoughCreditsAsync(int userId, int requiredCredits)
        {
            var subscription = await GetOrCreateSubscriptionAsync(userId);
            await RenewIfDueAsync(subscription);

            return subscription.CreditsRemaining >= requiredCredits;
        }

        public async Task DeductCreditsAsync(int userId, int credits, CreditFeature feature, string? description = null)
        {
            var subscription = await GetOrCreateSubscriptionAsync(userId);
            await RenewIfDueAsync(subscription);

            if (subscription.CreditsRemaining < credits)
            {
                throw new InsufficientCreditsException(credits, subscription.CreditsRemaining);
            }

            subscription.CreditsRemaining -= credits;
            await _subscriptionRepository.UpdateAsync(subscription);

            await _transactionRepository.AddAsync(new CreditTransaction
            {
                UserId = userId,
                Credits = -credits,
                TransactionType = TransactionType.Debit,
                FeatureType = feature,
                Description = description ?? feature.ToString(),
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task AddCreditsAsync(int userId, int credits, CreditFeature feature, string? description = null)
        {
            var subscription = await GetOrCreateSubscriptionAsync(userId);

            subscription.CreditsRemaining += credits;
            await _subscriptionRepository.UpdateAsync(subscription);

            await _transactionRepository.AddAsync(new CreditTransaction
            {
                UserId = userId,
                Credits = credits,
                TransactionType = TransactionType.Credit,
                FeatureType = feature,
                Description = description ?? feature.ToString(),
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task<UserQuotaDto> GetQuotaAsync(int userId)
        {
            var subscription = await GetOrCreateSubscriptionAsync(userId);
            await RenewIfDueAsync(subscription);

            return new UserQuotaDto
            {
                Plan = subscription.PlanType.ToString(),
                CreditsGranted = subscription.CreditsGranted,
                CreditsRemaining = subscription.CreditsRemaining,
                RenewalDate = subscription.RenewalDate
            };
        }

        public async Task<(List<CreditTransactionDto> Items, int TotalCount)> GetHistoryAsync(int userId, int page, int pageSize)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 20;

            var (items, totalCount) = await _transactionRepository.GetPagedByUserIdAsync(userId, page, pageSize);

            var dtos = items.ConvertAll(t => new CreditTransactionDto
            {
                Id = t.Id,
                Credits = t.Credits,
                TransactionType = t.TransactionType.ToString(),
                FeatureType = t.FeatureType.ToString(),
                Description = t.Description,
                CreatedAt = t.CreatedAt
            });

            return (dtos, totalCount);
        }


        private async Task<UserSubscription> GetOrCreateSubscriptionAsync(int userId)
        {
            var subscription = await _subscriptionRepository.GetByUserIdAsync(userId);
            if (subscription != null)
            {
                return subscription;
            }

            var now = DateTime.UtcNow;
            var starterCredits = PlanCatalog.GetCreditsForPlan(PlanType.Starter);

            subscription = new UserSubscription
            {
                UserId = userId,
                PlanType = PlanType.Starter,
                CreditsGranted = starterCredits,
                CreditsRemaining = starterCredits,
                StartDate = now,
                RenewalDate = PlanCatalog.GetNextRenewalDate(PlanType.Starter, now),
                IsActive = true,
                CreatedAt = now
            };

            await _subscriptionRepository.AddAsync(subscription);

            await _transactionRepository.AddAsync(new CreditTransaction
            {
                UserId = userId,
                Credits = starterCredits,
                TransactionType = TransactionType.Credit,
                FeatureType = CreditFeature.Renewal,
                Description = "StarterRenewal",
                CreatedAt = now
            });

            return subscription;
        }


        private async Task RenewIfDueAsync(UserSubscription subscription)
        {
            var now = DateTime.UtcNow;

            if (subscription.RenewalDate > now)
            {
                return;
            }

            var creditsForPlan = PlanCatalog.GetCreditsForPlan(subscription.PlanType);

            subscription.CreditsGranted = creditsForPlan;
            subscription.CreditsRemaining = creditsForPlan;
            subscription.RenewalDate = PlanCatalog.GetNextRenewalDate(subscription.PlanType, now);

            await _subscriptionRepository.UpdateAsync(subscription);

            await _transactionRepository.AddAsync(new CreditTransaction
            {
                UserId = subscription.UserId,
                Credits = creditsForPlan,
                TransactionType = TransactionType.Credit,
                FeatureType = CreditFeature.Renewal,
                Description = $"{subscription.PlanType}Renewal",
                CreatedAt = now
            });
        }
    }

}
