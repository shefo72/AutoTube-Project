using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Autotube.Models;
using System.Linq;
using Autotube.DTOs.Script;


namespace Autotube.Services.Script
{
    public interface IGeminiService
    {
        Task<object> GenerateScriptAsync(ScriptRequest request, string? recommendations = null);
    }

    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;
        private readonly ILogger<GeminiService> _logger;

        private const string BaseUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

        public GeminiService(HttpClient http, IConfiguration config, ILogger<GeminiService> logger)
        {
            _http = http;
            _config = config;
            _logger = logger;
        }
        public async Task<object> GenerateScriptAsync(ScriptRequest request, string? recommendations = null)
        {
            int maxRetryAttempts = 1;
            int delayMilliseconds = 3000;

            for (int attempt = 1; attempt <= maxRetryAttempts; attempt++)
            {
                try
                {
                    var apiKeys = new[]
                    {
                        _config["Gemini:ApiKey"],
                        _config["Gemini:ApiKey2"],
                        _config["Gemini:ApiKey3"]
                    }
                    .Where(k => !string.IsNullOrWhiteSpace(k))
                    .ToArray();

                    if (!apiKeys.Any())
                    {
                        throw new InvalidOperationException("No Gemini API keys configured.");
                    }

                    var (minSec, maxSec) = GetDurationRange(request.Length ?? "", request.VideoType ?? ""); var prompt = BuildPrompt(request, recommendations, minSec, maxSec);
                    _logger.LogWarning(
                       "🚨 THE ACTUAL PROMPT SENT TO GEMINI (Attempt {attempt}): {prompt}",
                       attempt, prompt);

                    var requestBody = new Dictionary<string, object>
                    {
                        { "contents", new[]
                            {
                                new Dictionary<string, object>
                                {
                                    { "parts", new[] { new { text = prompt } } }
                                }
                            }
                        },
                        { "generation_config", new Dictionary<string, object>
                            {
                                { "temperature", 0.7 },
                                { "max_output_tokens", 8192 }
                            }
                        }
                    };

                    var jsonOptions = new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = null
                    };

                    var json = JsonSerializer.Serialize(requestBody, jsonOptions);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    HttpResponseMessage? response = null;
                    string responseJson = "";

                    // ================= CALL GEMINI =================
                    foreach (var apiKey in apiKeys)
                    {
                        response = await _http.PostAsync($"{BaseUrl}?key={apiKey}", content);
                        responseJson = await response.Content.ReadAsStringAsync();

                        if (response.IsSuccessStatusCode)
                            break;

                        if (response.StatusCode == HttpStatusCode.TooManyRequests ||
                            response.StatusCode == HttpStatusCode.ServiceUnavailable)
                        {
                            _logger.LogWarning(
                                "API Key failed: {status}. Trying next key...",
                                response.StatusCode);
                            continue;
                        }

                        _logger.LogError(
                            "Google API Error: {status} - {body}",
                            response.StatusCode, responseJson);

                        throw new Exception($"Gemini API Error ({response.StatusCode}): {responseJson}");
                    }

                    if (response == null || !response.IsSuccessStatusCode)
                    {
                        throw new Exception("All Gemini API keys failed or exceeded quota.");
                    }

                    if (response.StatusCode == HttpStatusCode.ServiceUnavailable &&
                        attempt < maxRetryAttempts)
                    {
                        _logger.LogWarning(
                            "⚠️ Gemini Service Unavailable (503). Retrying {attempt}/{max}",
                            attempt, maxRetryAttempts);

                        await Task.Delay(delayMilliseconds);
                        continue;
                    }

                    _logger.LogInformation("STEP 1: API Request Sent OK");

                    var rawText = ExtractTextFromGeminiResponse(responseJson);

                    _logger.LogInformation("STEP 2: RAW TEXT EXTRACTED");

                    if (request.VideoType?.ToLower() == "youtube_long")
                    {
                        var parsedLong = ParseLongScriptJson(rawText);
                        var resultLong = BuildLongScriptResponse(parsedLong, request);

                        _logger.LogInformation("STEP 3: LONG RESPONSE BUILT");
                        return resultLong;
                    }
                    else
                    {
                        var parsedShort = ParseScriptJson(rawText);
                        var resultShort = BuildScriptResponse(parsedShort, request);

                        _logger.LogInformation("STEP 3: SHORT RESPONSE BUILT");
                        return resultShort;
                    }
                }
                catch (Exception ex) when (attempt < maxRetryAttempts)
                {
                    _logger.LogWarning(
                        ex,
                        "⚠️ Attempt {attempt} failed. Retrying...",
                        attempt);

                    await Task.Delay(delayMilliseconds);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex,
                        "🔥 FULL ERROR IN GENERATE SCRIPT SERVICE");

                    throw;
                }
            }

            throw new Exception("Gemini Service Unavailable after retries.");
        }
        private (int min, int max) GetDurationRange(string length, string videoType)
        {
            var normalizedLength = length?.ToLower() ?? "";

            if (normalizedLength.Contains("short")) return (5, 15);
            if (normalizedLength.Contains("medium")) return (60, 420);
            if (normalizedLength.Contains("long")) return (420, 1200);

            return (60, 420);
        }
        private string BuildPrompt(ScriptRequest request, string? recommendations, int minSec, int maxSec)
        {
            string toneInstruction = request.Tone?.ToLower() switch
            {
                "conversational" => "in a friendly, casual, and conversational YouTube blogger style.",
                "professional" => "in a polished, authoritative, and expert educational manner.",
                "educational" => "with a clear, informative, step-by-step masterclass approach.",
                "entertaining" => "with high energy, expressive personality, storytelling humor, and fast pacing.",
                "inspirational" => "with deep passion, premium motivational feel, and an uplifting tone.",
                _ => "in a natural and engaging YouTube presenter voice"
            };

            string analysisContext = !string.IsNullOrWhiteSpace(recommendations)
            ? $@"
        DATA FROM VIDEO ANALYSIS (Use this to optimize the script):
        - Key Insights/Recommendations: {recommendations}"
            : "";

            if (request.VideoType?.ToLower() == "youtube_long")
            {
                return $$$"""
You are an expert YouTube Content Creator and Scriptwriter. Your task is to write a comprehensive, full-length YouTube video script for a human presenter (YouTuber), including their body language, camera actions, and B-roll descriptions.
{{{analysisContext}}}

CRITICAL REQUIREMENTS:
1. Presenter Tone: The YouTuber's speech MUST be written {{{toneInstruction}}}.
2. Length: The entire spoken script must fit the requested duration of {{{request.Length}}}. Write extensive, rich dialogues (No placeholders or summaries).
3. Duration Control (MATH RULE): 
   - You MUST calculate the total word count before writing.
   - Formula: (Requested Duration in Minutes * 130) = Required Total Word Count.
   - Example: If request is 7 minutes, you MUST write exactly 910 words (±50).
   - Do NOT write summaries or placeholders. Every second must be filled with rich, extensive dialogue.
   4. Content Focus: Strictly discuss ONLY the requested topic: "{{{request.Topic}}}". Do NOT mention software engineering or unrelated tech unless explicitly asked.

You MUST return the response strictly in valid JSON format matching this exact schema:
{
  "descriptionData": {
    "videoDescription": "An engaging, click-worthy, SEO-optimized description text to be pasted under the video.",
    "top5HookSentences": [
      "Extremely catchy sentence 1 for description/pinned comment to hook viewers",
      "Extremely catchy sentence 2",
      "Extremely catchy sentence 3",
      "Extremely catchy sentence 4",
      "Extremely catchy sentence 5"
    ]
  },
  "hookAndIntro": {
    "presenterSpeech": "The exact extensive script for the YouTuber to say during the first 30-60 seconds (Hooking the audience and introducing the topic).",
    "actionsAndVisuals": "YouTuber's body language cues, facial expressions, camera angles, and text pop-up overlays."
  },
  "mainContent": [
    {
      "title": "Chapter 1: [Catchy Subtopic Title]",
      "presenterSpeech": "Detailed, extensive masterclass explanation spoken by the YouTuber for part 1.",
      "actionsAndVisuals": "B-roll clips, screen recordings, live demos, and camera movement descriptions for part 1."
    }
  ],
  "ctaOutro": {
    "presenterSpeech": "The YouTuber's natural final words, asking to like/subscribe, comment down below, and previewing what's next.",
    "actionsAndVisuals": "End-screen graphics templates layout, subscribe animations showing up, background music swelling."
  },
  "stats": {
    "total_words": "Calculate the total word count of the script.",
    "duration": "Calculate the exact duration of the full script in 'mm:ss' format based on a speaking rate of 130 words per minute.",
    "readability": "Assess the script's readability and return ONLY one of these values: 'High', 'Medium', or 'Low'.",
    "hook_strength": "Calculate the hook's effectiveness and return as a string score in this format: 'X/100' (e.g., '90/100')."
  },
  "videoType": "Return exactly 'long' as this is a long video script."
}

Rules:
- Output ONLY the raw JSON object. Do not wrap it in markdown blocks like ```json.
- All JSON property names MUST exactly match the casing provided in the template schema.
""";
            }

            return $$$"""
You are an expert AI Video Producer and Director. Instead of writing traditional scripts for human presenters, you write highly detailed "AI Video Generation Prompts" and production blueprints for commercial videos.
{{{analysisContext}}}

CRITICAL REQUIREMENTS:
1. Tone: The voiceover text MUST be written {{{toneInstruction}}}.
2. Length: The script MUST strictly fit the requested duration of {{{request.Length}}}.
2. Duration Control (MATH RULE): 
   - Speaking rate is 130 words per minute (~2.2 words per second).
   - If duration is 15 seconds, write exactly 33 words. 
   - If duration is 5 seconds, write exactly 11 words.
   - Do NOT exceed the requested duration.
   4. Content: Strictly discuss ONLY the requested topic: "{{{request.Topic}}}".

You MUST return the response strictly in valid JSON format matching this exact schema:
{
  "descriptionData": {
    "videoDescription": "Write an engaging, SEO-optimized YouTube Shorts description with relevant hashtags",
    "top5HookSentences": [
      "Alternative Catchy Hook 1",
      "Alternative Catchy Hook 2",
      "Alternative Catchy Hook 3",
      "Alternative Catchy Hook 4",
      "Alternative Catchy Hook 5"
    ]
  },
  "hook": {
    "visual_prompt": "Highly detailed visual description, lighting, and camera movement for AI video generators (e.g., Sora, Runway)",
    "voiceover": "The exact spoken text to be generated by Text-to-Speech AI",
    "on_screen_text": "Bold text overlay that appears on the video screen",
    "sound_effects": "Specific audio cues, ambient sounds, and music shifts"
  },
  "introduction": {
    "visual_prompt": "Highly detailed visual prompt for the next shot/scene transition",
    "voiceover": "The exact spoken text for the introduction",
    "on_screen_text": "Text overlay for this section",
    "sound_effects": "Sound effects and music behavior"
  },
  "mainContent": {
    "visual_prompt": "Cinematic visual details explaining the core concept/product",
    "voiceover": "The main content spoken text",
    "on_screen_text": "Key words to display on screen",
    "sound_effects": "Background music and audio transitions"
  },
  "cta": {
    "visual_prompt": "Final clean shot showing product/branding and the call to action",
    "voiceover": "The closing voiceover text",
    "on_screen_text": "Final CTA text",
    "sound_effects": "Ending sound effect and music fade out"
  },
  "stats": {
    "total_words": "Calculate the total word count of the script.",
"duration": "Calculate the duration in 'mm:ss' format (e.g., '00:10'). Do NOT use decimals, do NOT use milliseconds, and do NOT use single digits for seconds (e.g., use '00:05' instead of '0:5')."}    "readability": "Assess the script's readability and return ONLY one of these values: 'High', 'Medium', or 'Low'.",
    "hook_strength": "Calculate the hook's effectiveness and return as a string score in this format: 'X/100' (e.g., '90/100')."
  },
  "videoType": "Return exactly 'shorts' as this is a short video script."
}

Rules:
- Output ONLY the raw JSON object. Do not wrap it in markdown blocks like ```json.
- All JSON property names MUST exactly match the casing provided in the template schema.
- DURATION RULE: The 'duration' field MUST be in 'mm:ss' format (e.g., '00:05').
- DURATION CONSTRAINT: Duration MUST be strictly between '00:01' and '00:15'.
- NO MILLISECONDS: Do not return milliseconds, decimals, or more than two digits for seconds.
""";
        }
        private string CleanJson(string rawText)
        {
            int startIndex = rawText.IndexOf("{");
            int endIndex = rawText.LastIndexOf("}");

            // إذا لم نجد أقواس، لا نرجع النص كما هو، بل نرجع سلسلة فارغة ليتم التقاط الخطأ بوضوح
            if (startIndex == -1 || endIndex == -1 || endIndex <= startIndex)
            {
                return "{}"; // إرجاع كائن فارغ لتجنب الانهيار المفاجئ، أو يمكن إلقاء استثناء خاص
            }

            return rawText.Substring(startIndex, endIndex - startIndex + 1);
        }
        private string ExtractTextFromGeminiResponse(string responseJson)
        {
            try
            {
                var node = JsonNode.Parse(responseJson);
                var text = node?["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.GetValue<string>();

                if (string.IsNullOrWhiteSpace(text))
                    throw new Exception("Empty response from Gemini.");

                return text;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to extract text from Gemini response json");
                throw;
            }
        }

        private GeminiScriptJson ParseScriptJson(string rawText)
        {
            rawText = CleanMarkdown(rawText);
            rawText = CleanJson(rawText);
            try
            {
                return JsonSerializer.Deserialize<GeminiScriptJson>(rawText, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                       ?? throw new Exception("Shorts Deserialization returned null.");
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "🔥 Shorts JSON Parsing Crash. Text: {rawText}", rawText);
                throw;
            }
        }

        private GeminiLongScriptJson ParseLongScriptJson(string rawText)
        {
            rawText = CleanMarkdown(rawText);
            rawText = CleanJson(rawText);
            try
            {
                return JsonSerializer.Deserialize<GeminiLongScriptJson>(rawText, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                       ?? throw new Exception("YouTube Long Deserialization returned null.");
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "🔥 YouTube Long JSON Parsing Crash. Text: {rawText}", rawText);
                throw;
            }
        }

        private string CleanMarkdown(string text)
        {
            text = text.Trim();
            if (text.StartsWith("```json")) text = text.Substring(7).Trim();
            else if (text.StartsWith("```")) text = text.Substring(3).Trim();
            if (text.EndsWith("```")) text = text.Substring(0, text.Length - 3).Trim();
            return text;
        }
        private ScriptResponse BuildScriptResponse(GeminiScriptJson src, ScriptRequest request)
        {
            var text = $"{src.Hook?.Voiceover} {src.Introduction?.Voiceover} {src.MainContent?.Voiceover} {src.Cta?.Voiceover}";
            var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
            var (minSec, maxSec) = GetDurationRange(request.Length ?? "", request.VideoType ?? "");
            int durationSec = Random.Shared.Next(minSec, maxSec + 1);
            int estimatedSpeechSeconds = (int)Math.Ceiling(words / 2.3);
            if (estimatedSpeechSeconds > minSec && estimatedSpeechSeconds <= maxSec) durationSec = estimatedSpeechSeconds;

            string formattedDuration = $"0:{durationSec:D2}";

            return new ScriptResponse
            {
                VideoType = "shorts",

                DescriptionData = src.DescriptionData != null ? new YouTubeDescriptionData
                {
                    VideoDescription = src.DescriptionData.VideoDescription,
                    Top5HookSentences = src.DescriptionData.Top5HookSentences
                } : new(),

                Hook = src.Hook ?? new(),
                Introduction = src.Introduction ?? new(),
                MainContent = src.MainContent ?? new(),
                CtaOutro = src.Cta ?? new(),
                Stats = new ScriptStats
                {
                    TotalWords = words,
                    Duration = formattedDuration,
                    Readability = !string.IsNullOrWhiteSpace(src.Readability) ? src.Readability : "High",
                    HookStrength = !string.IsNullOrWhiteSpace(src.Hook_Strength) ? src.Hook_Strength : "90/100"
                }
            };
        }
        private YouTubeLongResponse BuildLongScriptResponse(GeminiLongScriptJson src, ScriptRequest request)
        {
            var sb = new StringBuilder();
            sb.Append(src.HookAndIntro?.PresenterSpeech ?? "");
            sb.Append(" ");
            if (src.MainContent != null)
            {
                foreach (var section in src.MainContent)
                {
                    sb.Append(section.PresenterSpeech ?? "");
                    sb.Append(" ");
                }
            }
            sb.Append(src.CtaOutro?.PresenterSpeech ?? "");

            var words = sb.ToString().Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
            var (minSec, maxSec) = GetDurationRange(request.Length ?? "", request.VideoType ?? "");
            int durationSec = (int)Math.Ceiling(words / 2.5);
            if (durationSec < minSec) durationSec = minSec + Random.Shared.Next(10, 40);
            if (durationSec > maxSec) durationSec = maxSec;

            int minutes = durationSec / 60;
            int seconds = durationSec % 60;

            string formattedDuration = $"{minutes}:{seconds:D2}";

            return new YouTubeLongResponse
            {
                VideoType = "youtube_long",

                DescriptionData = src.DescriptionData != null ? new YouTubeDescriptionData
                {
                    VideoDescription = src.DescriptionData.VideoDescription,
                    Top5HookSentences = src.DescriptionData.Top5HookSentences
                } : new(),

                HookAndIntro = src.HookAndIntro != null ? new YouTubeMainSection
                {
                    PresenterSpeech = src.HookAndIntro.PresenterSpeech,
                    ActionsAndVisuals = src.HookAndIntro.ActionsAndVisuals
                } : new(),

                MainContent = src.MainContent?.ConvertAll(x => new YouTubeMainSection
                {
                    Title = x.Title,
                    PresenterSpeech = x.PresenterSpeech,
                    ActionsAndVisuals = x.ActionsAndVisuals
                }) ?? new List<YouTubeMainSection>(),

                CtaOutro = src.CtaOutro != null ? new YouTubeMainSection
                {
                    PresenterSpeech = src.CtaOutro.PresenterSpeech,
                    ActionsAndVisuals = src.CtaOutro.ActionsAndVisuals
                } : new(),

                Stats = new ScriptStats
                {
                    TotalWords = words,
                    Duration = formattedDuration,
                    Readability = !string.IsNullOrWhiteSpace(src.Readability) ? src.Readability : "High",
                    HookStrength = !string.IsNullOrWhiteSpace(src.Hook_Strength) ? src.Hook_Strength : "93/100"
                }
            };
        }
    }

}