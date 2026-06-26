using Autotube.Configuration;
using Autotube.Data;
using Autotube.BackgroundServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using Polly;
using Polly.Extensions.Http;
using Autotube.Services.Analytics;
using Autotube.Repositories.Analytics;

namespace Autotube.Services.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AutoTubeDbContext>(options =>
                options.UseSqlServer( 
                    config.GetConnectionString("DefaultConnection"),
                    sqlOptions =>    
                    {
                        sqlOptions.EnableRetryOnFailure(3);
                    }));

            return services;
        }

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IChannelRepository, ChannelRepository>();
            services.AddScoped<IVideoRepository, VideoRepository>();
            services.AddScoped<IAnalyticsSnapshotRepository, AnalyticsSnapshotRepository>();
            services.AddScoped<IHistoricalStatisticRepository, HistoricalStatisticRepository>();
            return services;
        }

        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IAnalyticsDashboardService, AnalyticsDashboardService>();
            services.AddScoped<IAnalyticsCalculationService, AnalyticsCalculationService>();
            services.AddScoped<IChannelSyncService, ChannelSyncService>();
            return services;
        }

        public static IServiceCollection AddYouTubeApiClient(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<YouTubeApiOptions>(config.GetSection(YouTubeApiOptions.SectionName));

            services.AddHttpClient<IYouTubeApiService, YouTubeApiService>((sp, client) =>
            {
                var opts = sp.GetRequiredService<IOptions<YouTubeApiOptions>>().Value;
                client.BaseAddress = new Uri(opts.BaseUrl);
                client.Timeout = TimeSpan.FromSeconds(opts.TimeoutSeconds);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            return services;
        }

        public static IServiceCollection AddBackgroundSync(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<BackgroundServiceOptions>(config.GetSection(BackgroundServiceOptions.SectionName));
            services.AddHostedService<AnalyticsSyncBackgroundService>();
            return services;
        }

        public static IServiceCollection AddSwaggerDocs(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            return services;
        }

        private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
            => HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(3, retry => TimeSpan.FromSeconds(Math.Pow(2, retry)));

        private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
            => HttpPolicyExtensions
                .HandleTransientHttpError()
                .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30));
    }
}