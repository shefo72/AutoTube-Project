using Autotube.DTOs.All_in_One.Thumbnail;
using Autotube.Models;

namespace Autotube.Repositories.All_in_One.Thumbnail
{
    public interface IAllThumbnailRepository
    {

        Task<AllInOne> SaveAsync(AllInOne thumbnail);

        Task<AllInOne?> GetByIdAsync(int id);
    }
}
