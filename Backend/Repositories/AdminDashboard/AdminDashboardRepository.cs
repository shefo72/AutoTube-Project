using Autotube.Data;
using Autotube.DTOs.ADashboardP;
using Autotube.Models;
using Google;
using Microsoft.EntityFrameworkCore;

namespace Autotube.Repositories.AdmninDashboard
{
    public class AdminDashboardRepository : IAdminDashboardRepository
    {
        private readonly AutoTubeDbContext _context;
        public AdminDashboardRepository(AutoTubeDbContext context)
        {
            _context = context;
        }


        // Stats
        public async Task<int> GetTotalUsersAsync()
        {
            return await _context.Users.CountAsync();
        }
        public async Task<int> GetActiveUsersCountAsync()
        {
            var today = DateTime.UtcNow;

            return await _context.Subscriptions
                .Where(s =>
                    s.Status == "Active" &&
                    s.EndDate >= today)
                .Select(s => s.UserId)
                .Distinct()
                .CountAsync();
        }

        public async Task<decimal> GetMonthlyRevenueAsync()
        {
            var today = DateTime.UtcNow;

            return await _context.Subscriptions
                .Where(s =>
                    s.Status == "Active" &&
                    s.EndDate >= today)
                .Select(s => (decimal?)s.SubscriptionPlan.Price)
                .SumAsync() ?? 0;
        }


        public async Task<double> GetAvgAnalysesPerUserAsync()
        {
            var today = DateTime.UtcNow;

            var activeUserIds = await _context.Subscriptions
                .Where(s => s.Status == "Active" && s.EndDate >= today)
                .Select(s => s.UserId)
                .Distinct()
                .ToListAsync();

            if (!activeUserIds.Any())
                return 0;

            var totalAnalyses = await _context.ContentGapAnalyses
                .Where(a => activeUserIds.Contains(a.UserId))
                .CountAsync();

            return (double)totalAnalyses / activeUserIds.Count;
        }


        // Users
        public async Task<List<UserManagementDto>> GetAllUsersForManagementAsync()
        {
            var today = DateTime.UtcNow;

            var users = await _context.Users
                .AsNoTracking()
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.SubscriptionPlan)
                .Include(u => u.ContentGapAnalyses)
                .Include(u => u.GeneratedVideos)
                .OrderBy(u => u.Id)
                .ToListAsync();

