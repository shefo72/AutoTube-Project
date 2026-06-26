using System.Linq;
using System.IO;
using Microsoft.AspNetCore.Http;
using Autotube.Data;
using AutoTubeAPI.DTOs.Profile;
using Microsoft.EntityFrameworkCore;

namespace AutoTubeAPI.Repositories.Profile
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly AutoTubeDbContext _context;

        public ProfileRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        // GET Profile
        public async Task<ProfileResponseDto> GetProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.SubscriptionPlan)
                .Include(u => u.Niches)
                .Include(u => u.Channels)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            var userChannel = user.Channels.FirstOrDefault();

            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status == "Active");

            return new ProfileResponseDto
            {
                BasicInfo = new BasicInfoDto
                {
                    ProfileImageUrl = user.ProfileImageUrl,
                    FullName = user.FullName,
                    Email = user.Email,
                    YouTubeChannel = userChannel?.Title,
                    PlanType = activeSubscription?.SubscriptionPlan.Name ?? "Free",
                    MemberSince = $"Member since {user.CreatedAt:MMM yyyy}"
                },
                PersonalInfo = new PersonalInfoDto
                {
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    DateOfBirth = user.DateOfBirth
                },
                SelectedNiches = user.Niches
                   .Select(n => n.NicheName)
                   .ToList()
            };
        }

        // UPDATE Profile
        public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Niches)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            // Basic Info
            if (!string.IsNullOrWhiteSpace(dto.FullName))
                user.FullName = dto.FullName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                user.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
                user.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrWhiteSpace(dto.ProfileImageUrl))
                user.ProfileImageUrl = dto.ProfileImageUrl;

            if (dto.DateOfBirth.HasValue)
                user.DateOfBirth = dto.DateOfBirth.Value;

            // Niches
            if (dto.SelectedNiches != null)
            {
                var niches = await _context.ContentNiches
                    .Where(n => dto.SelectedNiches.Contains(n.NicheName))
                    .ToListAsync();

                user.Niches.Clear();

                foreach (var niche in niches)
                    user.Niches.Add(niche);
            }

            await _context.SaveChangesAsync();

            return true;
        }

        // Upload Profile Image
        public async Task<string> UploadProfileImageAsync(int userId, IFormFile file)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            var oldImage = user.ProfileImageUrl;

            if (file == null || file.Length == 0)
                throw new Exception("Invalid image");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                throw new Exception("Only image files are allowed");

            var fileName = $"{Guid.NewGuid()}{extension}";

            var folderPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/uploads/profile"
            );

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"/uploads/profile/{fileName}";

            user.ProfileImageUrl = imageUrl;

            await _context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(oldImage))
            {
                var oldFileName = Path.GetFileName(oldImage);

                var oldFilePath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/uploads/profile",
                    oldFileName
                );

                if (File.Exists(oldFilePath))
                {
                    File.Delete(oldFilePath);
                }
            }

            return imageUrl;
        }

        // Change Password
        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            var isValidPassword =
                BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash);

            if (!isValidPassword)
                return false;

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();

            return true;
        }

        // Delete Account
        public async Task<bool> DeleteAccountAsync(int userId, DeleteAccountDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            // Only validate password if user has one
            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                if (string.IsNullOrWhiteSpace(dto.Password))
                    return false;

                var isValidPassword =
                    BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

                if (!isValidPassword)
                    return false;
            }

            if (dto.ConfirmationText != "DELETE")
                return false;

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}