namespace Autotube.DTOs.Dashboard
{
    public class ProductivitySnapshotDto
    {
        public DateTime LastActivityAt { get; set; }
        public string LastActivityType { get; set; }
        public string MostUsedFeature { get; set; }

        public WeeklyOutputDto WeeklyOutput { get; set; }

        public int ImpactScore { get; set; }

        public string Insight { get; set; }
    }
}
