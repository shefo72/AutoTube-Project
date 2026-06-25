using Autotube.DTOs.All_in_One.Script;

namespace Autotube.DTOs.All_in_One.Video
{
    public class AllInOneVideoRequestDto
    {
        public string Prompt { get; set; } = string.Empty;
        public string VoiceTone { get; set; } = string.Empty;
        public string VideoStyle { get; set; } = string.Empty;
    }
}