using Autotube.DTOs.Dashboard;
using AutoTubeAPI.DTOs.Dashboard;
using AutoTubeAPI.Repositories.Dashboard;

namespace AutoTubeAPI.Services.Dashboard
{
    public class UserDashboardService : IUserDashboardService
    {
        private readonly IUserDashboardRepository _repo;

        public UserDashboardService(IUserDashboardRepository repo)
        {
            _repo = repo;
        }

        public async Task<DashboardResponseDto> GetDashboardAsync(int userId)
        {
            // STATS
            var analyses = await _repo.GetTotalAnalysesAsync(userId);
            var videos = await _repo.GetVideosGeneratedAsync(userId);
            var scripts = await _repo.GetScriptsGeneratedAsync(userId);
            var thumbnails = await _repo.GetThumbnailsGeneratedAsync(userId);
            var weeklyAnalyses = await _repo.GetWeeklyAnalysesAsync(userId);
            var weeklyScripts = await _repo.GetWeeklyScriptsAsync(userId);
            var weeklyVideos = await _repo.GetWeeklyVideosAsync(userId);
            var weeklyThumbnails = await _repo.GetWeeklyThumbnailsAsync(userId);

            // Top Opportunities
            var opportunities = await _repo.GetTopOpportunitiesAsync(userId);

            // Weekly Activity
            var activity = await _repo.GetUserActivityDatesAsync(userId);

            var activeDays = activity
               .Select(x => x.Date.Date)
               .Distinct()
               .Count();

            int featuresUsed = 0;

            if (weeklyAnalyses > 0)
                featuresUsed++;

            if (weeklyScripts > 0)
                featuresUsed++;

            if (weeklyThumbnails > 0)
                featuresUsed++;

            if (weeklyVideos > 0)
                featuresUsed++;


            var grouped = activity
                .GroupBy(x => x.Date.Date)
                .ToDictionary(g => g.Key, g => g.Count());

            // Most Used Feature
            var mostUsed = GetMostUsedFeature(scripts, thumbnails, videos, analyses);

            // Last Activity
            var lastActivity = activity.Count > 0
                ? activity.Max(x => x.Date)
                : (DateTime?)null;

            // Impact Score 
            var impact = CalculateImpactScore(
                weeklyScripts,
                weeklyThumbnails,
                weeklyVideos,
                weeklyAnalyses,
                activeDays,
                featuresUsed
            );

            var insight = GenerateInsight(
                weeklyScripts,
                weeklyThumbnails,
                weeklyVideos,
                weeklyAnalyses,
                activeDays
             );

            // Productivity Snapshot
            var snapshot = new ProductivitySnapshotDto
            {
                LastActivityAt = lastActivity ?? DateTime.UtcNow,
                LastActivityType = mostUsed,
                MostUsedFeature = mostUsed,

                WeeklyOutput = new WeeklyOutputDto
                {
                    Scripts = weeklyScripts,
                    Thumbnails = weeklyThumbnails,
                    Videos = weeklyVideos,
                    Analyses = weeklyAnalyses
                },

                ImpactScore = impact,

                Insight = insight
            };

            var growthOverview = new List<GrowthOverviewDto>();

            var startDate = DateTime.UtcNow.Date.AddDays(-6);

            for (int i = 0; i < 7; i++)
            {
                var day = startDate.AddDays(i);

                growthOverview.Add(new GrowthOverviewDto
                {
                    DayName = day.ToString("ddd"),
                    Value = grouped.TryGetValue(day, out var count)
                        ? count
                        : 0
                });
            }

            // Response
            return new DashboardResponseDto
            {
                TotalAnalyses = analyses,
                VideosGenerated = videos,
                ScriptsGenerated = scripts,
                ThumbnailsGenerated = thumbnails,

                TopOpportunities = opportunities,

                ProductivitySnapshot = snapshot,

                GrowthOverview = growthOverview

            };
        }

        // Helpers
        private string GetMostUsedFeature(
            int scripts,
            int thumbnails,
            int videos,
            int analyses)
        {
            var features = new Dictionary<string, int>
            {
              { "Script Generation", scripts },
              { "Thumbnail Generation", thumbnails },
              { "Video Generation", videos },
              { "Content Gap Analysis", analyses }
            };

            return features
                .OrderByDescending(x => x.Value)
                .First()
                .Key;
        }

        private int CalculateImpactScore(
           int scripts,
           int thumbnails,
           int videos,
           int analyses,
           int activeDays,
           int featuresUsed)
        {
            // Productivity (40)
            int productivity =
                Math.Min(
                    scripts * 2 +
                    thumbnails * 2 +
                    videos * 5 +
                    analyses,
                    40);

            // Consistency (30)
            int consistency = activeDays switch
            {
                >= 7 => 30,
                6 => 25,
                5 => 20,
                4 => 15,
                3 => 10,
                2 => 5,
                _ => 0
            };

            // Diversity (20)
            int diversity = featuresUsed switch
            {
                4 => 20,
                3 => 15,
                2 => 10,
                1 => 5,
                _ => 0
            };

            return Math.Min(
                productivity +
                consistency +
                diversity,
                100);
        }

        private string GenerateInsight(
           int scripts,
           int thumbnails,
           int videos,
           int analyses,
           int activeDays)
        {
            if (scripts == 0 && thumbnails == 0 && analyses == 0 && videos == 0)
            {
                return "No activity was detected during the last 7 days.";
            }

            if (scripts > videos * 3 && scripts >= 5)
            {
                return "You generated many scripts recently. Consider turning more of them into videos.";
            }

            if (videos >= 5)
            {
                return "Great momentum! Your video production activity is strong this week.";
            }

            if (analyses > scripts)
            {
                return "You are discovering opportunities faster than creating content. Try generating more scripts.";
            }

            if (activeDays >= 5)
            {
                return "Excellent consistency. You have been active across AutoTube on multiple days this week.";
            }

            return "Your activity is balanced across AutoTube features.";
        }

    }
}