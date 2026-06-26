using Autotube.DTOs.All_in_One.Video;

namespace Autotube.Services.All_in_One.Video
{
    public interface IVideoPromptBuilder
    {
        Task<string> BuildAsync(AllInOneVideoRequestDto request);
    }
}
