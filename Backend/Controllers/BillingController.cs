using Autotube.DTOs.BillingUsageP;
using Autotube.Services.Billing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Autotube.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BillingController : ControllerBase
    {
        private readonly BillingService _service;

        public BillingController(BillingService service)
        {
            _service = service;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
                throw new UnauthorizedAccessException("Invalid user token.");

            return userId;
        }


        // User subscription
        [HttpGet("subscription")]
        public async Task<IActionResult> GetSubscription()
        {
            var userId = GetCurrentUserId();

            var result = await _service.GetSubscriptionAsync(userId);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Subscription not found."
                });
            }

            return Ok(result);
        }

        // Payment method
        [HttpGet("payment-method")]
        public async Task<IActionResult> GetPaymentMethod()
        {
            var userId = GetCurrentUserId();

            var result = await _service.GetPaymentMethodAsync(userId);

            if (result == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Payment method not found."
                });
            }

            return Ok(result);
        }


        // Usage quota
        [HttpGet("usage")]
        public async Task<IActionResult> GetUsage()
        {
            var userId = GetCurrentUserId();

            var result = await _service.GetUsageQuotaAsync(userId);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Usage quota not found."
                });
            }

            return Ok(result);
        }


        // Remaining credits
        [HttpGet("credits-summary")]
        public async Task<IActionResult> GetCreditsSummary()
        {
            var userId = GetCurrentUserId();

            var result = await _service.GetCreditsSummaryAsync(userId);

            return Ok(result);
        }


        // Update payment method
        [HttpPut("payment-method")]
        public async Task<IActionResult> UpdatePaymentMethod(
            UpdatePaymentMethodDto dto)
        {
            var userId = GetCurrentUserId();

            var updated =
                await _service.UpdatePaymentMethodAsync(
                    userId,
                    dto);

            if (!updated)
            {
                return NotFound(new
                {
                    message = "Payment method not found."
                });
            }

            return Ok(new
            {
                message = "Payment method updated successfully."
            });
        }
    }

}
