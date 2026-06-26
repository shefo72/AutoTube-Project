using AutoTubeAPI.Advacedhelp.Helpers;
using AutoTubeAPI.DTOs.Auth;
using Autotube.Data;
using AutoTubeAPI.Services.Auth;

using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AutoTubeAPI.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IGoogleAuthService _googleAuthService;
    private readonly IValidator<SignUpDto> _signUpValidator;
    private readonly IValidator<SignInDto> _signInValidator;

    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _config;

    public AuthController(
        IAuthService authService,
        IGoogleAuthService googleAuthService,
        IValidator<SignUpDto> signUpValidator,
        IValidator<SignInDto> signInValidator,
        ILogger<AuthController> logger,
        IConfiguration config)
    {
        _authService = authService;
        _googleAuthService = googleAuthService;
        _signUpValidator = signUpValidator;
        _signInValidator = signInValidator;
        _logger = logger;
        _config = config;
    }

    // Sign Up
    [HttpPost("signup")]
    [EnableRateLimiting("auth-policy")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> SignUp([FromBody] SignUpDto dto)
    {
        var validation = await _signUpValidator.ValidateAsync(dto);
        if (!validation.IsValid)
        {
            return BadRequest(new ErrorResponseDto
            {
                Success = false,
                Message = "Validation failed.",
                Errors = validation.Errors.Select(e => e.ErrorMessage).ToList(),
                StatusCode = 400,
            });
        }

        var result = await _authService.SignUpAsync(dto);
        return StatusCode(201, result);
    }

    // Sign In
    [HttpPost("signin")]
    [EnableRateLimiting("auth-policy")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SignIn([FromBody] SignInDto dto)
    {
        var validation = await _signInValidator.ValidateAsync(dto);
        if (!validation.IsValid)
        {
            return BadRequest(new ErrorResponseDto
            {
                Success = false,
                Message = "Validation failed.",
                Errors = validation.Errors.Select(e => e.ErrorMessage).ToList(),
                StatusCode = 400,
            });
        }

        var result = await _authService.SignInAsync(dto);
        return Ok(result);
    }


    
    // Get current user info
    [HttpGet("details")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMe()
    {
        var userId = ClaimsHelper.GetRequiredUserId(User);
        var userifo = await _authService.GetUserInfoAsync(userId);
        return Ok(userifo);

    }

    // Google OAuth2 Login
    [HttpGet("google-login")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public IActionResult GoogleLogin()
    {
        var callbackUrl = $"{Request.Scheme}://{Request.Host}/api/auth/google-callback";

        var secureState = Guid.NewGuid().ToString("N");

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.Now.AddMinutes(15)
        };
        Response.Cookies.Append("oauth_state", secureState, cookieOptions);

        var googleUrl = _googleAuthService.GetGoogleLoginUrl(callbackUrl, secureState);

        return Redirect(googleUrl);
    }


    // Google OAuth2 Callback
    [HttpGet("google-callback")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GoogleCallback(
    [FromQuery] string? code,
    [FromQuery] string? state,
    [FromQuery] string? error)
    {
        if (!string.IsNullOrEmpty(error) || string.IsNullOrEmpty(code))
        {
            return BadRequest(new ErrorResponseDto
            {
                Success = false,
                Message = "Google authentication was cancelled or failed.",
                StatusCode = 400,
            });
        }

        try
        {
            using var httpClient = new HttpClient();

            var callbackUrl =
                $"{Request.Scheme}://{Request.Host}/api/auth/google-callback";

            var tokenRequestParams = new Dictionary<string, string>
        {
            { "client_id", _config["GoogleAuth:ClientId"] ?? "" },
            { "client_secret", _config["GoogleAuth:ClientSecret"] ?? "" },
            { "code", code },
            { "grant_type", "authorization_code" },
            { "redirect_uri", callbackUrl }
        };

            var googleResponse = await httpClient.PostAsync(
                "https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(tokenRequestParams)
            );

            if (!googleResponse.IsSuccessStatusCode)
            {
                var errorContent =
                    await googleResponse.Content.ReadAsStringAsync();

                _logger.LogError(
                    "Google token exchange failed. Response: {Error}",
                    errorContent
                );

                return BadRequest(new ErrorResponseDto
                {
                    Success = false,
                    Message = $"Google Identity Error: {errorContent}",
                    StatusCode = 400,
                });
            }

            var tokenData =
                await googleResponse.Content
                    .ReadFromJsonAsync<GoogleTokenResponseDto>();

            if (tokenData == null || string.IsNullOrEmpty(tokenData.IdToken))
            {
                return BadRequest(new ErrorResponseDto
                {
                    Success = false,
                    Message = "Google identity token (id_token) was not found in the response.",
                    StatusCode = 400,
                });
            }

            var payload =
                await _googleAuthService.VerifyGoogleTokenAsync(
                    tokenData.IdToken
                );

            var result = await _authService.GoogleLoginAsync(
                googleId: payload.Subject,
                email: payload.Email,
                fullName: payload.Name,
                pictureUrl: payload.Picture
            );

            var frontendUrl = "https://auto-tube-eight.vercel.app";

            return Redirect(
                $"{frontendUrl}/auth/success?token={result.Token}"
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "An unhandled error occurred during the Google callback process."
            );

            return StatusCode(500, new
            {
                success = false,
                message = ex.Message,
                details = ex.InnerException?.Message,
                stackTrace = ex.StackTrace
            });
        }
    }
    public class GoogleTokenResponseDto
    {
        [System.Text.Json.Serialization.JsonPropertyName("id_token")]
        public string IdToken { get; set; } = default!;
    }

    // Logout
    [HttpGet("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Logout()
    {
        return Ok(new
        {
            Success = true,
            Message = "Logged out successfully"
        });
    }
}

public class GoogleVerifyDto
{
    public string IdToken { get; set; } = default!;
}
