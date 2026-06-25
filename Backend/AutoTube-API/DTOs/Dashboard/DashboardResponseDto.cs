using Autotube.DTOs.Dashboard;

namespace AutoTubeAPI.DTOs.Dashboard
{
    public class DashboardResponseDto
    {
        public int TotalAnalyses { get; set; }

        public int VideosGenerated { get; set; }

        public int ScriptsGenerated { get; set; }

        public int ThumbnailsGenerated { get; set; }

        public List<TopOpportunityDto> TopOpportunities { get; set; }

        public ProductivitySnapshotDto ProductivitySnapshot { get; set; }

        public List<GrowthOverviewDto> GrowthOverview { get; set; }
    }
}

