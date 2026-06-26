using Autotube.Configuration;
using Autotube.DTOs.Billing.Enums;
using Autotube.Exceptions;
using Autotube.Models;
using Autotube.Services.Analytics;
using Autotube.Services.Billing.Quota;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace AutoTube.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public sealed class DashboardController : ControllerBase
{
    private readonly IAnalyticsDashboardService _dashboardService;
    private readonly IChannelSyncService _syncService;
    private readonly IYouTubeApiService _youTubeApiService;
    private readonly IMemoryCache _cache;
    private readonly CacheOptions _cacheOptions;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(
        IAnalyticsDashboardService dashboardService,
        IChannelSyncService syncService,
        IYouTubeApiService youTubeApiService,
        IMemoryCache cache,
        IOptions<CacheOptions> cacheOptions,
        ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
        _syncService = syncService;
        _youTubeApiService = youTubeApiService;
        _cache = cache;
        _cacheOptions = cacheOptions.Value;
        _logger = logger;
    }


    // Retrieves the dashboard analytics for a specific channel over a given time range.
    [HttpGet("{channelId}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDashboard(string channelId, [FromQuery] int days = 7, CancellationToken ct = default)
    {
        var cacheKey = $"dashboard:{channelId}:days{days}";

        if (_cache.TryGetValue(cacheKey, out var cached))
        {
            _logger.LogDebug("Cache hit for channel {ChannelId} with range {Days}", channelId, days);
            return Ok(ApiResponse<object>.Ok(cached!, "Dashboard analytics fetched successfully"));
        }

        var result = await _dashboardService.GetDashboardAsync(channelId, days, ct);

        var responseData = new
        {
            summary = result.Summary,
            topVideos = result.TopVideos,
            growthTrends = result.GrowthTrends,
            contentCategories = result.ContentCategories
        };

        _cache.Set(cacheKey, responseData, TimeSpan.FromMinutes(_cacheOptions.DashboardCacheMinutes));

        return Ok(ApiResponse<object>.Ok(responseData, "Dashboard analytics fetched successfully"));
    }

    // Triggers a manual sync of channel data and clears the relevant cache entries.
    [HttpPost("{channelId}/sync")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SyncChannel(string channelId, CancellationToken ct)
    {
        _logger.LogInformation("Manual sync triggered for channel {ChannelId}", channelId);
        await _syncService.SyncChannelDataAsync(channelId, ct);


        _cache.Remove($"dashboard:{channelId}:days7");
        _cache.Remove($"dashboard:{channelId}:days30");
        _cache.Remove($"dashboard:{channelId}:days90");

        return Ok(ApiResponse<object>.Ok(new { channelId }, "Channel data synced successfully"));
    }
}