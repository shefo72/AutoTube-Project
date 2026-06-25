using Autotube.Data;
using Autotube.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoTubeAPI.Repositories.VideoClips
{
    public class VideoClipsRepository : IVideoClipsRepository
    {
        private readonly AutoTubeDbContext _context;

        public VideoClipsRepository(AutoTubeDbContext context)
        {
            _context = context;
        }

        public async Task AddRangeAsync(List<GeneratedVideoClip> clips)
        {
            await _context.GeneratedVideoClips.AddRangeAsync(clips);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(GeneratedVideoClip clip)
        {
            _context.GeneratedVideoClips.Update(clip);
            await _context.SaveChangesAsync();
        }

        //  USED BY BACKGROUND WORKER
        // Consider adding tenant isolation later (UserId via Video join)
        public async Task<List<GeneratedVideoClip>> GetProcessingClipsAsync()
        {
            return await _context.GeneratedVideoClips
                .AsNoTracking()
                .Where(x => x.GenerationStatus == "Processing")
                .ToListAsync();
        }

        public async Task<List<GeneratedVideoClip>> GetByVideoIdAsync(int videoId)
        {
            return await _context.GeneratedVideoClips
                .AsNoTracking()
                .Where(x => x.GeneratedVideoId == videoId)
                .OrderBy(x => x.ClipOrder)
                .ToListAsync();
        }
    }
}