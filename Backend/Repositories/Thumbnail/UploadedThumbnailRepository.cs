using Autotube.Data;
using Autotube.DTOs.UploadedThumbnail;
using Autotube.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;



namespace Autotube.Repositories.Thumbnail
{
    public class UploadedThumbnailRepository
    {
        private readonly AutoTubeDbContext _context;

        public UploadedThumbnailRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        public async Task SaveAsync(UploadedImageThumbnail thumbnail)
        {
            _context.UploadedImageThumbnails.Add(thumbnail);
            await _context.SaveChangesAsync();
        }

        public async Task<UploadedImageThumbnail?> GetByIdAsync(int id)
        {
            return await _context.UploadedImageThumbnails.FindAsync(id);
        }


        public async Task<List<ThumbnailHistoryDto>> GetUserHistoryAsync(int userId)
        {
            var uploaded = await _context.UploadedImageThumbnails
                .Where(x => x.UserId == userId)
                .Select(x => new ThumbnailHistoryDto
                {
                    Id = x.Id,
                    ThumbnailUrl = x.GeneratedImagePath,
                    Prompt = x.Prompt,
                    CreatedAt = x.CreatedAt,
                    Type = "Uploaded Image"
                })
                .ToListAsync();

            var normal = await _context.GeneratedThumbnails
                .Where(x => x.UserId == userId)
                .Select(x => new ThumbnailHistoryDto
                {
                    Id = x.Id,
                    ThumbnailUrl = x.ImagePath,
                    Prompt = x.Prompt,
                    CreatedAt = x.CreatedAt,
                    Type = "Generated"
                })
                .ToListAsync();

            return uploaded
                .Concat(normal)
                .OrderByDescending(x => x.CreatedAt)
                .ToList();
        }

        // Download count
        public async Task IncrementDownloadCountAsync(int id)
        {
            var thumbnail = await _context.UploadedImageThumbnails.FindAsync(id);
            if (thumbnail != null)
            {
                thumbnail.DownloadCount++;
                await _context.SaveChangesAsync();
            }
        }

        // Delete
        public async Task DeleteAsync(int id)
        {
            var thumbnail = await _context.UploadedImageThumbnails.FindAsync(id);
            if (thumbnail != null)
            {
                _context.UploadedImageThumbnails.Remove(thumbnail);
                await _context.SaveChangesAsync();
            }
        }
    }
}
