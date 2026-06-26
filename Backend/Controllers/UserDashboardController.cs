using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoTubeAPI.Services.Dashboard;

namespace AutoTubeAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserDashboardController : ControllerBase
    {
        private readonly IUserDashboardService _dashboardService;

        public UserDashboardController(IUserDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }
        // Retrieves the dashboard data for the currently authenticated user.
        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Invalid user token" });

            var result = await _dashboardService.GetDashboardAsync(userId);

            return Ok(result);
        }
    }
}