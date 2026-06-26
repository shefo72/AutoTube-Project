using Autotube.Data;
using Autotube.Models;
using Microsoft.EntityFrameworkCore;

namespace Autotube.Repositories.Onboarding
{
    public class OnboardingRepository : IOnboardingRepository
    {
        private readonly AutoTubeDbContext _context;

        public OnboardingRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        public async Task<List<ContentNich>> GetNichesByNamesAsync(List<string> names)
        {
            return await _context.ContentNiches
                .Where(n => names.Contains(n.NicheName))
                .ToListAsync();
        }

        public async Task<List<ContentGoal>> GetGoalsByLabelsAsync(List<string> labels)
        {
            return await _context.ContentGoals
                .Where(g => labels.Contains(g.GoalLabel))
                .ToListAsync();
        }

        public async Task<User> GetUserWithRelationsAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Niches)
                .Include(u => u.Goals)
                .FirstAsync(u => u.Id == userId);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}