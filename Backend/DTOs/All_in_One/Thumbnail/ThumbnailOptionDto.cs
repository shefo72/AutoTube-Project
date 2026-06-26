namespace Autotube.DTOs.All_in_One.Thumbnail
{
    public class ThumbnailOptionDto
    {
        public int Id { get; set; }
        public string Prompt { get; set; } = string.Empty;
        public string? ThumbnailPrompt { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public string ImageProvider { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}