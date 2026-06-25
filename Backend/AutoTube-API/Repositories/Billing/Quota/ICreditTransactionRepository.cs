using Autotube.Models;

namespace Autotube.Repositories.Billing.Quota
{
    public interface ICreditTransactionRepository
    {
        Task AddAsync(CreditTransaction transaction);


        Task<(List<CreditTransaction> Items, int TotalCount)> GetPagedByUserIdAsync(int userId, int page, int pageSize);
    }
}
