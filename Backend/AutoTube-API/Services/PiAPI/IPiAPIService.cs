using AutoTubeAPI.DTOs.VideoGeneration;

namespace AutoTubeAPI.Services.PiAPI
{
    public interface IPiAPIService
    {
        Task<string?> CreateVideoTaskAsync(
            string prompt,
            string GenerationMode,
            int durationSeconds,
            string aspectRatio);
        Task<PiAPIStatusResponseDto> GetTaskStatusAsync(string taskId);
    }
}