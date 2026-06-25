namespace AutoTubeAPI.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = default!;

        public DateTime ExpiresAt { get; set; }

        public UserInfoDto User { get; set; } = new();
    }
}
