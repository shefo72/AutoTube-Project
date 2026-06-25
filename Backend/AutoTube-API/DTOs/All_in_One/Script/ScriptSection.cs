using System.Text.Json.Serialization;

namespace Autotube.DTOs.All_in_One.Script;

public class ScriptSection
{
    [JsonPropertyName("section_name")]
    public string SectionName { get; set; } = string.Empty;

    [JsonPropertyName("time_slots")]
    public List<TimeSlot> TimeSlots { get; set; } = new();
}