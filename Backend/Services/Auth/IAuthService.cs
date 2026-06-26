using AutoTubeAPI.DTOs.Auth;

namespace AutoTubeAPI.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResponseDto> SignUpAsync(SignUpDto dto);

        Task<AuthResponseDto> SignInAsync(SignInDto dto);

        Task<UserInfoDto?> GetUserInfoAsync(int userId);

        Task<AuthResponseDto> GoogleLoginAsync(
            string googleId,
            string email,
            string fullName,
            string? pictureUrl
        );

    }

}