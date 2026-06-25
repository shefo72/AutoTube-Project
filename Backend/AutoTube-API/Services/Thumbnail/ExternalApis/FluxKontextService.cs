using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Autotube.Services.Thumbnail.ExternalApis
{
    public class FluxKontextService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<FluxKontextService> _logger;

        private const string ModelVersion = "897a70f5a7dbd8a0611413b3b98cf417b45f266bd595c571a22947619d9ae462";

        public FluxKontextService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<FluxKontextService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        // Main method: sends image URL + prompt to Replicate, polls until done, returns generated image URL
        public async Task<string> GenerateThumbnailAsync(string imageUrl, string prompt)
        {
            var apiToken = _configuration["Flux:ApiKey"]
                ?? throw new InvalidOperationException("Replicate API token is not configured.");

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiToken}");
            client.DefaultRequestHeaders.Add("Prefer", "wait");

            // Create a prediction
            var predictionUrl = await CreatePredictionAsync(client, imageUrl, prompt);

            // Poll until the prediction is complete
            var generatedImageUrl = await PollForResultAsync(client, predictionUrl);

            return generatedImageUrl;
        }

        private async Task<string> CreatePredictionAsync(HttpClient client, string imageUrl, string prompt)
        {
            var requestBody = new
            {
                version = ModelVersion,
                input = new
                {
                    prompt,
                    input_image = imageUrl,
                    aspect_ratio = "16:9"     
                }
            };

            _logger.LogInformation("Sending request to Replicate for Flux Kontext Pro...");

            var response = await client.PostAsJsonAsync("https://api.replicate.com/v1/predictions", requestBody);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Replicate API error: {Error}", errorContent);
                throw new Exception($"Replicate API returned an error: {errorContent}");
            }

            var json = await response.Content.ReadAsStringAsync();
            var prediction = JsonSerializer.Deserialize<ReplicatePredictionResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (prediction?.Urls?.Get == null)
                throw new Exception("Replicate did not return a polling URL.");

            return prediction.Urls.Get;
        }

        private async Task<string> PollForResultAsync(HttpClient client, string pollingUrl)
        {
            const int maxAttempts = 30;
            const int delaySeconds = 3;

            for (int attempt = 1; attempt <= maxAttempts; attempt++)
            {
                _logger.LogInformation("Polling Replicate prediction (attempt {Attempt})...", attempt);

                var response = await client.GetAsync(pollingUrl);
                var json = await response.Content.ReadAsStringAsync();

                var prediction = JsonSerializer.Deserialize<ReplicatePredictionResponse>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (prediction == null)
                    throw new Exception("Failed to parse Replicate prediction response.");

                switch (prediction.Status)
                {
                    case "succeeded":
                        // Output is a list of image URLs; we take the first one
                        string imageUrl = "";

                        if (prediction.Output.ValueKind == JsonValueKind.Array)
                        {
                            if (prediction.Output.GetArrayLength() == 0)
                                throw new Exception("Replicate returned empty output array.");
                                imageUrl = prediction.Output[0].GetString()!;

                        }
                        else if (prediction.Output.ValueKind == JsonValueKind.String)
                        {
                            imageUrl = prediction.Output.GetString()!;
                        }
                        else
                        {
                            throw new Exception("Replicate returned unsupported output format.");
                        }

                        _logger.LogInformation("Replicate generation succeeded.");

                        return imageUrl;


                    case "failed":
                    case "canceled":
                        throw new Exception($"Replicate prediction {prediction.Status}: {prediction.Error}");

                    default:
                        // "starting" or "processing" — keep polling
                        await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                        break;
                }
            }

            throw new Exception("Replicate prediction timed out after maximum polling attempts.");
        }
    }

    // Internal response models 

    internal class ReplicatePredictionResponse
    {
        public string? Id { get; set; }
        public string? Status { get; set; }
        public string? Error { get; set; }
        public ReplicateUrls? Urls { get; set; }

        [JsonPropertyName("output")]
        public JsonElement Output { get; set; }
    }

    internal class ReplicateUrls
    {
        public string? Get { get; set; }
        public string? Cancel { get; set; }
    }
}
