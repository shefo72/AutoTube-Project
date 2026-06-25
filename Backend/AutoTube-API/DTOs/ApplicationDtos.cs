using Autotube.DTOs.Analytics;

namespace AutoTube.DTOs;

public sealed record DashboardResponseDto
{
    public DashboardSummaryDto Summary { get; init; } = null!;
    public IReadOnlyList<TopVideoDto> TopVideos { get; init; } = [];
    public IReadOnlyList<GrowthTrendDto> GrowthTrends { get; init; } = [];
    public IReadOnlyList<ContentCategoryDto> ContentCategories { get; init; } = [];
}
public sealed record ChannelStatsDto
{
    public string ChannelId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public long SubscriberCount { get; init; }
    public long TotalViews { get; init; }
    public long VideoCount { get; init; }
}

public sealed record YouTubeVideoItemDto
{
    public string VideoId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string ThumbnailUrl { get; init; } = string.Empty;
    public long ViewCount { get; init; }
    public long LikeCount { get; init; }
    public long CommentCount { get; init; }
    public DateTime PublishedAt { get; init; }
    public string Category { get; init; } = string.Empty;
}