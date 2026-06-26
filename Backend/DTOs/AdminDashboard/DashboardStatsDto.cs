namespace Autotube.DTOs.ADashboardP
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public double AvgAnalysesPerUser { get; set; }
    }
}
