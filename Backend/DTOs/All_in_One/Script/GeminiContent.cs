using System;
using System.Text.Json.Serialization;

namespace Autotube.DTOs.All_in_One.Script
{
    public class GeminiContent
    {
        [JsonPropertyName("parts")]
        public GeminiPart[] Parts { get; set; } = Array.Empty<GeminiPart>();
    }
}