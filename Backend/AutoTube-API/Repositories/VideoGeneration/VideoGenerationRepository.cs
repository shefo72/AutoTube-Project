using Autotube.Data;
using Autotube.Models;
using AutoTubeAPI.DTOs.VideoGeneration;
using Microsoft.EntityFrameworkCore;

namespace AutoTubeAPI.Repositories.VideoGeneration
{
    public class VideoGenerationRepository : IVideoGenerationRepository
    {
        private readonly AutoTubeDbContext _context;
        private readonly IConfiguration _configuration;

        public VideoGenerationRepository(AutoTubeDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<GeneratedVideo> CreateAsync(GeneratedVideo video)
        {
            await _context.GeneratedVideos.AddAsync(video);
            await _context.SaveChangesAsync();
            return video;
        }

        public async Task CreateClipAsync(GeneratedVideoClip clip)
        {
            await _context.GeneratedVideoClips.AddAsync(clip);
            await _context.SaveChangesAsync();
        }

        public async Task<List<GeneratedVideoClip>> GetVideoClipsAsync(int generatedVideoId)
        {
            return await _context.GeneratedVideoClips
                .Where(x => x.GeneratedVideoId == generatedVideoId)
                .OrderBy(x => x.ClipOrder)
                .ToListAsync();
        }

        public async Task UpdateAsync(GeneratedVideo video)
        {
            _context.GeneratedVideos.Update(video);
            await _context.SaveChangesAsync();
        }

        public async Task<GeneratedVideo?> GetByIdAsync(int id)
        {
            return await _context.GeneratedVideos
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        // SAFE USER-SCOPED ACCESS 
        public async Task<GeneratedVideo?> GetByIdForUserAsync(int id, int userId)
        {
            return await _context.GeneratedVideos
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        }

        public async Task<List<VideoGenerationHistoryDto>> GetUserHistoryAsync(int userId)
        {
            var baseUrl = _configuration["AppSettings:BaseUrl"];
            return await _context.GeneratedVideos
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new VideoGenerationHistoryDto
                {
                    Id = x.Id,
                    Prompt = x.Prompt,
                    DurationSeconds = x.DurationSeconds,
                    AspectRatio = x.AspectRatio,
                    VoiceTone = x.VoiceTone,
                    VideoStyle = x.VideoStyle,
                    GenerationStatus = x.GenerationStatus,
                    GeneratedVideoUrl =
                         x.GeneratedVideoUrl != null
                             ? $"{baseUrl}{x.GeneratedVideoUrl}"
                             : null,
                    CreatedAt = x.CreatedAt ?? DateTime.MinValue
                })
                .ToListAsync();
        }

        public async Task<List<GeneratedVideo>> GetProcessingVideosAsync()
        {
            return await _context.GeneratedVideos
                .Where(x => x.GenerationStatus == "Processing")
                .ToListAsync();
        }
    }
}