namespace AutoTubeAPI.DTOs.Profile
{
    public class ProfileResponseDto
    {
        public BasicInfoDto BasicInfo { get; set; } = new();

        public PersonalInfoDto PersonalInfo { get; set; } = new();

        public List<string> SelectedNiches { get; set; } = new();

    }
}