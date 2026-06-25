using Autotube.Models;

namespace AutoTubeAPI.Repositories.VideoClips
{
    public interface IVideoClipsRepository
    {
        Task AddRangeAsync(List<GeneratedVideoClip> clips);

        Task UpdateAsync(GeneratedVideoClip clip);

        Task<List<GeneratedVideoClip>> GetProcessingClipsAsync();

        Task<List<GeneratedVideoClip>> GetByVideoIdAsync(int videoId);
    }
}