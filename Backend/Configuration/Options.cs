namespace Autotube.Configuration;

public sealed class YouTubeApiOptions
{
    public const string SectionName = "YouTubeApi";
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://www.googleapis.com/youtube/v3/";
    public int TimeoutSeconds { get; set; } = 30;
    public int RetryCount { get; set; } = 3;
}

public sealed class BackgroundServiceOptions
{
    public const string SectionName = "BackgroundService";
    public int SyncHourUtc { get; set; } = 2;
    public List<string> TrackedChannelIds { get; set; } = [];
}

public sealed class CacheOptions
{
    public const string SectionName = "Cache";
    public int DashboardCacheMinutes { get; set; } = 15;
}
