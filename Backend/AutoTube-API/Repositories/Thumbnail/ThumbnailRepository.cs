using Autotube.Models;
using Autotube.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Autotube.Repositories.Thumbnail
{

    public class ThumbnailRepository : IThumbnailRepository
    {
        private readonly AutoTubeDbContext _db;
        private readonly ILogger<ThumbnailRepository> _logger;

        public ThumbnailRepository(AutoTubeDbContext db, ILogger<ThumbnailRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<GeneratedThumbnail?> FindSimilarAsync(string prompt, string style)
        {
            _logger.LogInformation(
                "Searching for similar thumbnail. Prompt: '{Prompt}', Style: '{Style}'",
                prompt,
                style);

            var promptLower = prompt.ToLower();

            // Get ALL matching thumbnails
            var matches = await _db.GeneratedThumbnails
                .Where(t =>
                    t.Style == style &&
                    t.Prompt.ToLower().Contains(promptLower))
                .ToListAsync();

            // No matches found
            if (!matches.Any())
            {
                _logger.LogInformation("No similar thumbnail found in database.");
                return null;
            }

            // Randomly select One thumbnail from the matched results
            var selectedThumbnail = matches
                .OrderBy(t => Guid.NewGuid())
                .First();

            _logger.LogInformation(
                "Random similar thumbnail selected. Id: {Id}",
                selectedThumbnail.Id);

            return selectedThumbnail;
        }

        public async Task<GeneratedThumbnail> SaveAsync(GeneratedThumbnail thumbnail)
        {
            _logger.LogInformation("Saving new thumbnail to database. Provider: {Provider}", thumbnail.AiProvider);

            _db.GeneratedThumbnails.Add(thumbnail);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Thumbnail saved with Id {Id}", thumbnail.Id);
            return thumbnail;
        }

        // Reuse count
        public async Task IncrementReuseCountAsync(int id)
        {

            await _db.GeneratedThumbnails
                .Where(t => t.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(t => t.ReuseCount, t => t.ReuseCount + 1));

            _logger.LogInformation("Incremented ReuseCount for thumbnail Id {Id}", id);
        }

        // Download count
        public async Task IncrementDownloadCountAsync(int id)
        {
            await _db.GeneratedThumbnails
                .Where(t => t.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(t => t.DownloadCount, t => t.DownloadCount + 1));

            _logger.LogInformation("Incremented DownloadCount for thumbnail Id {Id}", id);
        }

        public async Task<GeneratedThumbnail?> GetByIdAsync(int id)
        {
            return await _db.GeneratedThumbnails.FindAsync(id);
        }
    }
}
