using Autotube.Data;
using Autotube.Models;
using Microsoft.EntityFrameworkCore;

namespace Autotube.Repositories.Billing.Quota
{
    public class CreditTransactionRepository : ICreditTransactionRepository
    {
        private readonly AutoTubeDbContext _context;

        public CreditTransactionRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(CreditTransaction transaction)
        {
            await _context.CreditTransactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
        }

        public async Task<(List<CreditTransaction> Items, int TotalCount)> GetPagedByUserIdAsync(
            int userId, int page, int pageSize)
        {
            var query = _context.CreditTransactions
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }

}
