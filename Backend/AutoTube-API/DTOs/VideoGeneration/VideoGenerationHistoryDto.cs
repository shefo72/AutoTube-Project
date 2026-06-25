namespace AutoTubeAPI.DTOs.VideoGeneration
{
    public class VideoGenerationHistoryDto
    {
        public int Id { get; set; }

        public string Prompt { get; set; } = null!;

        public int DurationSeconds { get; set; }

        public string AspectRatio { get; set; } = null!;

        public string VoiceTone { get; set; } = null!;

        public string VideoStyle { get; set; } = null!;

        public string GenerationStatus { get; set; } = null!;

        public string? GeneratedVideoUrl { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
