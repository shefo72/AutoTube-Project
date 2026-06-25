using Autotube.Models;
using Autotube.DTOs.Onboarding;

namespace Autotube.Repositories.Onboarding
{
    public interface IOnboardingRepository
    {
        Task<List<ContentNich>> GetNichesByNamesAsync(List<string> names);
        Task<List<ContentGoal>> GetGoalsByLabelsAsync(List<string> labels);

        Task<User> GetUserWithRelationsAsync(int userId);

        Task SaveChangesAsync();
    }
}
