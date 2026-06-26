using Autotube.Data;
using Autotube.Repositories.GapAnalysis;
using Autotube.Services.GapAnalysis;
using Autotube.Services.GapAnalysis.Interfaces;
using Microsoft.EntityFrameworkCore;
using Polly;
using Polly.Extensions.Http;
using System;

namespace Autotube.Advacedhelp
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
             // EF Core 
            services.AddDbContext<AutoTubeDbContext>(options =>
            {

                var connectionString = configuration.GetConnectionString("DefaultConnection");
                    options.UseMySql(
                        connectionString,
                        ServerVersion.AutoDetect(connectionString), 
                    
                    mysqlOptions =>
                    {
                        mysqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 3,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorNumbersToAdd: null);
                        mysqlOptions.CommandTimeout(60);
                    });
            });

            //  Repositories 
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IVideoRepository, VideoRepository>();
            services.AddScoped<IGapReportRepository, GapReportRepository>();
            services.AddScoped<IAnalysisSessionRepository, AnalysisSessionRepository>();
            services.AddScoped<ICachedTrendResultRepository, CachedTrendResultRepository>();
            services.AddScoped<IOpportunityRepository, OpportunityRepository>();

            // ─ HttpClients with retry policies 
            var retryPolicy = HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(
                    retryCount: 3,
                    sleepDurationProvider: attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)),
                    onRetry: (outcome, delay, attempt, _) =>
                    {
                        Console.WriteLine($"[Retry {attempt}] after {delay.TotalSeconds}s due to: {outcome.Exception?.Message ?? outcome.Result?.StatusCode.ToString()}");
                    });

            var circuitBreakerPolicy = HttpPolicyExtensions
                .HandleTransientHttpError()
                .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30));

            services.AddHttpClient("YouTube", client =>
            {
                client.BaseAddress = new Uri("https://www.googleapis.com");
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            })
            .AddPolicyHandler(retryPolicy)
            .AddPolicyHandler(circuitBreakerPolicy);

            services.AddHttpClient("Gemini", client =>
            {
                client.BaseAddress = new Uri("https://generativelanguage.googleapis.com");
                client.Timeout = TimeSpan.FromSeconds(120);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            })
            .AddPolicyHandler(retryPolicy);

            //  External Services 
            services.AddScoped<IYouTubeService, YouTubeService>();
            services.AddScoped<IGeminiAiService, GeminiAiService>();

            //  Memory Cache 
            services.AddMemoryCache();
            return services;
        }
    }
}
