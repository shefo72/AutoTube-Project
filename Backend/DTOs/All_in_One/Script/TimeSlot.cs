using System.Text.Json.Serialization;

namespace Autotube.DTOs.All_in_One.Script;

public class TimeSlot
{
    [JsonPropertyName("duration_range")]
    public string DurationRange { get; set; } = string.Empty;

    [JsonPropertyName("visual_prompt")]
    public string VisualPrompt { get; set; } = string.Empty;

    [JsonPropertyName("voiceover")]
    public string Voiceover { get; set; } = string.Empty;

    [JsonPropertyName("on_screen_text")]
    public string OnScreenText { get; set; } = string.Empty;

    [JsonPropertyName("sound_effects")]
    public string SoundEffects { get; set; } = string.Empty;
}