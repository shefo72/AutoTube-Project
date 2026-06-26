namespace Autotube.DTOs.All_in_One.Video
{
    public class AllInOneVideoResponseDto
    {
        public string TaskId { get; set; } = string.Empty;
        public string VideoPrompt { get; set; } = string.Empty;
        public string Status { get; set; } = "Queued";
    }
}