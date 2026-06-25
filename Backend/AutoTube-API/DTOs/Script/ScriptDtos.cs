using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Autotube.DTOs.Script
{
    public class ScriptRequest
    {
        public int UserId { get; set; } 
        public string? Topic { get; set; }
        public required string Tone { get; set; }
        public required string Length { get; set; }
        public string? VideoType { get; set; }
    }

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

    public class ScriptSection
    {
        [JsonPropertyName("visual_prompt")]
        public string VisualPrompt { get; set; } = string.Empty;

        [JsonPropertyName("voiceover")]
        public string Voiceover { get; set; } = string.Empty;

        [JsonPropertyName("on_screen_text")]
        public string OnScreenText { get; set; } = string.Empty;

        [JsonPropertyName("sound_effects")]
        public string SoundEffects { get; set; } = string.Empty;

        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;

        [JsonPropertyName("time_range")]
        public string TimeRange { get; set; } = string.Empty;
    }

    public class ScriptResponse
    {
        [JsonPropertyName("video_type")]
        public string VideoType { get; set; } = "shorts";

        [JsonPropertyName("description_data")]
        public YouTubeDescriptionData DescriptionData { get; set; } = new();

        [JsonPropertyName("hook")]
        public ScriptSection Hook { get; set; } = new();

        [JsonPropertyName("introduction")]
        public ScriptSection Introduction { get; set; } = new();

        [JsonPropertyName("main_content")]
        public ScriptSection MainContent { get; set; } = new();

        [JsonPropertyName("cta_outro")]
        public ScriptSection CtaOutro { get; set; } = new();

        [JsonPropertyName("stats")]
        public ScriptStats Stats { get; set; } = new();
    }

    public class YouTubeDescription
    {
        [JsonPropertyName("description_data")]
        public YouTubeDescriptionData DescriptionData { get; set; } = new();

        [JsonPropertyName("hook_and_intro")]
        public YouTubeMainSection HookAndIntro { get; set; } = new();

        [JsonPropertyName("main_content")]
        public List<YouTubeMainSection> MainContent { get; set; } = new();

        [JsonPropertyName("cta_outro")]
        public YouTubeMainSection CtaOutro { get; set; } = new();

        [JsonPropertyName("stats")]
        public ScriptStats Stats { get; set; } = new();
    }

    public class YouTubeDescriptionData
    {
        [JsonPropertyName("video_description")]
        public string VideoDescription { get; set; } = string.Empty;

        [JsonPropertyName("top_5_hook_sentences")]
        public List<string> Top5HookSentences { get; set; } = new();
    }

    public class YouTubeMainSection
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("presenter_speech")]
        public string PresenterSpeech { get; set; } = string.Empty;

        [JsonPropertyName("actions_and_visuals")]
        public string ActionsAndVisuals { get; set; } = string.Empty;
    }

    public class YouTubeLongResponse
    {
        [JsonPropertyName("video_type")]
        public string VideoType { get; set; } = "youtube_long";

        [JsonPropertyName("description_data")]
        public YouTubeDescriptionData DescriptionData { get; set; } = new();

        [JsonPropertyName("hook_and_intro")]
        public YouTubeMainSection HookAndIntro { get; set; } = new();

        [JsonPropertyName("main_content")]
        public List<YouTubeMainSection> MainContent { get; set; } = new();

        [JsonPropertyName("cta_outro")]
        public YouTubeMainSection CtaOutro { get; set; } = new();

        [JsonPropertyName("stats")]
        public ScriptStats Stats { get; set; } = new();
    }

    internal class GeminiScriptJson
    {
        [JsonPropertyName("descriptionData")]
        public GeminiDescriptionData DescriptionData { get; set; } = new();

        [JsonPropertyName("hook")]
        public ScriptSection Hook { get; set; } = new();

        [JsonPropertyName("introduction")]
        public ScriptSection Introduction { get; set; } = new();

        [JsonPropertyName("mainContent")]
        public ScriptSection MainContent { get; set; } = new();

        [JsonPropertyName("cta")]
        public ScriptSection Cta { get; set; } = new();

        [JsonPropertyName("readability")]
        public string Readability { get; set; } = string.Empty;

        [JsonPropertyName("hook_strength")]
        public string Hook_Strength { get; set; } = string.Empty;

        [JsonPropertyName("videoType")]
        public string VideoType { get; set; } = string.Empty;
    }

    internal class GeminiLongScriptJson
    {
        [JsonPropertyName("descriptionData")]
        public GeminiDescriptionData DescriptionData { get; set; } = new();

        [JsonPropertyName("hookAndIntro")]
        public GeminiSection HookAndIntro { get; set; } = new();

        [JsonPropertyName("mainContent")]
        public List<GeminiMainSection> MainContent { get; set; } = new();

        [JsonPropertyName("ctaOutro")]
        public GeminiSection CtaOutro { get; set; } = new();

        [JsonPropertyName("readability")]
        public string Readability { get; set; } = string.Empty;

        [JsonPropertyName("hook_strength")]
        public string Hook_Strength { get; set; } = string.Empty;

        [JsonPropertyName("videoType")]
        public string VideoType { get; set; } = string.Empty;
    }

    internal class GeminiDescriptionData
    {
        [JsonPropertyName("videoDescription")]
        public string VideoDescription { get; set; } = string.Empty;

        [JsonPropertyName("top5HookSentences")]
        public List<string> Top5HookSentences { get; set; } = new();
    }

    internal class GeminiSection
    {
        [JsonPropertyName("presenterSpeech")]
        public string PresenterSpeech { get; set; } = string.Empty;

        [JsonPropertyName("actionsAndVisuals")]
        public string ActionsAndVisuals { get; set; } = string.Empty;
    }

    internal class GeminiMainSection
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("presenterSpeech")]
        public string PresenterSpeech { get; set; } = string.Empty;

        [JsonPropertyName("actionsAndVisuals")]
        public string ActionsAndVisuals { get; set; } = string.Empty;
    }

    public class GeminiApiRequest
    {
        [JsonPropertyName("contents")]
        public GeminiContent[] Contents { get; set; } = Array.Empty<GeminiContent>();

        [JsonPropertyName("generation_config")]
        public GeminiGenerationConfig GenerationConfig { get; set; } = new();
    }

    public class GeminiContent
    {
        [JsonPropertyName("parts")]
        public GeminiPart[] Parts { get; set; } = Array.Empty<GeminiPart>();
    }

    public class GeminiPart
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }

    public class GeminiGenerationConfig
    {
        [JsonPropertyName("temperature")]
        public double Temperature { get; set; }

        [JsonPropertyName("maxOutputTokens")]
        public int MaxOutputTokens { get; set; }

        [JsonPropertyName("responseMimeType")]
        public string ResponseMimeType { get; set; } = string.Empty;
    }

    //public class ScriptHistoryEntity
    //{
    //    public int Id { get; set; }
    //    public required string Topic { get; set; }
    //    public required string RawJson { get; set; }
    //    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    //    public int? GapReportId { get; set; }
    //    public string UserId { get; set; } = string.Empty;
    //}
   
}

