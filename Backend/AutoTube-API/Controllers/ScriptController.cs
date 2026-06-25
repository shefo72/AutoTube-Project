
using Autotube.Data;
using Autotube.DTOs.Billing.Enums;
using Autotube.DTOs.Script;
using Autotube.Exceptions;
using Autotube.Models;
using Autotube.Services.Billing.Quota;
using Autotube.Services.Script;
using Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;

namespace Autotube.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ScriptController : ControllerBase
    {
        private readonly IGeminiService _gemini;
        private readonly ILogger<ScriptController> _logger;
        private readonly IQuotaService _quotaService;
        private readonly AutoTubeDbContext _context;

        public ScriptController(
          IGeminiService gemini,
          ILogger<ScriptController> logger,
          IQuotaService quotaService,
          AutoTubeDbContext context)
        {
            _gemini = gemini;
            _logger = logger;
            _quotaService = quotaService;
            _context = context;
        }

        
        private string? GetCurrentUserId()
        {
            return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
        }
        // Generates a script based on the provided request and optional gap report ID.
        [HttpPost]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status504GatewayTimeout)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status502BadGateway)]
        public async Task<IActionResult> GenerateScript(
          [FromBody] ScriptRequest request,
          [FromQuery] int? reportId = null)
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ErrorResponse
                {
                    Message = "You must be logged in to generate a script.",
                    Code = "UNAUTHORIZED_ACCESS"
                });
            }

            string recommendations = string.Empty;

            if (reportId.HasValue)
            {
                var report = await _context.GapReports
                    .FirstOrDefaultAsync(r => r.Id == reportId.Value);

                if (report != null)
                {
                    if (string.IsNullOrWhiteSpace(request.Topic) && !string.IsNullOrWhiteSpace(report.VideoTitle))
                    {
                        request.Topic = report.VideoTitle;
                    }

                    recommendations = $@"
                        Topic: {report.VideoTitle}
                        Strengths (Use for Hooks): {report.StrengthsJson}
                        Weaknesses (Use for SEO/Gaps): {report.WeaknessesJson}
                        Viral Potential: {report.ViralPotentialAnalysis}";

                    _logger.LogInformation("Loaded data from GapReport ID: {Id}", reportId);
                }
            }

            if (string.IsNullOrWhiteSpace(request.Topic))
            {
                return BadRequest(new ErrorResponse
                {
                    Message = "Topic is required.",
                    Code = "MISSING_TOPIC"
                });
            }

            if (string.IsNullOrWhiteSpace(request.VideoType))
            {
                string len = request.Length?.ToLower() ?? "";
                bool isShort = (len.Contains("5") || len.Contains("10") || len.Contains("15")) && !len.Contains("min");
                request.VideoType = isShort ? "youtube_shorts" : "youtube_long";
            }

            string currentVideoType = request.VideoType.ToLower();

            _logger.LogInformation(
              "Generating script for Topic: {Topic} | Tone: {Tone} | Length: {Length} | Type: {VideoType}",
              request.Topic, request.Tone, request.Length, currentVideoType);

            try
            {
                var scriptCost = CreditCosts.ScriptGeneration;

                if (!await _quotaService.HasEnoughCreditsAsync(
                        int.Parse(userId),
                        scriptCost))
                {
                    var quota = await _quotaService.GetQuotaAsync(
                        int.Parse(userId));

                    throw new InsufficientCreditsException(
                        scriptCost,
                        quota.CreditsRemaining);
                }
                dynamic script = await _gemini.GenerateScriptAsync(request, recommendations);

                if (script != null)
                {
                    var stats = script.Stats;

                    if (stats != null)
                    {
                        int totalWords = (stats.TotalWords != null) ? (int)stats.TotalWords : 150;
                        double totalMinutes = (double)totalWords / 130.0;
                        int mins = (int)totalMinutes;
                        int secs = (int)((totalMinutes - mins) * 60);

                        stats.Duration = $"{mins:D2}:{secs:D2}";
                    }
                }

                var scriptEntity = new Script
                {
                    Topic = request.Topic,
                    RawJson = JsonSerializer.Serialize(script, new JsonSerializerOptions { WriteIndented = false }),
                    CreatedAt = DateTime.UtcNow,
                    GapReportId = reportId,
                    UserId = int.Parse(userId)
                };

                _context.Database.SetCommandTimeout(60);
                _context.Scripts.Add(scriptEntity);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Script generated and saved successfully for topic: {Topic}", request.Topic);

                await _quotaService.DeductCreditsAsync(
                  int.Parse(userId),
                  scriptCost,
                  CreditFeature.ScriptGeneration,
                  $"Script generation - {request.Topic}");

                return Ok(script);
            }
            catch (TimeoutException ex)
            {
                _logger.LogWarning(ex, "Gemini request timed out.");
                return StatusCode(StatusCodes.Status504GatewayTimeout, new ErrorResponse
                {
                    Message = "The AI service took too long to respond. Please try again.",
                    Code = "GEMINI_TIMEOUT"
                });
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error communicating with Gemini.");
                return StatusCode(StatusCodes.Status502BadGateway, new ErrorResponse
                {
                    Message = "Could not reach the AI service. Check your API key or try later.",
                    Code = "GEMINI_HTTP_ERROR"
                });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Gemini returned an unexpected response format.");
                return StatusCode(StatusCodes.Status502BadGateway, new ErrorResponse
                {
                    Message = "The AI service returned an unreadable response. Please retry.",
                    Code = "GEMINI_PARSE_ERROR"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error: {Message}", ex.Message);
                return StatusCode(500, new
                {
                    Message = "An unexpected server error occurred.",
                    Error = ex.Message,
                    Code = "INTERNAL_ERROR"
                });
            }
        }
        // Retrieves the history of scripts generated by the current user.
        [HttpGet("history")]
        [ProducesResponseType(typeof(List<Script>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserHistory()
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrEmpty(userId))
            {
                return Ok(new List<Script>());
            }

            _logger.LogInformation("Fetching script history for User: {UserId}", userId);

            var history = await _context.Scripts
              .Where(s => s.UserId == int.Parse(userId))
              .OrderByDescending(s => s.CreatedAt)
              .ToListAsync();

            return Ok(history);
        }
        // Health check endpoint to verify the service is running.
        [HttpGet("health")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Health() =>
          Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }

    public class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }
}