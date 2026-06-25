using Autotube.DTOs.ADashboardP;
using Autotube.Services.AdminDashboard;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Autotube.Controllers
{

    [ApiController]
    [Route("api/admin/dashboard")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _service;

        public AdminDashboardController(IAdminDashboardService service)
        {
            _service = service;
        }

        
        // Dashboard stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var stats = await _service.GetDashboardStatsAsync();
                return Ok(ApiResponse<DashboardStatsDto>.Ok(stats));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.Fail(
                    $"An error occurred while fetching dashboard stats: {ex.Message}"
                ));
            }
        }


        // All users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _service.GetAllUsersAsync();
                return Ok(ApiResponse<List<UserManagementDto>>.Ok(users));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.Fail(
                    $"An error occurred while fetching users: {ex.Message}"
                ));
            }
        }


        // User details
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserDetails(int id)
        {
            try
            {
                var details = await _service.GetUserDetailsAsync(id);
                return Ok(ApiResponse<UserDetailsDto>.Ok(details));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<object>.Fail(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.Fail(
                    $"An error occurred while fetching user details: {ex.Message}"
                ));
            }
        }


        // Change plans
        [HttpPut("users/{id}/plan")]
        public async Task<IActionResult> ChangeUserPlan(int id, [FromBody] ChangePlanDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail("Invalid request data."));

            if (dto.SubscriptionPlanId <= 0)
                return BadRequest(ApiResponse<object>.Fail("SubscriptionPlanId must be a positive integer."));

            try
            {
                await _service.ChangePlanAsync(id, dto);
                return Ok(ApiResponse<object>.Ok(new { message = "Subscription plan updated successfully." }));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<object>.Fail(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.Fail(
                    $"An error occurred while changing the plan: {ex.Message}"
                ));
            }
        }


        // Change status
        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateSubscriptionStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail("Invalid request data."));

            if (string.IsNullOrWhiteSpace(dto.Status))
                return BadRequest(ApiResponse<object>.Fail("Status is required."));

            try
            {
                await _service.UpdateUserStatusAsync(id, dto);
                return Ok(ApiResponse<object>.Ok(new { message = "Subscription status updated successfully." }));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.Fail(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<object>.Fail(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.Fail(
                    $"An error occurred while updating the status: {ex.Message}"
                ));
            }
        }


        // Delete user
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _service.DeleteUserAsync(id);
                return Ok(ApiResponse<object>.Ok(new { message = $"User {id} has been permanently deleted." }));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<object>.Fail(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.Fail(
                    $"An error occurred while deleting the user: {ex.Message}"
                ));
            }
        }
    }
}
