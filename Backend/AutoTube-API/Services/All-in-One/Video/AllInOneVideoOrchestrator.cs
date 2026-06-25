using Autotube.DTOs.All_in_One.Video;

namespace Autotube.Services.All_in_One.Video
{
    public class AllInOneVideoOrchestrator : IAllInOneVideoOrchestrator
    {
        private readonly IVideoPromptBuilder _promptBuilder;
        private readonly IAllInOnePiAPIService _piapi;

        public AllInOneVideoOrchestrator(
            IVideoPromptBuilder promptBuilder,
            IAllInOnePiAPIService piapi)
        {
            _promptBuilder = promptBuilder;
            _piapi = piapi;
        }

        public async Task<(string videoPrompt, string taskId)> StartAsync(AllInOneVideoRequestDto request)
        {
            var videoPrompt = await _promptBuilder.BuildAsync(request);

            var taskId = await _piapi.CreateVideoTaskAsync(videoPrompt);

            return (videoPrompt, taskId);
        }
    }
}
