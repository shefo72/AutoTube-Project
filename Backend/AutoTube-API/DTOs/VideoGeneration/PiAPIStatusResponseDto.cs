namespace AutoTubeAPI.DTOs.VideoGeneration
{
    public class PiAPIStatusResponseDto
    {
        public string Status { get; set; } = null!;

        public string? VideoUrl { get; set; }
    }
}