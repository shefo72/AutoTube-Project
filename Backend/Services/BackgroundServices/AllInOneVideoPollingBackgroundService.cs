using Autotube.Services.All_in_One.Video;

namespace Autotube.Services.BackgroundServices
{
    public class AllInOneVideoPollingBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<AllInOneVideoPollingBackgroundService> _logger;

        public AllInOneVideoPollingBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<AllInOneVideoPollingBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("AllInOne video polling started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();

                    var service =
                        scope.ServiceProvider
                        .GetRequiredService<IAllInOneVideoPollingService>();

                    await service.ProcessPendingVideosAsync();

                    _logger.LogInformation("AllInOne polling executed");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "AllInOne polling error");
                }

                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}
