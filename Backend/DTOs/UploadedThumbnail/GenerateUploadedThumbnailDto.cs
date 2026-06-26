namespace Autotube.DTOs.UploadedThumbnail
{
    public class GenerateUploadedThumbnailDto
    {
        public string Prompt { get; set; } = string.Empty;
        public IFormFile Image { get; set; } = null!;
    }
}
