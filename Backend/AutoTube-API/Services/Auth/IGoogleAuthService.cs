using Google.Apis.Auth;

namespace AutoTubeAPI.Services.Auth
{
    public interface IGoogleAuthService
    {
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string idToken);

        string GetGoogleLoginUrl(string redirectUri, string state);
    }
}