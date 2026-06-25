using System.Text.Json.Serialization;

namespace Autotube.DTOs.All_in_One.Script
{
    public class GeminiPart
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }
}