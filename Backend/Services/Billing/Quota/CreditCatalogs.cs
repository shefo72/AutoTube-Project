using Autotube.DTOs.Billing.Enums;

namespace Autotube.Services.Billing.Quota
{
    public static class PlanCatalog
    {
        public static int GetCreditsForPlan(PlanType plan) => plan switch
        {
            PlanType.Starter => 50,
            PlanType.Pro => 300,
            PlanType.Premium => 2000,
            _ => throw new ArgumentOutOfRangeException(nameof(plan), plan, "Unknown plan type.")
        };

        public static DateTime GetNextRenewalDate(PlanType plan, DateTime from) => plan switch
        {
            PlanType.Starter => from.AddMonths(1),
            PlanType.Pro => from.AddMonths(1),
            PlanType.Premium => from.AddYears(1),
            _ => throw new ArgumentOutOfRangeException(nameof(plan), plan, "Unknown plan type.")
        };
    }


    public static class CreditCosts
    {
        public const int ScriptGeneration = 10;
        public const int GapAnalysis = 20;
        public const int Analytics = 15;
        public const int AllInOneGeneration = 30;
        public const int ThumbnailText = 5;
        public const int ThumbnailImage = 10;

        public static int GetVideoGenerationCost(int durationInSeconds) => durationInSeconds;
    }

}
