using AutoTubeAPI.DTOs.VideoGeneration;
using AutoTubeAPI.Services.VideoGeneration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AutoTubeAPI.Controllers
{
    [Authorize]
    [Route("api/video-generation")]
    [ApiController]
    public class VideoGenerationController : ControllerBase
    {
        private readonly IVideoGenerationService _videoGenerationService;

        public VideoGenerationController(
            IVideoGenerationService videoGenerationService)
        {
            _videoGenerationService = videoGenerationService;
        }

        // POST: api/video-generation/generate
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateVideo(
            [FromBody] CreateVideoGenerationRequestDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var result = await _videoGenerationService
                .GenerateVideoAsync(request, userId);

            return Ok(result);
        }

        // GET: api/video-generation/status/1
        [HttpGet("status/{id}")]
        public async Task<IActionResult> GetGenerationStatus(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var status = await _videoGenerationService
                .GetGenerationStatusAsync(id, userId);

            return Ok(status);
        }

        // GET: api/video-generation/history
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var history = await _videoGenerationService
                .GetHistoryAsync(userId);

            return Ok(history);
        }

        // GET: api/video-generation/download/1
        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadVideo(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var url = await _videoGenerationService
                .GetDownloadUrlAsync(id, userId);

            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            return Ok(new
            {
                downloadUrl = $"{baseUrl}{url}"
            });
        }
    }
}