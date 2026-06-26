using Autotube.DTOs.PaymentP;
using Autotube.Services.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Autotube.Controllers
{
    [Authorize]

    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _service;

        // Payment 
        public PaymentController(PaymentService service)
        {
            _service = service;
        }
        [Authorize]
        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe(CreateSubscriptionDto dto)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _service.CreateSubscriptionAsync(dto, userId);

            return Ok(result);
        }
    }
}
