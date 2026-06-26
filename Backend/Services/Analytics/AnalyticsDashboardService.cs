using Autotube.DTOs;
using Autotube.DTOs.Analytics;
using Autotube.Models;
using Autotube.Repositories.Analytics;
using Autotube.Services.AdminDashboard;
using Autotube.Services.Script;
using AutoTube.DTOs;
using Microsoft.Extensions.Logging;

namespace Autotube.Services.Analytics;

public sealed class AnalyticsDashboardService : IAnalyticsDashboardService
{
    private readonly IChannelRepository _channelRepo;
    private readonly IVideoRepository _videoRepo;
    private readonly IAnalyticsSnapshotRepository _snapshotRepo;
    private readonly IHistoricalStatisticRepository _histRepo;
    private readonly IAnalyticsCalculationService _calculator;
    private readonly ILogger<AnalyticsDashboardService> _logger;

    public AnalyticsDashboardService(
        IChannelRepository channelRepo,
        IVideoRepository videoRepo,
        IAnalyticsSnapshotRepository snapshotRepo,
        IHistoricalStatisticRepository histRepo,
        IAnalyticsCalculationService calculator,
        ILogger<AnalyticsDashboardService> logger)
    {
        _channelRepo = channelRepo;
        _videoRepo = videoRepo;
        _snapshotRepo = snapshotRepo;
        _histRepo = histRepo;
        _calculator = calculator;
        _logger = logger;
    }

    public async Task<DashboardResponseDto> GetDashboardAsync(
        string channelId,
        int days,
        CancellationToken ct = default)
    {
        var channel = await _channelRepo.GetByChannelIdAsync(channelId, ct)
            ?? throw new KeyNotFoundException($"Channel '{channelId}' not found.");

        var latestSnapshot = await _snapshotRepo.GetLatestByChannelAsync(channelId, ct);

        var topVideos = await _videoRepo.GetTopVideosByChannelAsync(channelId, 10, ct);

        var snapshots = await _snapshotRepo.GetByChannelAsync(
            channelId,
            DateTime.UtcNow.AddDays(-days),
            DateTime.UtcNow,
            ct);

        var avgEngagementRate = _calculator.CalculateAverageEngagementRate(
            topVideos.Select(v => (v.LikeCount, v.CommentCount, v.ViewCount)));

        var watchTimeMinutes = latestSnapshot?.WatchTimeMinutes ?? channel.TotalViews * 2;
        var watchTimeHours = _calculator.CalculateWatchTimeHours(watchTimeMinutes);

        var summary = new DashboardSummaryDto
        {
            TotalViews = channel.TotalViews,
            Subscribers = channel.SubscriberCount,
            WatchTimeHours = watchTimeHours,
            AvgEngagementRate = avgEngagementRate,
            AvgClickThroughRate = latestSnapshot?.AvgClickThroughRate ?? 0,
            VideoCount = channel.VideoCount
        };

        var topVideoDtos = topVideos.Select(v => new TopVideoDto
        {
            VideoId = v.VideoId,
            Title = v.Title,
            ThumbnailUrl = v.ThumbnailUrl,
            Views = v.ViewCount,
            EngagementRate = _calculator.CalculateEngagementRate(v.LikeCount, v.CommentCount, v.ViewCount),
            GrowthPercent = 0, 
            Category = v.Category
        }).ToList();

        var growthTrends = snapshots
            .OrderBy(s => s.RecordedAt)
            .Select(s => new GrowthTrendDto
            {
                Date = s.RecordedAt.Date,
                Views = s.TotalViews,
                Subscribers = s.SubscriberCount,
                EngagementRate = s.AvgEngagementRate,
                ClickThroughRate = s.AvgClickThroughRate
            }).ToList();

        var distributionData = await _videoRepo.GetDistributionAsync(channelId, "Performance", ct);

        var totalVideos = distributionData.Sum(d => d.Value);

        var contentCategories = distributionData.Select(d => new ContentCategoryDto
        {
            Category = d.Label,
            VideoCount = (int)d.Value,
            Percentage = totalVideos > 0 ? (double)d.Value / totalVideos * 100 : 0
        }).ToList();

        return new DashboardResponseDto
        {
            Summary = summary,
            TopVideos = topVideoDtos,
            GrowthTrends = growthTrends,
            ContentCategories = contentCategories
        };
    }
}