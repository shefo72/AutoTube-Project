using Autotube.DTOs.ThumbnailP;
using Autotube.Models;

namespace Autotube.Repositories.Thumbnail
{
    public interface IThumbnailRepository
    {

        Task<GeneratedThumbnail?> FindSimilarAsync(string prompt, string style);

        Task<GeneratedThumbnail> SaveAsync(GeneratedThumbnail thumbnail);

        Task IncrementReuseCountAsync(int id);

        Task IncrementDownloadCountAsync(int id);

        Task<GeneratedThumbnail?> GetByIdAsync(int id);
    }
}
