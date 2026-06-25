namespace Autotube.DTOs.BillingUsageP
{
    public class UsageQuotaDto
    {
        public int GapAnalysesUsed { get; set; }

        public int ScriptGenerationsUsed { get; set; }

        public int VideoGenerationsUsed { get; set; }

        public int ThumbnailGenerationsUsed { get; set; }

        public int AnalyticsUsed { get; set; }

        public int AllInOneGenerationsUsed { get; set; }

        public int CreditsGranted { get; set; }

        public int CreditsRemaining { get; set; }

        public string? ResetDate { get; set; }
    }
}