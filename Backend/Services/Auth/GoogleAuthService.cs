using AutoTubeAPI.Services.Auth;
using Google.Apis.Auth;

namespace AutoTubeAPI.Services.Auth
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<GoogleAuthService> _logger;

        public GoogleAuthService(IConfiguration config, ILogger<GoogleAuthService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string idToken)
        {
            var clientId = _config["GoogleAuth:ClientId"]
                ?? throw new InvalidOperationException("GoogleAuth:ClientId is not configured.");

            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                _logger.LogInformation("Google token verified successfully for: {Email}", payload.Email);
                return payload;
            }
            catch (InvalidJwtException ex)
            {
                _logger.LogWarning("Invalid Google token provided: {Message}", ex.Message);
                throw new UnauthorizedAccessException("Invalid or expired Google token.");
            }
            catch (Exception ex) when (ex is HttpRequestException || ex is TaskCanceledException)
            {
                _logger.LogError(ex, "Network error occurred while contacting Google API servers.");
                throw new ApplicationException("Authentication service is temporarily unavailable. Please try again later.");
            }
        }

        public string GetGoogleLoginUrl(string redirectUri, string state)
        {
            var clientId = _config["GoogleAuth:ClientId"]
                ?? throw new InvalidOperationException("GoogleAuth:ClientId is not configured.");

            if (string.IsNullOrWhiteSpace(state))
            {
                throw new ArgumentException("State parameter is required for security tracking.", nameof(state));
            }

            var encodedRedirect = Uri.EscapeDataString(redirectUri);
            var encodedState = Uri.EscapeDataString(state);

            return "https://accounts.google.com/o/oauth2/v2/auth" +
                   $"?client_id={clientId}" +
                   $"&redirect_uri={encodedRedirect}" +
                   $"&response_type=code" +
                   $"&scope=openid%20email%20profile" +
                   $"&state={encodedState}" +
                   $"&access_type=offline" +
                   $"&prompt=consent";
        }
    }
}
