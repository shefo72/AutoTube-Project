using System.Text.Json.Serialization;

namespace Autotube.DTOs.All_in_One.Script;

public class ScriptStats
{
    [JsonPropertyName("total_words")]
    public int TotalWords { get; set; }

    [JsonPropertyName("duration")]
    public string Duration { get; set; } = string.Empty;

    [JsonPropertyName("readability")]
    public string Readability { get; set; } = string.Empty;

    [JsonPropertyName("hook_strength")]
    public string HookStrength { get; set; } = string.Empty;
}