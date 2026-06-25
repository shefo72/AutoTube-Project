using Autotube.DTOs.All_in_One.Video;
using AutoTubeAPI.DTOs.VideoGeneration;

namespace Autotube.Services.All_in_One.Video
{
    public interface IAllInOnePiAPIService
    {
        Task<string> CreateVideoTaskAsync(string prompt);
        Task<PiAPIStatusResponseDto> GetTaskStatusAsync(string taskId);
    }
}
