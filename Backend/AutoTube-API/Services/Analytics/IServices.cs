using Autotube.DTOs;
using AutoTube.DTOs;

namespace Autotube.Services.Analytics;

public interface IAnalyticsDashboardService
{
    Task<DashboardResponseDto> GetDashboardAsync(string channelId, int days, CancellationToken ct = default);
}

public interface IAnalyticsCalculationService
{
    double CalculateEngagementRate(long likes, long comments, long views);
    double CalculateAverageEngagementRate(IEnumerable<(long likes, long comments, long views)> videoStats);
    double CalculateVideoPerformanceScore(long views, double engagementRate, double ctr);
    double CalculateWatchTimeHours(long watchTimeMinutes);
    double CalculateGrowthPercent(long current, long previous);
}

public interface IYouTubeApiService
{
    Task<ChannelStatsDto?> GetChannelStatisticsAsync(string channelId, CancellationToken ct = default);

    Task<IReadOnlyList<YouTubeVideoItemDto>> GetChannelVideosAsync(string channelId, int maxResults = 50, CancellationToken ct = default);
}

public interface IChannelSyncService
{
    Task SyncChannelDataAsync(string channelId, CancellationToken ct = default);
}