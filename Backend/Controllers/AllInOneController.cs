using Autotube.Data;
using Autotube.DTOs.All_in_One.Script;
using Autotube.DTOs.All_in_One.Thumbnail;
using Autotube.DTOs.All_in_One.Video;
using Autotube.DTOs.Billing.Enums;
using Autotube.Exceptions;
using Autotube.Models;
using Autotube.Services.All_in_One.Script;
using Autotube.Services.All_in_One.Thumbnail;
using Autotube.Services.All_in_One.Video;
using Autotube.Services.Billing.Quota;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace Autotube.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    public class AllInOneController : ControllerBase
    {
        private readonly IAllGeminiService _gemini;
        private readonly IAllThumbnailGenerationService _thumbnailService;
        private readonly IAllInOneVideoOrchestrator _videoOrchestrator;
        private readonly IQuotaService _quotaService;
        private readonly AutoTubeDbContext _context;
        private readonly ILogger<AllInOneController> _logger;

        public AllInOneController(
            IAllGeminiService gemini,
            IAllThumbnailGenerationService thumbnailService,
            IAllInOneVideoOrchestrator videoOrchestrator,
            IQuotaService quotaService,
            AutoTubeDbContext context,
            ILogger<AllInOneController> logger)
        {
            _gemini = gemini;
            _thumbnailService = thumbnailService;
            _videoOrchestrator = videoOrchestrator;
            _quotaService = quotaService;
            _context = context;
            _logger = logger;
        }

        // Generate All-in-One (Script + Thumbnail + Video)
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] AllScriptRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest(new { Message = "Prompt is required." });

            if (string.IsNullOrWhiteSpace(request.VoiceTone))
                return BadRequest(new { Message = "VoiceTone is required." });

            if (string.IsNullOrWhiteSpace(request.VideoStyle))
                return BadRequest(new { Message = "VideoStyle is required." });

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!int.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { Message = "Invalid user token." });

                _logger.LogInformation("AllInOne generation started for user {UserId}", userId);

                // Quota part
                var cost = CreditCosts.AllInOneGeneration;

                if (!await _quotaService.HasEnoughCreditsAsync(userId, cost))
                {
                    var quota = await _quotaService.GetQuotaAsync(userId);

                    throw new InsufficientCreditsException(
                        cost,
                        quota.CreditsRemaining);
                }

                // SCRIPT + THUMBNAIL IN PARALLEL
                var scriptTask = _gemini.GenerateScriptAsync(request);

                var thumbnailTask = _thumbnailService.GenerateAsync(
                    new GenerateThumbnailDto
                    {
                        Prompt = request.Prompt
                    },
                    userId);

                await Task.WhenAll(scriptTask, thumbnailTask);

                var scriptResponse = await scriptTask;
                var thumbnailResponse = await thumbnailTask;

                // SAVE SCRIPT
                var scriptEntity = new Script
                {
                    Topic = request.Prompt,
                    RawJson = JsonSerializer.Serialize(scriptResponse),
                    CreatedAt = DateTime.UtcNow,
                    UserId = userId
                };

                _context.Scripts.Add(scriptEntity);
                await _context.SaveChangesAsync();

                var videoRequest = new AllInOneVideoRequestDto
                {
                    Prompt = request.Prompt,
                    VoiceTone = request.VoiceTone,
                    VideoStyle = request.VideoStyle
                };

                var (videoPrompt, taskId) =
                    await _videoOrchestrator.StartAsync(videoRequest);

                // SAVE ALL IN ONE
                var entity = new AllInOne
                {
                    UserId = userId,
                    ScriptId = scriptEntity.Id,

                    Prompt = request.Prompt,
                    voice_tone = request.VoiceTone,
                    video_style = request.VideoStyle,

                    ThumbnailPrompt = thumbnailResponse.Thumbnail?.ThumbnailPrompt,
                    ImagePath = thumbnailResponse.Thumbnail?.ImagePath ?? string.Empty,
                    ImageProvider = thumbnailResponse.Thumbnail?.ImageProvider ?? string.Empty,

                    VideoPrompt = videoPrompt,
                    PiApiTaskId = taskId,
                    VideoPath = null,

                    Status = "Generating Video",
                    ErrorMessage = null,

                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.AllInOnes.Add(entity);
                await _context.SaveChangesAsync();

                //Quota part
                await _quotaService.DeductCreditsAsync(
                     userId,
                     cost,
                     CreditFeature.AllInOneGeneration,
                     $"All-In-One generation - {request.Prompt}");

                return Ok(new
                {
                    allInOneId = entity.Id,
                    status = entity.Status,
                    script = scriptResponse,
                    thumbnail = thumbnailResponse,
                    video = new
                    {
                        videoPrompt,
                        status = "Generating Video"
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AllInOne generation failed");

                return StatusCode(500, new
                {
                    Message = ex.Message,
                    Inner = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetResult(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var item = await _context.AllInOnes
                .Include(x => x.Script)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (item == null)
                return NotFound();

            if (item.Status != "Completed")
            {
                return Ok(new
                {
                    message = "Video not completed yet",
                    status = item.Status
                });
            }

            return Ok(new
            {
                script = JsonSerializer.Deserialize<ScriptResponse>(item.Script!.RawJson),
                thumbnailUrl = item.ImagePath,
                videoUrl = item.VideoPath,
                status = item.Status
            });
        }
    }
}