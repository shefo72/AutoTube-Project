namespace Autotube.DTOs.UploadedThumbnail
{
    public class ThumbnailHistoryDto
    {
        public int Id { get; set; }

        public string ThumbnailUrl { get; set; } = string.Empty;

        public string Prompt { get; set; } = string.Empty;

        public DateTime? CreatedAt { get; set; }

        public string Type { get; set; } = string.Empty;
    }
}
