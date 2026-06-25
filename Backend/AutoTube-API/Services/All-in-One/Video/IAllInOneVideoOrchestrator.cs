using Autotube.DTOs.All_in_One.Video;

namespace Autotube.Services.All_in_One.Video
{
    public interface IAllInOneVideoOrchestrator
    {
        Task<(string videoPrompt, string taskId)> StartAsync(AllInOneVideoRequestDto request);
    }
}
