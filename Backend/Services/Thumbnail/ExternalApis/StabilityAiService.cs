using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;

namespace Autotube.Services.Thumbnail.ExternalApis
{

    public class StabilityAiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<StabilityAiService> _logger;

        private const string EngineId = "stable-diffusion-xl-1024-v1-0";

        public StabilityAiService(IHttpClientFactory httpClientFactory,
                                  IConfiguration config,
                                  ILogger<StabilityAiService> logger)
        {
            _httpClient = httpClientFactory.CreateClient("StabilityAI");
            _logger = logger;

            var apiKey = config["StabilityAI:ApiKey"]
                ?? throw new InvalidOperationException("StabilityAI:ApiKey is missing from configuration.");

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task<string> GenerateImageBase64Async(string prompt)
        {
            _logger.LogInformation("Sending prompt to Stability AI: {Prompt}", prompt);

            var url = $"https://api.stability.ai/v1/generation/{EngineId}/text-to-image";

            // Build the request body following Stability AI's JSON format
            var requestBody = new
            {
                text_prompts = new[]
                {
                    new { text = prompt, weight = 1.0 }
                },
                cfg_scale = 7,
                width = 1344,
                height = 768,
                steps = 30,
                samples = 1
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);

            // If the request failed throw a clear message
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"Stability AI request failed ({(int)response.StatusCode}): {errorBody}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);

            // Stability AI returns an array of artifacts.
            var artifacts = doc.RootElement.GetProperty("artifacts");
            var firstArtifact = artifacts[0];

            var finishReason = firstArtifact.GetProperty("finishReason").GetString();
            if (finishReason == "ERROR")
                throw new Exception("Stability AI returned an error artifact.");

            var base64 = firstArtifact.GetProperty("base64").GetString()
                ?? throw new Exception("Stability AI returned no base64 image data.");

            _logger.LogInformation("Stability AI generation succeeded.");
            return base64;
        }
    }
}
