using Autotube.DTOs.All_in_One.Thumbnail;

namespace Autotube.Services.All_in_One.Thumbnail
{
    public interface IAllThumbnailGenerationService
    {
        Task<GeneratedThumbnailResponseDto> GenerateAsync(
            GenerateThumbnailDto request,
            int userId);
    }
}
