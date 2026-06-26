using Autotube.DTOs.Billing;
using Autotube.DTOs.Billing.Enums;

namespace Autotube.Services.Billing.Quota
{
    public interface IQuotaService
    {

        Task<bool> HasEnoughCreditsAsync(int userId, int requiredCredits);

        Task DeductCreditsAsync(int userId, int credits, CreditFeature feature, string? description = null);

        Task AddCreditsAsync(int userId, int credits, CreditFeature feature, string? description = null);

        Task<UserQuotaDto> GetQuotaAsync(int userId);

        Task<(List<CreditTransactionDto> Items, int TotalCount)> GetHistoryAsync(int userId, int page, int pageSize);
    }

}