            return users.Select(user =>
            {

                var currentSub = user.Subscriptions
                    .Where(s => s.Status == "Active" && s.EndDate >= today)
                    .OrderByDescending(s => s.EndDate)
                    .FirstOrDefault()
                    ?? user.Subscriptions
                        .OrderByDescending(s => s.EndDate)
                        .ThenByDescending(s => s.StartDate)
                        .FirstOrDefault();

                bool isActive = currentSub != null
                    && currentSub.Status == "Active"
                    && currentSub.EndDate >= today;

                return new UserManagementDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Plan = isActive ? currentSub!.SubscriptionPlan?.Name ?? "Starter" : "Starter",
                    Status = isActive ? "active" : "inactive",
                    Analyses = user.ContentGapAnalyses.Count,
                    Videos = user.GeneratedVideos.Count,
                    Revenue = isActive ? $"${currentSub!.SubscriptionPlan?.Price}/mo" : "$0/mo"
                };
            }).ToList();
        }


        // User details
        public async Task<UserDetailsDto?> GetUserDetailsByIdAsync(int userId)
        {
            var today = DateTime.UtcNow;

            var user = await _context.Users
                .AsNoTracking()
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.SubscriptionPlan)
                .Include(u => u.ContentGapAnalyses)
                .Include(u => u.GeneratedVideos)
                .Include(u => u.GeneratedThumbnails)
                .Include(u => u.UploadedImageThumbnails)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            // Priority 1: active + non-expired. Priority 2: most recent by EndDate.
            var currentSub = user.Subscriptions
                .Where(s => s.Status == "Active" && s.EndDate >= today)
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefault()
                ?? user.Subscriptions
                    .OrderByDescending(s => s.EndDate)
                    .ThenByDescending(s => s.StartDate)
                    .FirstOrDefault();

            bool isActive = currentSub != null
                && currentSub.Status == "Active"
                && currentSub.EndDate >= today;

            return new UserDetailsDto
            {
                Id = user.Id,

                FullName = user.FullName,

                Email = user.Email,

                Plan = isActive ? currentSub!.SubscriptionPlan?.Name ?? "None" : "None",

                Status = isActive ? "active" : "inactive",

                Joined = user.CreatedAt,

                Revenue = isActive
                    ? $"${currentSub!.SubscriptionPlan?.Price}/mo"
                    : "$0/mo",

                TotalAnalyses = user.ContentGapAnalyses.Count,

                VideosCreated = user.GeneratedVideos.Count,

                SubscriptionStartDate = currentSub?.StartDate,

                SubscriptionEndDate = currentSub?.EndDate,

                TotalThumbnails =
                    user.GeneratedThumbnails.Count +
                    user.UploadedImageThumbnails.Count,

                Performance = await GetUserPerformanceAsync(userId)
            };
        }

        // Performance
        public async Task<List<PerformancePointDto>> GetUserPerformanceAsync(int userId)
        {
            var currentYear = DateTime.UtcNow.Year;

            var analysesByMonth = await _context.ContentGapAnalyses
                .AsNoTracking()
                .Where(a => a.UserId == userId && a.CreatedAt.HasValue && a.CreatedAt.Value.Year == currentYear)
                .GroupBy(a => a.CreatedAt.Value.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            var videosByMonth = await _context.GeneratedVideos
                .AsNoTracking()
                .Where(v => v.UserId == userId && v.CreatedAt.HasValue && v.CreatedAt.Value.Year == currentYear)
                .GroupBy(v => v.CreatedAt.Value.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            var thumbnailsByMonth = await _context.GeneratedThumbnails
                .AsNoTracking()
                .Where(t => t.UserId == userId && t.CreatedAt.HasValue && t.CreatedAt.Value.Year == currentYear)
                .GroupBy(t => t.CreatedAt.Value.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            // Also include uploaded image thumbnails in the performance chart
            var uploadedThumbsByMonth = await _context.UploadedImageThumbnails
                .AsNoTracking()
                .Where(t => t.UserId == userId && t.CreatedAt.HasValue && t.CreatedAt.Value.Year == currentYear)
                .GroupBy(t => t.CreatedAt.Value.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            // Combine all monthly counts into one list 
            var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

            var result = new List<PerformancePointDto>();

            for (int month = 1; month <= 12; month++)
            {
                // Look up count for this month — default to 0 if no data
                int analyses = analysesByMonth.FirstOrDefault(x => x.Month == month)?.Count ?? 0;
                int videos = videosByMonth.FirstOrDefault(x => x.Month == month)?.Count ?? 0;
                int thumbnails = thumbnailsByMonth.FirstOrDefault(x => x.Month == month)?.Count ?? 0;
                int uploaded = uploadedThumbsByMonth.FirstOrDefault(x => x.Month == month)?.Count ?? 0;

                result.Add(new PerformancePointDto
                {
                    Month = months[month - 1],
                    Views = analyses + videos + thumbnails + uploaded
                });
            }

            return result;
        }


        // subscription methods
        public async Task<Subscription?> GetActiveSubscriptionByUserIdAsync(int userId)
        {
            var today = DateTime.UtcNow;

            return await _context.Subscriptions
                .Include(s => s.SubscriptionPlan)
                .FirstOrDefaultAsync(s =>
                    s.UserId == userId &&
                    s.Status == "Active" &&
                    s.EndDate >= today);
        }

        public async Task<SubscriptionPlan?> GetSubscriptionPlanByIdAsync(int planId)
        {
            return await _context.SubscriptionPlans
                .AsNoTracking()
                .FirstOrDefaultAsync(sp => sp.Id == planId);
        }
        public async Task<List<Subscription>> GetExpiredActiveSubscriptionsAsync()
        {
            var today = DateTime.UtcNow;

            return await _context.Subscriptions
                .Where(s => s.Status == "Active" && s.EndDate < today)
                .ToListAsync();
        }


        // User methods
        public async Task<bool> UserExistsAsync(int userId)
        {
            return await _context.Users.AnyAsync(u => u.Id == userId);
        }


        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Subscriptions)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            return Task.CompletedTask;
        }


        public Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            return Task.CompletedTask;
        }


        // Add sybscription
        public async Task AddSubscriptionAsync(Subscription subscription)
        {
            await _context.Subscriptions.AddAsync(subscription);
        }


        public Task UpdateSubscriptionAsync(Subscription subscription)
        {
            _context.Subscriptions.Update(subscription);
            return Task.CompletedTask;
        }

        public async Task DeleteSubscriptionsByUserIdAsync(int userId)
        {
            var subs = await _context.Subscriptions
                .Where(s => s.UserId == userId)
                .ToListAsync();

            if (subs.Any())
                _context.Subscriptions.RemoveRange(subs);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
