namespace Autotube.DTOs.ThumbnailP
{
    public class ThumbnailOptionDto
    {
        public int Id { get; set; }
        public string Prompt { get; set; } = string.Empty;
        public string Style { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string AiProvider { get; set; } = string.Empty;
        public int ReuseCount { get; set; }
        public int DownloadCount { get; set; }
        public bool IsFavorite { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsCached { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
