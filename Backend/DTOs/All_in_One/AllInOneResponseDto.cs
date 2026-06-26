using Autotube.DTOs.All_in_One.Script;
using Autotube.DTOs.All_in_One.Thumbnail;
using Autotube.DTOs.All_in_One.Video;

namespace Autotube.DTOs.All_in_One
{
    public class AllInOneResponseDto
    {
        public ScriptResponse Script { get; set; } = new();
        public GeneratedThumbnailResponseDto? Thumbnail { get; set; }
        public AllInOneVideoResponseDto? Video { get; set; }
    }
}