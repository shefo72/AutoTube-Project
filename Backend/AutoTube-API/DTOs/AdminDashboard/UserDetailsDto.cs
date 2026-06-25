namespace Autotube.DTOs.ADashboardP
{
    public class UserDetailsDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Plan { get; set; } = "None";
        public string Status { get; set; } = "inactive";
        public DateTime Joined { get; set; }
        public string Revenue { get; set; } = "$0/mo";
        public int TotalAnalyses { get; set; }
        public int VideosCreated { get; set; }
        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public int TotalThumbnails { get; set; }
        public List<PerformancePointDto> Performance { get; set; } = new();
    }
}
