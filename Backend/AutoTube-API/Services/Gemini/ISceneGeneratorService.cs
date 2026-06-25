using AutoTubeAPI.DTOs.VideoGeneration;

namespace AutoTubeAPI.Services.Gemini
{
    public interface ISceneGeneratorService
    {
        Task<List<SceneDto>> GenerateScenesAsync(
            string enhancedPrompt,
            int totalDurationSeconds);
    }
}