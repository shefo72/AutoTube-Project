using System.Security.Claims;
using AutoTubeAPI.DTOs.Profile;
using AutoTubeAPI.Services.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoTubeAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _service;

        public ProfileController(IProfileService service)
        {
            _service = service;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value!
            );
        }

        // Get Profile
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();

            var result = await _service.GetProfileAsync(userId);

            return Ok(result);
        }

        // Update Profile
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = GetCurrentUserId();

            var result = await _service.UpdateProfileAsync(userId, dto);

            if (!result)
                return BadRequest("Failed to update profile");

            return Ok("Profile updated successfully");
        }

        // Upload Profile Image
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadProfileImage(
            [FromForm] UploadProfileImageDto dto)
        {
            var userId = GetCurrentUserId();

            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("No image uploaded");

            var result = await _service.UploadProfileImageAsync(userId, dto.File);

            if (result == null)
                return BadRequest("Upload failed");

            return Ok(new { imageUrl = result });
        }

        // Change Password
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = GetCurrentUserId();

            var result = await _service.ChangePasswordAsync(userId, dto);

            if (!result)
                return BadRequest("Invalid old password");

            return Ok("Password changed successfully");
        }

        // Delete Account
        [HttpDelete]
        public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountDto dto)
        {
            var userId = GetCurrentUserId();

            var result = await _service.DeleteAccountAsync(userId, dto);

            if (!result)
                return BadRequest("Delete failed (wrong password or confirmation)");

            return Ok("Account deleted successfully");
        }
    }
}