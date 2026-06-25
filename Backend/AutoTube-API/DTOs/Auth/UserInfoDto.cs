namespace AutoTubeAPI.DTOs.Auth
{
    public class UserInfoDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public DateOnly DateOfBirth { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string AuthProvider { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = default!;
    }
}
