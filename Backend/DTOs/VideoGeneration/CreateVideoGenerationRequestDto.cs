namespace AutoTubeAPI.DTOs.VideoGeneration
{
    public class CreateVideoGenerationRequestDto
    {
        public string Prompt { get; set; } = null!;

        public int DurationSeconds { get; set; }

        public string AspectRatio { get; set; } = null!;

        public string VoiceTone { get; set; } = null!;

        public string VideoStyle { get; set; } = null!;
    }
}