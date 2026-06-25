using Autotube.DTOs.UploadedThumbnail;
using Autotube.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using Autotube.Repositories.Thumbnail;
using Autotube.Services.Thumbnail;

namespace Autotube.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/uploaded-thumbnails")]
    public class UploadedThumbnailController : ControllerBase
    {
        private readonly UploadedThumbnailGenerationService _generationService;
        private readonly UploadedThumbnailRepository _repository;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<UploadedThumbnailController> _logger;

        public UploadedThumbnailController(
            UploadedThumbnailGenerationService generationService,
            UploadedThumbnailRepository repository,
            IWebHostEnvironment env,
            ILogger<UploadedThumbnailController> logger)
        {
            _generationService = generationService;
            _repository = repository;
            _env = env;
            _logger = logger;
        }

        // Generate thumbnail
        [HttpPost("generate")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Generate(
            [FromForm] GenerateUploadedThumbnailDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!int.TryParse(userIdClaim, out int userId))
                    return Unauthorized();

                var baseUrl = $"{Request.Scheme}://{Request.Host}";

                var result = await _generationService.GenerateAsync(
                    dto,
                    baseUrl,
                    userId);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate uploaded thumbnail.");
                return StatusCode(500, new { error = "Something went wrong. Please try again." });
            }
        }

        // History
        [HttpGet("user")]
        public async Task<IActionResult> GetUserHistory()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var history = await _repository.GetUserHistoryAsync(userId);

            return Ok(history);
        }


        // Download thumbnail
        [HttpGet("download/{id}")]
        public async Task<IActionResult> Download(int id)
        {
            var thumbnail = await _repository.GetByIdAsync(id);
            if (thumbnail == null)
                return NotFound(new { error = "Thumbnail not found." });

            // Increment download counter
            await _repository.IncrementDownloadCountAsync(id);

            // Build the physical path from the stored relative path
            var relativePath = thumbnail.GeneratedImagePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var physicalPath = Path.Combine(_env.WebRootPath, relativePath);

            if (!System.IO.File.Exists(physicalPath))
                return NotFound(new { error = "Image file not found on disk." });

            var fileName = Path.GetFileName(physicalPath);
            return PhysicalFile(physicalPath, "image/png", fileName);
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var thumbnail = await _repository.GetByIdAsync(id);
            if (thumbnail == null)
                return NotFound(new { error = "Thumbnail not found." });

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
