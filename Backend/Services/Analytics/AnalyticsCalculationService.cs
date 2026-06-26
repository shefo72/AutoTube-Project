namespace Autotube.Services.Analytics;

public sealed class AnalyticsCalculationService : IAnalyticsCalculationService
{
    public double CalculateEngagementRate(long likes, long comments, long views)
    {
        if (views <= 0) return 0;
        return Math.Round((double)(likes + comments) / views * 100, 2);
    }

    public double CalculateAverageEngagementRate(IEnumerable<(long likes, long comments, long views)> videoStats)
    {
        var stats = videoStats.ToList();
        if (stats.Count == 0) return 0;

        var totalEngagement = stats.Sum(s => CalculateEngagementRate(s.likes, s.comments, s.views));
        return Math.Round(totalEngagement / stats.Count, 2);
    }

    public double CalculateVideoPerformanceScore(long views, double engagementRate, double ctr)
    {
        // Weighted score: 40% views (normalized to 1M), 40% engagement, 20% CTR
        const double viewsWeight = 0.4;
        const double engagementWeight = 0.4;
        const double ctrWeight = 0.2;

        double normalizedViews = Math.Min((double)views / 1_000_000, 1.0) * 100;
        double normalizedEngagement = Math.Min(engagementRate / 15.0, 1.0) * 100;
        double normalizedCtr = Math.Min(ctr / 10.0, 1.0) * 100;

        return Math.Round(
            normalizedViews * viewsWeight +
            normalizedEngagement * engagementWeight +
            normalizedCtr * ctrWeight, 2);
    }

    public double CalculateWatchTimeHours(long watchTimeMinutes)
        => Math.Round((double)watchTimeMinutes / 60, 1);

    public double CalculateGrowthPercent(long current, long previous)
    {
        if (previous <= 0) return 0;
        return Math.Round((double)(current - previous) / previous * 100, 2);
    }
}
