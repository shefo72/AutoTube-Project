using Autotube.Data;
using AutoTubeAPI.DTOs.Auth;
using Autotube.Models;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Autotube.DTOs.Auth;


namespace AutoTubeAPI.Services.Auth
{
    public class YouTubeChannelService : IYouTubeChannelService
    {
        private readonly AutoTubeDbContext _db;
        private readonly IConfiguration _config;
        private readonly ILogger<YouTubeChannelService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private const string YouTubeScope = "https://www.googleapis.com/auth/youtube.readonly";

        public YouTubeChannelService(
            AutoTubeDbContext db,
            IConfiguration config,
            ILogger<YouTubeChannelService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _config = config;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetAuthorizationUrl(int userId)
        {
            var clientId = _config["GoogleAuth:ClientId"]!;
            var redirectUri = GetCallbackUrl();

            var encodedUri = Uri.EscapeDataString(redirectUri);
            var encodedScope = Uri.EscapeDataString(YouTubeScope);
            var state = Uri.EscapeDataString(userId.ToString());

            return $"https://accounts.google.com/o/oauth2/v2/auth" +
                   $"?client_id={clientId}" +
                   $"&redirect_uri={encodedUri}" +
                   $"&response_type=code" +
                   $"&scope={encodedScope}" +
                   $"&access_type=offline" +
                   $"&prompt=consent" +
                   $"&state={state}";
        }

        public async Task<YouTubeConnectResponseDto> HandleCallbackAsync(string code, string state)
        {
            _logger.LogInformation("OAuth callback state: {State}", state);

            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
                throw new InvalidOperationException("Missing OAuth parameters.");

            state = Uri.UnescapeDataString(state);

            if (!int.TryParse(state, out var userId))
                throw new InvalidOperationException("Invalid OAuth state parameter.");

            var tokenResponse = await ExchangeCodeForTokensAsync(code);
            var channelData = await FetchYouTubeChannelAsync(tokenResponse.AccessToken);

            if (channelData == null)
                throw new InvalidOperationException("No YouTube channel found.");

            var existingChannel = await _db.Channels
                .FirstOrDefaultAsync(c => c.ChannelId == channelData.ExternalId);

            Channel channel;

            if (existingChannel != null)
            {
                existingChannel.OwnerUserId = userId;
                existingChannel.Title = channelData.Title;
                existingChannel.Description = channelData.Description ?? "";
                existingChannel.ThumbnailUrl = channelData.ThumbnailUrl ?? "";
                existingChannel.SubscriberCount = channelData.SubscriberCount ?? 0;
                existingChannel.VideoCount = channelData.VideoCount ?? 0;
                existingChannel.TotalViews = channelData.ViewCount ?? 0;
                existingChannel.UpdatedAt = DateTime.Now;
                existingChannel.IsDeleted = false;

                channel = existingChannel;
            }
            else
            {
                channel = new Channel
                {
                    OwnerUserId = userId, 
                    ChannelId = channelData.ExternalId,
                    Title = channelData.Title,
                    Description = channelData.Description ?? "",
                    ThumbnailUrl = channelData.ThumbnailUrl ?? "",
                    SubscriberCount = channelData.SubscriberCount ?? 0,
                    VideoCount = channelData.VideoCount ?? 0,
                    TotalViews = channelData.ViewCount ?? 0,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    IsDeleted = false
                };

                _db.Channels.Add(channel);
            }

            var user = await _db.Users.FindAsync(userId);
            if (user != null && string.IsNullOrEmpty(user.GoogleId))
            {
                user.GoogleId = channelData.ExternalId;
                user.AuthProvider = "google";
                user.UpdatedAt = DateTime.Now;
            }

            await _db.SaveChangesAsync();

            _logger.LogInformation("YouTube channel connected: {Title}, User: {UserId}", channel.Title, userId);

            return new YouTubeConnectResponseDto
            {
                Success = true,
                Message = $"Channel '{channel.Title}' connected successfully!",
                Channel = MapToDto(channel)
            };
        }

        public async Task<YouTubeChannelDto?> GetMyChannelAsync(int userId)
        {

            var channel = await _db.Channels
                .Where(c => c.OwnerUserId == userId && c.IsDeleted == false)
                .FirstOrDefaultAsync();

            return channel == null ? null : MapToDto(channel);
        }

        private async Task<TokenResponse> ExchangeCodeForTokensAsync(string code)
        {
            var flow = new GoogleAuthorizationCodeFlow(
                new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = _config["GoogleAuth:ClientId"]!,
                        ClientSecret = _config["GoogleAuth:ClientSecret"]!,
                    },
                    Scopes = new[] { YouTubeScope }
                });

