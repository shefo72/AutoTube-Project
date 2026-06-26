using Microsoft.AspNetCore.Http;
using AutoTubeAPI.DTOs.Profile;
using AutoTubeAPI.Repositories.Profile;

namespace AutoTubeAPI.Services.Profile
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository _repository;

        public ProfileService(IProfileRepository repository)
        {
            _repository = repository;
        }

        // GET Profile:
        public async Task<ProfileResponseDto> GetProfileAsync(int userId)
        {
            return await _repository.GetProfileAsync(userId);
        }

        // Update Profile:
        public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            return await _repository.UpdateProfileAsync(userId, dto);
        }

        // Upload Profile Image:
        public async Task<string?> UploadProfileImageAsync(int userId, IFormFile file)
        {
            return await _repository.UploadProfileImageAsync(userId, file);
        }

        // Change Password:
        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            return await _repository.ChangePasswordAsync(userId, dto);
        }

        // Delete Account:
        public async Task<bool> DeleteAccountAsync(int userId, DeleteAccountDto dto)
        {
            return await _repository.DeleteAccountAsync(userId, dto);
        }
    }
}