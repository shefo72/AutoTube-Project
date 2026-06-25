namespace Autotube.DTOs.UploadedThumbnail
{
    public class UploadedThumbnailResponseDto
    {
        public int Id { get; set; }
        public string Prompt { get; set; } = string.Empty;
        public string OriginalImagePath { get; set; } = string.Empty;
        public string GeneratedImagePath { get; set; } = string.Empty;
        public string AiProvider { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
