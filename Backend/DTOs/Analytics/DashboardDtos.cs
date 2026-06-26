namespace Autotube.DTOs.Analytics;


public sealed record DashboardSummaryDto
{
    public long TotalViews { get; init; }
    public long Subscribers { get; init; }
    public double WatchTimeHours { get; init; }
    public double AvgEngagementRate { get; init; }
    public double AvgClickThroughRate { get; init; }
    public long VideoCount { get; init; }
}

public sealed record TopVideoDto
{
    public string VideoId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string ThumbnailUrl { get; init; } = string.Empty;
    public long Views { get; init; }
    public double EngagementRate { get; init; }
    public double GrowthPercent { get; init; }
    public string Category { get; init; } = string.Empty;
}

public sealed record GrowthTrendDto
{
    public DateTime Date { get; init; }
    public long Views { get; init; }
    public long Subscribers { get; init; }
    public double EngagementRate { get; init; }
    public double ClickThroughRate { get; init; }
}

public sealed record ContentCategoryDto
{
    public string Category { get; init; } = string.Empty;
    public int VideoCount { get; init; }
    public double Percentage { get; init; }
}