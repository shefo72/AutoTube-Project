using Autotube.Configuration;
using Autotube.DTOs.Analytics;
using AutoTube.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace Autotube.Services.Analytics;

public sealed class YouTubeApiService : IYouTubeApiService
{
    private readonly HttpClient _httpClient;
    private readonly YouTubeApiOptions _options;
    private readonly ILogger<YouTubeApiService> _logger;

    public YouTubeApiService(
        HttpClient httpClient,
        IOptions<YouTubeApiOptions> options,
        ILogger<YouTubeApiService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<ChannelStatsDto?> GetChannelStatisticsAsync(string channelId, CancellationToken ct = default)
    {
        var url = $"channels?part=snippet,statistics&id={channelId}&key={_options.ApiKey}";
        _logger.LogInformation("Fetching channel stats from YouTube API for {ChannelId}", channelId);

        var response = await _httpClient.GetFromJsonAsync<YouTubeChannelListResponse>(url, ct);
        var item = response?.Items?.FirstOrDefault();
        if (item is null) return null;

        return new ChannelStatsDto
        {
            ChannelId = channelId,
            Title = item.Snippet?.Title ?? string.Empty,
            SubscriberCount = long.TryParse(item.Statistics?.SubscriberCount, out var subs) ? subs : 0,
            TotalViews = long.TryParse(item.Statistics?.ViewCount, out var views) ? views : 0,
            VideoCount = long.TryParse(item.Statistics?.VideoCount, out var vids) ? vids : 0
        };
    }

    public async Task<IReadOnlyList<YouTubeVideoItemDto>> GetChannelVideosAsync(string channelId, int maxResults = 50, CancellationToken ct = default)
    {
        var url = $"search?part=snippet&channelId={channelId}&maxResults={maxResults}&order=viewCount&type=video&key={_options.ApiKey}";
        _logger.LogInformation("Fetching videos for channel {ChannelId}", channelId);

        var searchResponse = await _httpClient.GetFromJsonAsync<YouTubeSearchListResponse>(url, ct);
        if (searchResponse?.Items is null or { Count: 0 }) return [];

        var videoIds = string.Join(",", searchResponse.Items.Select(i => i.Id?.VideoId));
        var statsUrl = $"videos?part=snippet,statistics,contentDetails&id={videoIds}&key={_options.ApiKey}";
        var videoResponse = await _httpClient.GetFromJsonAsync<YouTubeVideoListResponse>(statsUrl, ct);

        return videoResponse?.Items?.Select(v => new YouTubeVideoItemDto
        {
            VideoId = v.Id ?? string.Empty,
            Title = v.Snippet?.Title ?? string.Empty,
            Description = v.Snippet?.Description ?? string.Empty,
            ThumbnailUrl = v.Snippet?.Thumbnails?.Medium?.Url ?? string.Empty,
            ViewCount = long.TryParse(v.Statistics?.ViewCount, out var vc) ? vc : 0,
            LikeCount = long.TryParse(v.Statistics?.LikeCount, out var lc) ? lc : 0,
            CommentCount = long.TryParse(v.Statistics?.CommentCount, out var cc) ? cc : 0,
            PublishedAt = DateTime.TryParse(v.Snippet?.PublishedAt, out var pub) ? pub : DateTime.UtcNow,
            Category = v.Snippet?.CategoryId ?? "Uncategorized"
        }).ToList() ?? [];
    }

    // --- YouTube API response models ---
    private sealed record YouTubeChannelListResponse(
        [property: JsonPropertyName("items")] List<YouTubeChannelItem>? Items);

    private sealed record YouTubeChannelItem(
        [property: JsonPropertyName("snippet")] YouTubeChannelSnippet? Snippet,
        [property: JsonPropertyName("statistics")] YouTubeChannelStatistics? Statistics);

    private sealed record YouTubeChannelSnippet(
        [property: JsonPropertyName("title")] string? Title);

    private sealed record YouTubeChannelStatistics(
        [property: JsonPropertyName("subscriberCount")] string? SubscriberCount,
        [property: JsonPropertyName("viewCount")] string? ViewCount,
        [property: JsonPropertyName("videoCount")] string? VideoCount);

    private sealed record YouTubeSearchListResponse(
        [property: JsonPropertyName("items")] List<YouTubeSearchItem>? Items);

    private sealed record YouTubeSearchItem(
        [property: JsonPropertyName("id")] YouTubeSearchItemId? Id);

    private sealed record YouTubeSearchItemId(
        [property: JsonPropertyName("videoId")] string? VideoId);

    private sealed record YouTubeVideoListResponse(
        [property: JsonPropertyName("items")] List<YouTubeVideoItem>? Items);

    private sealed record YouTubeVideoItem(
        [property: JsonPropertyName("id")] string? Id,
        [property: JsonPropertyName("snippet")] YouTubeVideoSnippet? Snippet,
        [property: JsonPropertyName("statistics")] YouTubeVideoStatistics? Statistics);

    private sealed record YouTubeVideoSnippet(
        [property: JsonPropertyName("title")] string? Title,
        [property: JsonPropertyName("description")] string? Description,
        [property: JsonPropertyName("publishedAt")] string? PublishedAt,
        [property: JsonPropertyName("categoryId")] string? CategoryId,
        [property: JsonPropertyName("thumbnails")] YouTubeThumbnails? Thumbnails);

    private sealed record YouTubeThumbnails(
        [property: JsonPropertyName("medium")] YouTubeThumbnail? Medium);

    private sealed record YouTubeThumbnail(
        [property: JsonPropertyName("url")] string? Url);

    private sealed record YouTubeVideoStatistics(
        [property: JsonPropertyName("viewCount")] string? ViewCount,
        [property: JsonPropertyName("likeCount")] string? LikeCount,
        [property: JsonPropertyName("commentCount")] string? CommentCount);
}