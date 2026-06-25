namespace AutoTubeAPI.DTOs.VideoGeneration
{
    public class SceneDto
    {
        public string Prompt { get; set; } = null!;
        public int DurationSeconds { get; set; }
    }
}