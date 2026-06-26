using Autotube.Models;
using AutoTubeAPI.DTOs.VideoGeneration;

namespace AutoTubeAPI.Repositories.VideoGeneration
{
    public interface IVideoGenerationRepository
    {
        Task<GeneratedVideo> CreateAsync(GeneratedVideo video);

        Task CreateClipAsync(GeneratedVideoClip clip);

        Task<List<GeneratedVideoClip>> GetVideoClipsAsync(int generatedVideoId);

        Task UpdateAsync(GeneratedVideo video);

        Task<GeneratedVideo?> GetByIdAsync(int id);

        Task<GeneratedVideo?> GetByIdForUserAsync(int id, int userId);

        Task<List<VideoGenerationHistoryDto>> GetUserHistoryAsync(int userId);

        Task<List<GeneratedVideo>> GetProcessingVideosAsync();
    }
}