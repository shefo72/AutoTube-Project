using Autotube.BackgroundServices;
using Autotube.Data;
using Autotube.DTOs;
using Autotube.Handlers;
using Autotube.Repositories;
using Autotube.Repositories.AdmninDashboard;
using Autotube.Repositories.All_in_One.Thumbnail;
using Autotube.Repositories.Billing;
using Autotube.Repositories.Billing.Quota;
using Autotube.Repositories.GapAnalysis;
using Autotube.Repositories.Onboarding;
using Autotube.Repositories.Payment;
using Autotube.Repositories.Thumbnail;
using Autotube.Services;
using Autotube.Services.AdminDashboard;
using Autotube.Services.All_in_One.Script;
using Autotube.Services.All_in_One.Thumbnail;
using Autotube.Services.All_in_One.Thumbnail.ExternalApis;
using Autotube.Services.All_in_One.Video;
using Autotube.Services.BackgroundServices;
using Autotube.Services.Billing;
using Autotube.Services.Billing.Quota;
using Autotube.Services.Extensions;
using Autotube.Services.GapAnalysis;
using Autotube.Services.GapAnalysis.Interfaces;
using Autotube.Services.Onboarding;
using Autotube.Services.Payment;
using Autotube.Services.Script;
using Autotube.Services.Thumbnail;
using Autotube.Services.Thumbnail.ExternalApis;
using AutoTubeAPI.Advacedhelp.Middleware;
using AutoTubeAPI.Advacedhelp.Validators;
using AutoTubeAPI.BackgroundServices;
using AutoTubeAPI.Repositories.Dashboard;
using AutoTubeAPI.Repositories.Profile;
using AutoTubeAPI.Repositories.VideoClips;
using AutoTubeAPI.Repositories.VideoGeneration;
using AutoTubeAPI.Services.Auth;
using AutoTubeAPI.Services.Dashboard;
using AutoTubeAPI.Services.Gemini;
using AutoTubeAPI.Services.PiAPI;
using AutoTubeAPI.Services.Profile;
using AutoTubeAPI.Services.VideoGeneration;
using FluentValidation;
using Hangfire;
using Hangfire.SqlServer; 
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Polly;
using Polly.Extensions.Http;
using Polly.Retry;
using Serilog;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;

