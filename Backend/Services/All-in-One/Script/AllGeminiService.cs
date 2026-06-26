using Autotube.DTOs.All_in_One.Script;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Autotube.Services.All_in_One.Script
{
    public class AllGeminiService : IAllGeminiService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;
        private readonly ILogger<AllGeminiService> _logger;
        private const string BaseUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

        public AllGeminiService(HttpClient http, IConfiguration config, ILogger<AllGeminiService> logger)
        {
            _http = http;
            _config = config;
            _logger = logger;
            _http.Timeout = TimeSpan.FromSeconds(60);
        }

        public async Task<ScriptResponse> GenerateScriptAsync(AllScriptRequest request)
        {
            var apiKey = _config["Gemini1:ApiKey"] ?? throw new InvalidOperationException("Missing API key");

            var prompt = BuildPrompt(request);

            var requestBody = new
            {
                contents = new[] { new { parts = new[] { new { text = prompt } } } },
                generationConfig = new { temperature = 0.4, maxOutputTokens = 8192 }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _http.PostAsync($"{BaseUrl}?key={apiKey}", content);
            var responseJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode) throw new Exception($"Gemini API Error: {responseJson}");

            var rawText = ExtractTextFromGeminiResponse(responseJson);
            var parsed = ParseScriptJson(rawText);
            var result = BuildScriptResponse(parsed, request);

            return result;
        }

        private string BuildPrompt(AllScriptRequest request)
        {
            return $$$"""
    You are an expert AI Video Producer. 
    Create a short-form YouTube video script about: "{{{request.Prompt}}}".

    Voice Tone: {{{request.VoiceTone}}}.
    Video Style: {{{request.VideoStyle}}}.
    
    CRITICAL RULES:
    1. COMPLETENESS: Do NOT leave ANY field empty (visual_prompt, voiceover, etc.). Fill every section with meaningful content.
    2. TIME LIMIT: 15 seconds (fixed for all videos).
    3. STRUCTURE: Provide 5 hooks and 3+ hashtags in the description.
    4. VALID JSON: Return only raw JSON. Do not include any conversational text.
    5. TIME RANGES: For every 'time_slot', the 'duration_range' MUST be a string (e.g., "0-3s"). 
    6. DYNAMIC CALCULATION: You MUST calculate the time ranges dynamically based on 15s. 
       - The timeline must start at 0s and end exactly at 15s.
       - Ensure a logical sequential flow where the end of one 'duration_range' IS the start of the next (e.g., if one ends at 3s, the next must start at 3s).
    7. READABILITY: Analyze the text you wrote and pick ONE word only from this list: ["Premium", "High", "Medium", "Low"].
    8. DURATION STAT: The 'duration' field in the 'stats' object MUST be a single value string representing the total target duration (e.g., "15s") and NOT a range.
    9. CALCULATION: You MUST dynamically calculate 'total_words' (as a raw number) and 'hook_strength' (as a string in the format "0/100").
    
    IMPORTANT: Every section (hook, introduction, main_content, cta_outro) MUST contain at least one non-empty time_slot. If you leave a field empty, the output is considered invalid.    
    JSON Template:
    {
      "smart_description": "...",
      "top_hooks": ["...", "...", "...", "...", "..."],
      "hook": {"section_name": "Hook", "time_slots": [{"duration_range": "1-3s", "visual_prompt": "...", "voiceover": "...", "on_screen_text": "...", "sound_effects": "..."}]},
      "introduction": {"section_name": "Intro", "time_slots": [{"duration_range": "2-4s", "visual_prompt": "...", "voiceover": "...", "on_screen_text": "...", "sound_effects": "..."}]},
      "main_content": {"section_name": "Main", "time_slots": [{"duration_range": "3-6s", "visual_prompt": "...", "voiceover": "...", "on_screen_text": "...", "sound_effects": "..."}]},
      "cta_outro": {"section_name": "Outro", "time_slots": [{"duration_range": "2-4s", "visual_prompt": "...", "voiceover": "...", "on_screen_text": "...", "sound_effects": "..."}]},
      "stats": {
          "total_words": 0, 
          "duration": "15s", 
          "readability": "CALCULATE", 
          "hook_strength": "0/100"
      }
    }
    """;
        }
        private GeminiScriptJson ParseScriptJson(string rawText)
        {
            var cleanedJson = rawText.Replace("```json", "").Replace("```", "").Trim();

            while (cleanedJson.Count(c => c == '{') > cleanedJson.Count(c => c == '}')) cleanedJson += "}";
            while (cleanedJson.Count(c => c == '[') > cleanedJson.Count(c => c == ']')) cleanedJson += "]";

            return JsonSerializer.Deserialize<GeminiScriptJson>(cleanedJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                AllowTrailingCommas = true
            }) ?? throw new Exception("Failed to deserialize Gemini response");
        }

        private ScriptResponse BuildScriptResponse(GeminiScriptJson src, AllScriptRequest request)
        {
            int totalWords = 0;
            var allSections = new List<ScriptSection> { src.Hook, src.Introduction, src.MainContent, src.CtaOutro };
            foreach (var section in allSections)
            {
                if (section?.TimeSlots != null)
                {
                    foreach (var slot in section.TimeSlots)
                    {
                        if (!string.IsNullOrEmpty(slot.Voiceover))
                            totalWords += slot.Voiceover.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
                    }
                }
            }

            return new ScriptResponse
            {
                SmartDescription = src.SmartDescription,
                TopHooks = src.TopHooks,
                Hook = src.Hook,
                Introduction = src.Introduction,
                MainContent = src.MainContent,
                CtaOutro = src.CtaOutro,
                Stats = new ScriptStats
                {
                    TotalWords = totalWords,
                    Duration = src.Stats.Duration,
                    Readability = src.Stats.Readability,
                    HookStrength = src.Stats.HookStrength
                }
            };
        }

        private string ExtractTextFromGeminiResponse(string responseJson)
        {
            var node = JsonNode.Parse(responseJson);
            return node?["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.GetValue<string>()
                    ?? throw new Exception("Empty response from Gemini");
        }
    }
}
