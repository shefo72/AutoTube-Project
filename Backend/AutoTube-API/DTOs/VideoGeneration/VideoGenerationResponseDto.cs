namespace AutoTubeAPI.DTOs.VideoGeneration
{
    public class VideoGenerationResponseDto
    {
        public int VideoGenerationId { get; set; }

        public string Status { get; set; } = null!;

        public string Message { get; set; } = null!;
    }
}