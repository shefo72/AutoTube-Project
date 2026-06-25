using Autotube.DTOs.Auth;
using AutoTubeAPI.DTOs.Auth;

namespace AutoTubeAPI.Services.Auth
{
    public interface IYouTubeChannelService
    {
        string GetAuthorizationUrl(int userId);

        Task<YouTubeConnectResponseDto> HandleCallbackAsync(string code, string state);

        Task<YouTubeChannelDto?> GetMyChannelAsync(int userId);

        Task<bool> SaveChannelIdAsync(int userId, string channelId);
        Task<YouTubeChannelIdDto?> GetChannelByIdAsync(int userId);
    }
}