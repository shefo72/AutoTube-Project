using Autotube.Data;
using Autotube.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace Autotube.Repositories.All_in_One.Thumbnail
{
    public class AllThumbnailRepository : IAllThumbnailRepository
    {
        private readonly AutoTubeDbContext _db;
        private readonly ILogger<AllThumbnailRepository> _logger;

        public AllThumbnailRepository(AutoTubeDbContext db, ILogger<AllThumbnailRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<AllInOne> SaveAsync(AllInOne thumbnail)
        {
            _logger.LogInformation("Saving new thumbnail to database. Provider: {Provider}", thumbnail.ImageProvider);

            _db.AllInOnes.Add(thumbnail);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Thumbnail saved with Id {Id}", thumbnail.Id);
            return thumbnail;
        }

        public async Task<AllInOne?> GetByIdAsync(int id)
        {
            return await _db.AllInOnes.FindAsync(id);
        }
    }
}