            return await flow.ExchangeCodeForTokenAsync(
                userId: "autotube_user",
                code: code,
                redirectUri: GetCallbackUrl(),
                taskCancellationToken: CancellationToken.None);
        }

        private async Task<YouTubeChannelRaw?> FetchYouTubeChannelAsync(string accessToken)
        {
            var credential = GoogleCredential.FromAccessToken(accessToken);

            var service = new YouTubeService(
                new BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "AutoTube"
                });

            var request = service.Channels.List("snippet,statistics");
            request.Mine = true;

            var response = await request.ExecuteAsync();
            var channel = response.Items?.FirstOrDefault();

            if (channel == null) return null;

            return new YouTubeChannelRaw
            {
                ExternalId = channel.Id,
                Title = channel.Snippet?.Title ?? "Unknown",
                Description = channel.Snippet?.Description,
                ThumbnailUrl = channel.Snippet?.Thumbnails?.High?.Url ??
                               channel.Snippet?.Thumbnails?.Medium?.Url ??
                               channel.Snippet?.Thumbnails?.Default__?.Url,
                SubscriberCount = (long?)channel.Statistics?.SubscriberCount,
                VideoCount = (long?)channel.Statistics?.VideoCount,
                ViewCount = (long?)channel.Statistics?.ViewCount
            };
        }

        private string GetCallbackUrl()
        {
            return "https://localhost:7153/api/youtube/callback";
        }

        private static YouTubeChannelDto MapToDto(Channel c)
            => new()
            {
                ChannelId = c.Id,
                YouTubeChannelExternalId = c.ChannelId,
                ChannelTitle = c.Title,
                ChannelDescription = c.Description,
                ChannelThumbnailUrl = c.ThumbnailUrl,
                SubscriberCount = c.SubscriberCount,
                VideoCount = c.VideoCount,
                ViewCount = c.TotalViews,
                IsActive = !c.IsDeleted,
                ConnectedAt = c.CreatedAt,
                LastSyncedAt = c.UpdatedAt
            };

        public async Task<bool> SaveChannelIdAsync(int userId, string channelId)
        {
            var exists = await _db.Channels
                .AnyAsync(c => c.ChannelId == channelId && c.OwnerUserId == userId);

            if (exists)
            {
                return true;
            }

            var newChannel = new Channel
            {
                ChannelId = channelId.Trim(),
                OwnerUserId = userId,

                Title = "Pending Sync...",
                Description = "Channel details will be synced from YouTube shortly.",
                ThumbnailUrl = "https://placeholder.com/channel-default.png",

                SubscriberCount = 0,
                TotalViews = 0,
                VideoCount = 0,

                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                IsDeleted = false
            };

            _db.Channels.Add(newChannel);
            var rowsAffected = await _db.SaveChangesAsync();

            return rowsAffected > 0;




        }

        public async Task<YouTubeChannelIdDto?> GetChannelByIdAsync(int userId)
        {
            return await _db.Channels
            .Where(c => c.OwnerUserId == userId && c.IsDeleted == false)
            .OrderByDescending(c => c.Id) 
            .Select(c => new YouTubeChannelIdDto
            {
                ChannelId = c.ChannelId 
            })
            .FirstOrDefaultAsync();
        }



        private class YouTubeChannelRaw
        {
            public string ExternalId { get; set; } = default!;
            public string Title { get; set; } = default!;
            public string? Description { get; set; }
            public string? ThumbnailUrl { get; set; }
            public long? SubscriberCount { get; set; }
            public long? VideoCount { get; set; }
            public long? ViewCount { get; set; }
        }
    }
}
