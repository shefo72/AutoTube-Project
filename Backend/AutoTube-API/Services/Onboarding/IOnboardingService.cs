using Autotube.DTOs.Onboarding;

namespace Autotube.Services.Onboarding
{
    public interface IOnboardingService
    {
        Task SaveUserNichesAsync(int userId, SaveNichesDto dto);
        Task SaveUserGoalsAsync(int userId, SaveGoalsDto dto);
    }
}
