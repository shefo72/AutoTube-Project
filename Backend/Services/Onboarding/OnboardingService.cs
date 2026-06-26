using Autotube.DTOs.Onboarding;
using Autotube.Repositories.Onboarding;


namespace Autotube.Services.Onboarding
{
    public class OnboardingService : IOnboardingService
    {
        private readonly IOnboardingRepository _repo;

        public OnboardingService(IOnboardingRepository repo)
        {
            _repo = repo;
        }

        public async Task SaveUserNichesAsync(int userId, SaveNichesDto dto)
        {
            var user = await _repo.GetUserWithRelationsAsync(userId);
            var niches = await _repo.GetNichesByNamesAsync(dto.Niches);

            user.Niches = niches;

            await _repo.SaveChangesAsync();
        }

        public async Task SaveUserGoalsAsync(int userId, SaveGoalsDto dto)
        {
            var user = await _repo.GetUserWithRelationsAsync(userId);
            var goals = await _repo.GetGoalsByLabelsAsync(dto.Goals);

            user.Goals = goals;

            await _repo.SaveChangesAsync();
        }
    }
}
