using Autotube.DTOs.ThumbnailP;
using Autotube.Repositories.Thumbnail;
using Autotube.Services.Thumbnail;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace Autotube.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/thumbnails")]
    public class ThumbnailsController : ControllerBase
    {
        private readonly ThumbnailGenerationService _generationService;
        private readonly IThumbnailRepository _repo;
        private readonly ImageStorageService _imageStorage;
        private readonly ILogger<ThumbnailsController> _logger;

        public ThumbnailsController(
            ThumbnailGenerationService generationService,
            IThumbnailRepository repo,
            ImageStorageService imageStorage,
            ILogger<ThumbnailsController> logger)
        {
            _generationService = generationService;
            _repo = repo;
            _imageStorage = imageStorage;
            _logger = logger;
        }

        // Generate thumbnail
        [HttpPost("generate")]
        public async Task<ActionResult<GeneratedThumbnailResponseDto>> Generate(
          [FromBody] GenerateThumbnailDto request)
          {
        if (string.IsNullOrWhiteSpace(request.Prompt))
            return BadRequest("Prompt cannot be empty.");

        if (string.IsNullOrWhiteSpace(request.Style))
            return BadRequest("Style cannot be empty.");

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out int userId))
            return Unauthorized();

        var result = await _generationService.GenerateAsync(request, userId);

        return Ok(result);
    }


        // Download thumbnail
        [HttpGet("download/{id:int}")]
        public async Task<IActionResult> Download(int id)
        {
            _logger.LogInformation("Download requested for thumbnail Id {Id}", id);

            // Look up the thumbnail in the database
            var thumbnail = await _repo.GetByIdAsync(id);

            if (thumbnail == null)
            {
                _logger.LogWarning("Thumbnail Id {Id} not found.", id);
                return NotFound(new { message = $"Thumbnail with Id {id} was not found." });
            }

            // Resolve the absolute file system path from the stored relative path
            var absolutePath = _imageStorage.GetAbsolutePath(thumbnail.ImagePath);

            if (!System.IO.File.Exists(absolutePath))
            {
                _logger.LogError("Image file missing on disk for thumbnail Id {Id}. Path: {Path}", id, absolutePath);
                return NotFound(new { message = "Image file not found on server." });
            }

            // Increment the download counter 
            await _repo.IncrementDownloadCountAsync(id);

            // Read the file and return it as a downloadable PNG
            var fileBytes = await System.IO.File.ReadAllBytesAsync(absolutePath);
            var fileName = Path.GetFileName(absolutePath);

            _logger.LogInformation("Serving download for thumbnail Id {Id}, file: {File}", id, fileName);

            // Returns the file with the correct MIME type and a suggested file name
            return File(fileBytes, "image/png", $"autotube-thumbnail-{id}.png");
        }
    }
}
