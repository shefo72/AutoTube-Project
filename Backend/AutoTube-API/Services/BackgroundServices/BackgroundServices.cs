using AutoTubeAPI.Services.VideoGeneration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AutoTubeAPI.BackgroundServices
{
    public class VideoPollingBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<VideoPollingBackgroundService> _logger;

        private bool _isRunning = false;

        public VideoPollingBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<VideoPollingBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            _logger.LogInformation("Video polling background service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                if (_isRunning)
                {
                    _logger.LogWarning("Previous polling still running, skipping cycle");
                    await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                    continue;
                }

                try
                {
                    _isRunning = true;

                    using var scope = _scopeFactory.CreateScope();

                    var videoService =
                        scope.ServiceProvider
                        .GetRequiredService<IVideoGenerationService>();

                    await videoService.PollVideoStatusAsync();

                    _logger.LogInformation(
                        "Video polling executed at {Time}",
                        DateTime.UtcNow);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during video polling");
                }
                finally
                {
                    _isRunning = false;
                }

                try
                {
                    await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    break;
                }
            }

            _logger.LogInformation("Video polling background service stopped");
        }
    }
}