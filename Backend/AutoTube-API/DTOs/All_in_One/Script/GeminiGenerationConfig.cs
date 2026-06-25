using System.Text.Json.Serialization;

namespace Autotube.DTOs.All_in_One.Script
{
    public class GeminiGenerationConfig
    {
        [JsonPropertyName("temperature")]
        public double Temperature { get; set; } = 0.7;
    }
}