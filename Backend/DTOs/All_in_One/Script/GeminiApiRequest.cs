using System;
using System.Text.Json.Serialization;

namespace Autotube.DTOs.All_in_One.Script
{
    public class GeminiApiRequest
    {
        [JsonPropertyName("contents")]
        public GeminiContent[] Contents { get; set; } = Array.Empty<GeminiContent>();

        [JsonPropertyName("generation_config")]
        public GeminiGenerationConfig GenerationConfig { get; set; } = new();

        [JsonPropertyName("response_mime_type")]
        public string ResponseMimeType { get; set; } = "application/json";
    }
}