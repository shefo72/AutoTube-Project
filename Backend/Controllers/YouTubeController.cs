using Autotube.Data;
using Autotube.DTOs.Auth;
using Autotube.Services.GapAnalysis.Interfaces;
using AutoTubeAPI.Advacedhelp.Helpers;
using AutoTubeAPI.DTOs.Auth;
using AutoTubeAPI.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AutoTubeAPI.Controllers;

[ApiController]
[Route("api/youtube")]
[Produces("application/json")]
public class YouTubeController : ControllerBase
{
    private readonly IYouTubeChannelService _youTubeService;
    private readonly ILogger<YouTubeController> _logger;
    private readonly IConfiguration _config;

    public YouTubeController(IYouTubeChannelService youTubeService, ILogger<YouTubeController> logger, IConfiguration config)
    {
        _youTubeService = youTubeService;
        _logger = logger;
        _config = config;

    }

    // Initiates the YouTube OAuth connection process for the authenticated user.
    [HttpGet("connect")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult ConnectYouTube()
    {
        var userId = ClaimsHelper.GetRequiredUserId(User);

        _logger.LogInformation("User {UserId} initiating YouTube connection.", userId);
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        if (string.IsNullOrEmpty(token))
        {
            token = Request.Query["token"].ToString();
        }

        var authUrl = _youTubeService.GetAuthorizationUrl(userId);
        return Redirect(authUrl);
    }

    // Handles the callback from YouTube OAuth, processing the authorization code and state.
    [HttpGet("callback")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> YouTubeCallback(
    [FromQuery] string? code,
    [FromQuery] string? state,
    [FromQuery] string? error)
    {
        _logger.LogInformation(
            "YouTube callback hit. Code: {Code}, State: {State}, Error: {Error}",
            code,
            state,
            error);

        if (!string.IsNullOrEmpty(error))
        {
            _logger.LogWarning("YouTube OAuth error: {Error}", error);

            return BadRequest(new ErrorResponseDto
            {
                Success = false,
                Message = $"Google OAuth Error: {error}",
                StatusCode = 400,
            });
        }

        var result = await _youTubeService.HandleCallbackAsync(code!, state!);

        var frontendUrl = _config["Frontend:BaseUrl"];
        return Redirect($"{frontendUrl}/youtube/success?connected=true");
    }

    // Saves the YouTube channel ID for the authenticated user.
    [HttpPost("channelId")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SaveOnboardingChannelId([FromBody] YouTubeChannelIdDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid or missing user token.");
        }

        if (string.IsNullOrWhiteSpace(dto.ChannelId))
        {
            return BadRequest("Channel ID cannot be empty.");
        }

        var result = await _youTubeService.SaveChannelIdAsync(userId, dto.ChannelId);

        if (!result)
        {
            return BadRequest("Something went wrong while saving the YouTube channel ID.");
        }

        return Ok(new { success = true, message = "YouTube channel ID saved successfully." });
    }

    // Retrieves the YouTube channel information for the authenticated user.
    [HttpGet("channel")]
    [ProducesResponseType(typeof(YouTubeChannelDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChannelById()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid or missing user token.");
        }

        var channelIds = await _youTubeService.GetChannelByIdAsync(userId);

        if (channelIds == null)
        {
            return NotFound("No channels found for this user.");
        }

        return Ok(channelIds);

    }

}

