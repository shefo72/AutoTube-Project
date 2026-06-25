namespace AutoTubeAPI.DTOs.Profile
{
    public class UpdateProfileDto
    {
        public string? ProfileImageUrl { get; set; }

        public string? FullName { get; set; }

        public string? Email { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public string? PhoneNumber { get; set; }

        public List<string> SelectedNiches { get; set; } = [];

    }
}