using AutoTubeAPI.DTOs.VideoGeneration;

namespace AutoTubeAPI.Services.VideoGeneration
{
    public interface IVideoGenerationService
    {
        Task<VideoGenerationResponseDto> GenerateVideoAsync(
            CreateVideoGenerationRequestDto request,
            int userId);

        Task<string> GetGenerationStatusAsync(int id, int userId);

        Task<List<VideoGenerationHistoryDto>> GetHistoryAsync(int userId);

        Task PollVideoStatusAsync();

        Task<string> GetDownloadUrlAsync(int id, int userId);
    }
}