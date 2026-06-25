using System.Security.Claims;

namespace AutoTubeAPI.Advacedhelp.Helpers
{
    public class ClaimsHelper
    {
        public static int? GetUserId(ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst("userId")
                            ?? user.FindFirst(ClaimTypes.NameIdentifier)
                            ?? user.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);

            if (userIdClaim == null) return null;

            if (int.TryParse(userIdClaim.Value, out var userId))
                return userId;

            return null;
        }

        public static int GetRequiredUserId(ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            if (userId == null)
                throw new UnauthorizedAccessException("User ID not found in token. Please sign in again.");
            return userId.Value;
        }
    }
}


