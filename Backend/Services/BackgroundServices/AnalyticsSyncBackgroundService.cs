using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Autotube.Configuration;
using Autotube.Services.Analytics;

namespace Autotube.BackgroundServices;

public sealed class AnalyticsSyncBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AnalyticsSyncBackgroundService> _logger;
    private readonly BackgroundServiceOptions _options;

    public AnalyticsSyncBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<AnalyticsSyncBackgroundService> logger,
        IOptions<BackgroundServiceOptions> options)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Analytics sync background service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = ComputeNextRunDelay();
            _logger.LogInformation("Next analytics sync in {Delay}", delay);

            try
            {
                await Task.Delay(delay, stoppingToken);
                await RunSyncCycleAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Analytics sync service stopping");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled error in analytics sync cycle. Retrying in 5 minutes.");
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }

    private async Task RunSyncCycleAsync(CancellationToken ct)
    {
        _logger.LogInformation("Starting analytics sync cycle at {Time}", DateTime.UtcNow);

        using var scope = _scopeFactory.CreateScope();
        var syncService = scope.ServiceProvider.GetRequiredService<IChannelSyncService>();

        foreach (var channelId in _options.TrackedChannelIds)
        {
            try
            {
                await syncService.SyncChannelDataAsync(channelId, ct);
                _logger.LogInformation("Sync succeeded for channel {ChannelId}", channelId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to sync channel {ChannelId}", channelId);
            }
        }

        _logger.LogInformation("Analytics sync cycle completed at {Time}", DateTime.UtcNow);
    }

    private TimeSpan ComputeNextRunDelay()
    {
        var now = DateTime.UtcNow;
        var nextRun = now.Date.AddHours(_options.SyncHourUtc);
        if (nextRun <= now) nextRun = nextRun.AddDays(1);
        return nextRun - now;
    }
}
