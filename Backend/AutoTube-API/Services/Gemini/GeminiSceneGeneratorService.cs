using System.Text.Json;
using System.Net.Http.Json;
using AutoTubeAPI.DTOs.VideoGeneration;

namespace AutoTubeAPI.Services.Gemini
{
    public class GeminiSceneGeneratorService : ISceneGeneratorService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        private const string ModelUrl =
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

        public GeminiSceneGeneratorService(
            IConfiguration config,
            HttpClient httpClient)
        {
            _httpClient = httpClient;
            _apiKey = config["Gemini:ApiKey"]
                ?? throw new Exception("Gemini API key missing");
        }

        public async Task<List<SceneDto>> GenerateScenesAsync(
            string enhancedPrompt,
            int totalDurationSeconds)
        {
            if (totalDurationSeconds <= 15)
                throw new Exception("Scenes require > 15 seconds");

            int scene1;
            int scene2;

            switch (totalDurationSeconds)
            {
                case 20:
                    scene1 = 10;
                    scene2 = 10;
                    break;

                case 25:
                    scene1 = 12;
                    scene2 = 13;
                    break;

                case 30:
                    scene1 = 15;
                    scene2 = 15;
                    break;

                default:
                    scene1 = totalDurationSeconds / 2;
                    scene2 = totalDurationSeconds - scene1;
                    break;
            }

            var prompt = $@"
You are a professional AI video continuity director.

Your task is to generate TWO AI video prompts that will later be rendered separately and merged into a single seamless video.

IMPORTANT:

The biggest failure in AI video generation is character inconsistency.

The same person must appear in both scenes.

The same environment must appear in both scenes.

The same camera setup must appear in both scenes.

==================================================
CHARACTER LOCK
==================================================

Create ONE unique protagonist.

If the user specifies a character, preserve it exactly.

If not, invent a highly distinctive character.

The character description must include:

- gender
- age
- ethnicity
- skin tone
- face shape
- eye color
- hair color
- hairstyle
- body type
- clothing
- accessories

Copy this character description IDENTICALLY into BOTH prompts.

Do not change:

- face
- hair
- clothes
- accessories
- age
- ethnicity
- body type

==================================================
IDENTITY HASH LOCK (CRITICAL)
==================================================

After generating Scene 1, you MUST copy the following fields EXACTLY into Scene 2:

- entire character paragraph
- entire environment paragraph
- entire camera paragraph
- entire lighting paragraph

DO NOT REWRITE ANY OF THESE FIELDS.

ONLY append new motion continuation at the end of Scene 2.

Scene 2 is NOT a new description.

Scene 2 is ONLY a continuation sentence appended to Scene 1 structure.

==================================================
ENVIRONMENT LOCK
==================================================

Create ONE environment.

Copy the environment description IDENTICALLY into BOTH prompts.

Do not change:

- location
- weather
- lighting
- atmosphere
- background
- color palette

==================================================
CAMERA LOCK
==================================================

Copy IDENTICALLY:

- lens
- framing
- camera height
- camera movement
- camera style
- depth of field

==================================================
CONTINUITY RULE
==================================================

The two clips must feel like adjacent moments of the same recording.

Scene 2 must continue directly from Scene 1.

Do not restart the action.

Do not reintroduce the character.

Do not describe a new shot.

==================================================
ACTION BRIDGE
==================================================

Choose ONE continuous action.

Examples:

- walking
- reaching
- turning head
- camera push forward
- examining object
- opening door

Scene 1:
action already in progress

Scene 2:
continues from the exact state where Scene 1 ended

==================================================
PROMPT STYLE
==================================================

Write highly detailed cinematic AI-video prompts.

Each prompt should include:

- character
- clothing
- environment
- lighting
- camera
- lens
- atmosphere
- action

The first 90% of Scene 2 must be copied from Scene 1 with identical wording.

Reuse the exact same:

- character description
- clothing description
- environment description
- lighting description
- camera description
- atmosphere description

Only the final action section may change.

Same exact person reference. Do not redesign character under any condition. 

The action section in Scene 2 must begin from the exact physical state where Scene 1 ends.

==================================================
BANNED WORDS
==================================================

suddenly
next
later
then
afterwards
meanwhile
cut to
new scene
begins
starts
transition

==================================================
VIDEO IDEA
==================================================

{enhancedPrompt}

==================================================
OUTPUT
==================================================

The response must be a valid JSON object that can be parsed directly by JsonSerializer.Deserialize().

Return ONLY valid JSON.

{{
  ""scenes"": [
    {{
      ""prompt"": ""..."",
      ""durationSeconds"": {scene1}
    }},
    {{
      ""prompt"": ""..."",
      ""durationSeconds"": {scene2}
    }}
  ]
}}
";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.2,
                    maxOutputTokens = 8192
                }
            };

            var url = $"{ModelUrl}?key={Uri.EscapeDataString(_apiKey)}";

            var response = await _httpClient.PostAsJsonAsync(url, requestBody);

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Gemini API Error: {json}");
            }

            using var doc = JsonDocument.Parse(json);

            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            Console.WriteLine("=== GEMINI RAW RESPONSE ===");
            Console.WriteLine(text);

            if (string.IsNullOrWhiteSpace(text))
                throw new Exception("Empty Gemini response");

            // CLEAN FIRST (IMPORTANT FIX)
            text = CleanJson(text);

            var result = JsonSerializer.Deserialize<GeminiResponse>(
                text,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            if (result?.Scenes == null || result.Scenes.Count != 2)
                throw new Exception("Invalid scene response from Gemini");

            return result.Scenes;
        }

        private static string CleanJson(string text)
        {
            text = text.Trim();

            if (text.StartsWith("```json"))
                text = text.Replace("```json", "").Replace("```", "").Trim();

            if (text.StartsWith("```"))
                text = text.Replace("```", "").Trim();

            if (text.EndsWith("```"))
                text = text.Replace("```", "").Trim();

            return text;
        }

        private class GeminiResponse
        {
            public List<SceneDto> Scenes { get; set; } = new();
        }
    }
}