namespace Autotube
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // SERILOG
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Console()
                .WriteTo.File("Logs/autotube-startup.log")
                .CreateBootstrapLogger();

            try
            {
                Log.Information("AutoTube API starting up...");

                var builder = WebApplication.CreateBuilder(args);

                // SERILOG CONFIG
                builder.Host.UseSerilog((context, services, configuration) =>
                {
                    configuration
                        .ReadFrom.Configuration(context.Configuration)
                        .ReadFrom.Services(services)
                        .Enrich.FromLogContext()
                        .WriteTo.Console()
                        .WriteTo.File(
                            path: "Logs/autotube-.log",
                            rollingInterval: RollingInterval.Day,
                            retainedFileCountLimit: 30);
                });

                // Hangfire
                builder.Services.AddHangfire(config => config
                    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                    .UseSimpleAssemblyNameTypeSerializer()
                    .UseRecommendedSerializerSettings()
                    .UseSqlServerStorage( 
                        builder.Configuration.GetConnectionString("DefaultConnection"),
                        new SqlServerStorageOptions() // 
                    ));

                builder.Services.Configure<ForwardedHeadersOptions>(options =>
                {
                    options.ForwardedHeaders =
                        ForwardedHeaders.XForwardedFor |
                        ForwardedHeaders.XForwardedProto;

                    options.KnownNetworks.Clear();
                    options.KnownProxies.Clear();
                });

                // MediatR
                builder.Services.AddMediatR(typeof(Program).Assembly);

                // CORS
                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowAll", policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
                });

                // DATABASE
                builder.Services.AddDbContext<AutoTubeDbContext>(options =>
                {
                    var connectionString =
                        builder.Configuration.GetConnectionString("DefaultConnection");

                    options.UseSqlServer(
                        connectionString,
                        sqlOptions => 
                        {
                            sqlOptions.EnableRetryOnFailure(
                                maxRetryCount: 5,
                                maxRetryDelay: TimeSpan.FromSeconds(30),
                                errorNumbersToAdd: null);
                        });

                    if (builder.Environment.IsDevelopment())
                    {
                        options.EnableSensitiveDataLogging();
                        options.EnableDetailedErrors();
                    }
                });

                // JWT AUTHENTICATION
                var jwtSecretKey =
                    builder.Configuration["Jwt:SecretKey"]
                    ?? throw new InvalidOperationException("JWT SecretKey missing");

                var jwtIssuer =
                    builder.Configuration["Jwt:Issuer"] ?? "AutoTubeAPI";

                var jwtAudience =
                    builder.Configuration["Jwt:Audience"] ?? "AutoTubeClient";

                builder.Services
                    .AddAuthentication(options =>
                    {
                        options.DefaultAuthenticateScheme =
                            JwtBearerDefaults.AuthenticationScheme;

                        options.DefaultChallengeScheme =
                            JwtBearerDefaults.AuthenticationScheme;
                    })
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters =
                            new TokenValidationParameters
                            {
                                ValidateIssuer = true,
                                ValidIssuer = jwtIssuer,

                                ValidateAudience = true,
                                ValidAudience = jwtAudience,

                                ValidateLifetime = true,
                                ValidateIssuerSigningKey = true,

                                IssuerSigningKey =
                                    new SymmetricSecurityKey(
                                        Encoding.UTF8.GetBytes(jwtSecretKey)
                                    ),

                                ClockSkew = TimeSpan.Zero,
                                NameClaimType = ClaimTypes.NameIdentifier
                            };

                        options.Events = new JwtBearerEvents
                        {
                            OnAuthenticationFailed = context =>
                            {
                                Log.Warning(
                                    "JWT authentication failed: {Error}",
                                    context.Exception.Message);

                                return Task.CompletedTask;
                            },

                            OnTokenValidated = context =>
                            {
                                Log.Debug(
                                    "JWT validated for user: {User}",
                                    context.Principal?.Identity?.Name);

                                return Task.CompletedTask;
                            },

                            OnMessageReceived = context =>
                            {
                                var accessToken = context.Request.Query["token"];
                                var path = context.HttpContext.Request.Path;

                                if (!string.IsNullOrEmpty(accessToken)
                                    && path.StartsWithSegments("/api/youtube/connect"))
                                {
                                    context.Token = accessToken;
                                }

                                return Task.CompletedTask;
                            }
                        };
                    });

                builder.Services.AddAuthorization();

                // HttpClients with retry policies
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

                builder.Services.AddHttpClient("YouTube", client =>
                {
                    client.BaseAddress = new Uri("https://www.googleapis.com");
                    client.Timeout = TimeSpan.FromSeconds(30);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(
                        new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                })
                .AddPolicyHandler(retryPolicy)
                .AddPolicyHandler(circuitBreakerPolicy);

                builder.Services.AddHttpClient("Gemini", client =>
                {
                    client.BaseAddress = new Uri("https://generativelanguage.googleapis.com");
                    client.Timeout = TimeSpan.FromSeconds(120);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(
                        new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                })
                .AddPolicyHandler(retryPolicy);

                // CONTROLLERS + JSON
                builder.Services.AddControllers()
                    .AddJsonOptions(options =>
                    {
                        options.JsonSerializerOptions.PropertyNamingPolicy =
                            System.Text.Json.JsonNamingPolicy.CamelCase;

                        options.JsonSerializerOptions.DefaultIgnoreCondition =
                            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;

                        options.JsonSerializerOptions.ReferenceHandler =
                            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                    });

                builder.Services.AddMemoryCache();

                builder.Services.AddSwaggerDocs();
                builder.Services.AddDatabase(builder.Configuration);

                // SWAGGER
                builder.Services.AddEndpointsApiExplorer();

                builder.Services.AddSwaggerGen(options =>
                {
                    options.SwaggerDoc("v1", new OpenApiInfo
                    {
                        Title = "AutoTube API",
                        Version = "v1",
                        Description = "AutoTube API"
                    });

                    var jwtSecurityScheme = new OpenApiSecurityScheme
                    {
                        Name = "Authorization",
                        Type = SecuritySchemeType.Http,
                        Scheme = "bearer",
                        BearerFormat = "JWT",
                        In = ParameterLocation.Header,
                        Description = "Paste JWT Token"
                    };

                    options.AddSecurityDefinition("Bearer", jwtSecurityScheme);

                    options.AddSecurityRequirement(
                        new OpenApiSecurityRequirement
                        {
                            {
                                new OpenApiSecurityScheme
                                {
                                    Reference = new OpenApiReference
                                    {
                                        Type = ReferenceType.SecurityScheme,
                                        Id = "Bearer"
                                    }
                                },
                                Array.Empty<string>()
                            }
                        });
                });

                // HTTP CLIENTS
                builder.Services.AddHttpClient();

                builder.Services.AddHttpClient("Replicate", client =>
                {
                    client.BaseAddress = new Uri("https://api.replicate.com/");
                    client.Timeout = TimeSpan.FromMinutes(2);
                });

                builder.Services.AddHttpClient("StabilityAI", client =>
                {
                    client.BaseAddress = new Uri("https://api.stability.ai/");
                    client.Timeout = TimeSpan.FromMinutes(2);
                });

                // FLUENT VALIDATION
                builder.Services.AddValidatorsFromAssemblyContaining<SignUpValidator>();

                // AUTOMAPPER
                builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

                // RATE LIMITING
                builder.Services.AddRateLimiter(options =>
                {
                    options.OnRejected = async (context, cancellationToken) =>
                    {
                        context.HttpContext.Response.StatusCode =
                            StatusCodes.Status429TooManyRequests;

                        await context.HttpContext.Response.WriteAsJsonAsync(
                            new
                            {
                                success = false,
                                message = "Too many requests. Please slow down."
                            },
                            cancellationToken);
                    };

                    options.AddPolicy("auth-policy", httpContext =>
                        RateLimitPartition.GetFixedWindowLimiter(
                            partitionKey:
                                httpContext.Connection.RemoteIpAddress?.ToString()
                                ?? "anonymous",

                            factory: _ =>
                                new FixedWindowRateLimiterOptions
                                {
                                    PermitLimit = 5,
                                    Window = TimeSpan.FromMinutes(1),
                                    QueueLimit = 0
                                }));

                    options.AddPolicy("global-policy", httpContext =>
                        RateLimitPartition.GetFixedWindowLimiter(
                            partitionKey:
                                httpContext.Connection.RemoteIpAddress?.ToString()
                                ?? "anonymous",

                            factory: _ =>
                                new FixedWindowRateLimiterOptions
                                {
                                    PermitLimit = 100,
                                    Window = TimeSpan.FromMinutes(1),
                                    QueueLimit = 0
                                }));

                    options.AddFixedWindowLimiter("fixed", limiterOptions =>
                    {
                        limiterOptions.PermitLimit = 60;
                        limiterOptions.Window = TimeSpan.FromMinutes(1);
                        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                        limiterOptions.QueueLimit = 5;
                    });

                    options.AddFixedWindowLimiter("analysis", limiterOptions =>
                    {
                        limiterOptions.PermitLimit = 10;
                        limiterOptions.Window = TimeSpan.FromMinutes(1);
                        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                        limiterOptions.QueueLimit = 2;
                    });
                });

                // SERVICES
                builder.Services.AddScoped<IAuthService, AuthService>();
                builder.Services.AddScoped<IJwtService, JwtService>();
                builder.Services.AddScoped<IOnboardingService, OnboardingService>();

                builder.Services.AddScoped<IYouTubeChannelService, YouTubeChannelService>();
                builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
                builder.Services.AddHttpClient<IGeminiService, GeminiService>();

                builder.Services.AddScoped<IProfileService, ProfileService>();
                builder.Services.AddScoped<IQuotaService, QuotaService>();
                builder.Services.AddScoped<BillingService>();
                builder.Services.AddScoped<PaymentService>();

                builder.Services.AddScoped<ReplicateService>();
                builder.Services.AddScoped<StabilityAiService>();
                builder.Services.AddScoped<FluxKontextService>();

                builder.Services.AddScoped<ThumbnailGenerationService>();
                builder.Services.AddScoped<ImageStorageService>();
                builder.Services.AddScoped<UploadedThumbnailGenerationService>();

                builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
                builder.Services.AddScoped<IUserDashboardService, UserDashboardService>();

                builder.Services.AddScoped<IVideoGenerationService, VideoGenerationService>();
                builder.Services.AddHttpClient<ISceneGeneratorService, GeminiSceneGeneratorService>();
                builder.Services.AddHostedService<VideoPollingBackgroundService>();
                builder.Services.AddHttpClient<IPiAPIService, PiAPIService>();

                builder.Services.AddScoped<IYouTubeService, YouTubeService>();
                builder.Services.AddScoped<IGeminiAiService, GeminiAiService>();

                // All in one services
                builder.Services.AddScoped<IAllGeminiService, AllGeminiService>();
                builder.Services.AddScoped<IAllThumbnailGenerationService, AllThumbnailGenerationService>();

                builder.Services.AddScoped<AllImageStorageService>();
                builder.Services.AddScoped<AllReplicateService>();
                builder.Services.AddScoped<AllStabilityAiService>();

                builder.Services.AddScoped<IAllInOnePiAPIService, AllInOnePiAPIService>();
                builder.Services.AddScoped<IVideoPromptBuilder, VideoPromptBuilder>();
                builder.Services.AddScoped<IAllInOneVideoOrchestrator, AllInOneVideoOrchestrator>();
                builder.Services.AddScoped<IAllInOneVideoPollingService, AllInOneVideoPollingService>();

                builder.Services.AddHostedService<AllInOneVideoPollingBackgroundService>();

                // REPOSITORIES
                builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
                builder.Services.AddScoped<IOnboardingRepository, OnboardingRepository>();

                builder.Services.AddScoped<BillingRepository>();
                builder.Services.AddScoped<PaymentRepository>();
                builder.Services.AddScoped<IUserSubscriptionRepository, UserSubscriptionRepository>();
                builder.Services.AddScoped<ICreditTransactionRepository, CreditTransactionRepository>();

                builder.Services.AddScoped<IThumbnailRepository, ThumbnailRepository>();
                builder.Services.AddScoped<UploadedThumbnailRepository>();

                builder.Services.AddScoped<IAdminDashboardRepository, AdminDashboardRepository>();
                builder.Services.AddScoped<IUserDashboardRepository, UserDashboardRepository>();

                builder.Services.AddScoped<IVideoClipsRepository, VideoClipsRepository>();
                builder.Services.AddScoped<IVideoGenerationRepository, VideoGenerationRepository>();

                builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
                builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
                builder.Services.AddScoped<IVideoRepository, VideoRepository>();
                builder.Services.AddScoped<IGapReportRepository, GapReportRepository>();
                builder.Services.AddScoped<IAnalysisSessionRepository, AnalysisSessionRepository>();
                builder.Services.AddScoped<ICachedTrendResultRepository, CachedTrendResultRepository>();
                builder.Services.AddScoped<IOpportunityRepository, OpportunityRepository>();

                builder.Services.AddScoped<IAllThumbnailRepository, AllThumbnailRepository>();

                builder.Services.AddHttpContextAccessor();
                builder.Services.AddMemoryCache();

                builder.Services
                     .AddRepositories()
                     .AddApplicationServices()
                     .AddYouTubeApiClient(builder.Configuration)
                     .AddBackgroundSync(builder.Configuration);

                // BUILD APP
                var app = builder.Build();

                // FORWARDED HEADERS
                app.UseForwardedHeaders();

                // DATABASE CHECK
                using (var scope = app.Services.CreateScope())
                {
                    var db = scope.ServiceProvider
                        .GetRequiredService<AutoTubeDbContext>();

                    try
                    {
                        Log.Information(
                            db.Database.CanConnect()
                            ? "Database connected successfully!"
                            : "Database connection failed!");

                        await db.Database.MigrateAsync();

                        Log.Information("Database migrations applied.");
                    }
                    catch (Exception ex)
                    {
                        Log.Error(ex, "Database migration failed.");
                    }
                }

                // MIDDLEWARE
                app.UseMiddleware<GlobalExceptionMiddleware>();

                app.UseMiddleware<RequestLoggingMiddleware>();
                app.UseSerilogRequestLogging(opts =>
                {
                    opts.MessageTemplate =
                        "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000}ms";
                });

                app.UseHangfireDashboard();

                app.UseRateLimiter();

                app.UseSwagger();

                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint(
                        "/swagger/v1/swagger.json",
                        "AutoTube API v1");
                });

                app.UseHttpsRedirection();

                using (var scope = app.Services.CreateScope())
                {
                    var recurringJobManager =
                        scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

                    recurringJobManager.AddOrUpdate(
                        "youtube-sync-job",
                        () => Console.WriteLine("Running background job"),
                        Cron.Daily);
                }

                app.UseStaticFiles();

                app.UseCors("AllowAll");

                app.UseAuthentication();

                app.UseAuthorization();

                app.MapControllers();

                Log.Information($"AutoTube API started successfully on port "
                    //$"{port}."
                    );

                await app.RunAsync();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application startup failed.");
            }
            finally
            {
                await Log.CloseAndFlushAsync();
            }
        }
    }
}