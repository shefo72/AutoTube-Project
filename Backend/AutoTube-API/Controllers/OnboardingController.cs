using Autotube.DTOs.Onboarding;
using Autotube.Models;
using Autotube.Services.Onboarding;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Autotube.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/onboarding")]
    public class OnboardingController : ControllerBase
    {
        private readonly IOnboardingService _service;

        public OnboardingController(IOnboardingService service)
        {
            _service = service;
        }

        // Get current user id from JWT
        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        // Save Niches
        [HttpPost("niches")]
        public async Task<IActionResult> SaveNiches([FromBody] SaveNichesDto dto)
        {
            var userId = GetUserId();

            if (dto.Niches == null || !dto.Niches.Any())
                return BadRequest("At least one niche is required.");

            await _service.SaveUserNichesAsync(userId, dto);

            return Ok(new { message = "Niches saved successfully" });
        }

        // Save Goals
        [HttpPost("goals")]
        public async Task<IActionResult> SaveGoals([FromBody] SaveGoalsDto dto)
        {
            var userId = GetUserId();

            if (dto.Goals == null || !dto.Goals.Any())
                return BadRequest("At least one goal is required.");

            await _service.SaveUserGoalsAsync(userId, dto);

            return Ok(new { message = "Goals saved successfully" });
        }
    }
}
