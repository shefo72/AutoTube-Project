using Microsoft.AspNetCore.Http;
using AutoTubeAPI.DTOs.Profile;

namespace AutoTubeAPI.Repositories.Profile
{
    public interface IProfileRepository
    {
        Task<ProfileResponseDto> GetProfileAsync(int userId);

        Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto dto);

        Task<string> UploadProfileImageAsync(int userId, IFormFile file);

        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);

        Task<bool> DeleteAccountAsync(int userId, DeleteAccountDto dto);
    }
}