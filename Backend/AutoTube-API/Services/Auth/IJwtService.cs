using AutoTubeAPI.DTOs.Auth;
using Autotube.Models;

namespace AutoTubeAPI.Services.Auth
{
    public interface IJwtService
    {
        string GenerateToken(User user);

        DateTime GetExpirationTime();
    }
}