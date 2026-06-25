namespace AutoTubeAPI.DTOs.Profile
{
    public class BasicInfoDto
    {
        public string? ProfileImageUrl { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? YouTubeChannel { get; set; }

        public string PlanType { get; set; } = string.Empty;

        public string MemberSince { get; set; } = string.Empty;
    }
}