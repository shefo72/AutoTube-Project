using Autotube.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AutoTubeAPI.Services.Auth
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user)
        {
            var secretKey = _config["Jwt:SecretKey"]!;
            var issuer = _config["Jwt:Issuer"]!;
            var audience = _config["Jwt:Audience"]!;
            var expMinutes = int.Parse(_config["Jwt:ExpirationMinutes"] ?? "10080");

            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var signingKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userId", user.Id.ToString()),
            new Claim("fullName", user.FullName),
            new Claim("authProvider", user.AuthProvider),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.MobilePhone, user.PhoneNumber?.ToString()?? string.Empty),
            ///
            //new Claim(ClaimTypes.DateOfBirth,user.DateOfBirth.ToString("yyyy-MM-dd")),
            ///
           new Claim("CreatedAt", user.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"))
        };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = GetExpirationTime(),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = credentials,
                IssuedAt = DateTime.Now,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public DateTime GetExpirationTime()
        {
            var expMinutes = int.Parse(_config["Jwt:ExpirationMinutes"] ?? "10080");
            return DateTime.Now.AddMinutes(expMinutes);
        }
    }
}
