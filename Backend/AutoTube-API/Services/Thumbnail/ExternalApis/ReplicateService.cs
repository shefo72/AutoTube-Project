using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;

namespace Autotube.Services.Thumbnail.ExternalApis
{

    public class ReplicateService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ReplicateService> _logger;

        private const string Model =
            "google/imagen-4:19335492dbe879d4b5983bff2149f597db8314ccc7fe374e6313af7c2b52792f";

        public ReplicateService(IHttpClientFactory httpClientFactory,
                                IConfiguration config,
                                ILogger<ReplicateService> logger)
        {
            _httpClient = httpClientFactory.CreateClient("Replicate");
            _logger = logger;

            var apiKey = config["Replicate:ApiKey"]
                ?? throw new InvalidOperationException("Replicate:ApiKey is missing from configuration.");

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Token {apiKey}");
        }

        public async Task<string> GenerateImageAsync(string prompt)
        {
            _logger.LogInformation("Sending prompt to Replicate: {Prompt}", prompt);

            // Start the prediction 
            var requestBody = new
            {
                version = Model,
                input = new
                {
                    prompt = $"{prompt}, YouTube thumbnail, cinematic composition, 16:9 aspect ratio",
                    aspect_ratio = "16:9",
                    num_outputs = 1,
                    guidance_scale = 7.5,
                    num_inference_steps = 30
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var createResponse = await _httpClient.PostAsync("https://api.replicate.com/v1/predictions", content);
            createResponse.EnsureSuccessStatusCode();

            var createJson = await createResponse.Content.ReadAsStringAsync();
            using var createDoc = JsonDocument.Parse(createJson);

            var predictionId = createDoc.RootElement.GetProperty("id").GetString()
                ?? throw new Exception("Replicate did not return a prediction ID.");

            _logger.LogInformation("Replicate prediction started. Id: {Id}", predictionId);

            // Poll until done 
            // poll every 2 seconds for up to 60 seconds.
            var pollUrl = $"https://api.replicate.com/v1/predictions/{predictionId}";
            const int maxAttempts = 30;

            for (int attempt = 1; attempt <= maxAttempts; attempt++)
            {
                await Task.Delay(2000); // wait 2 seconds before each poll

                var pollResponse = await _httpClient.GetAsync(pollUrl);
                pollResponse.EnsureSuccessStatusCode();

                var pollJson = await pollResponse.Content.ReadAsStringAsync();
                using var pollDoc = JsonDocument.Parse(pollJson);

                var status = pollDoc.RootElement.GetProperty("status").GetString();
                _logger.LogDebug("Replicate poll attempt {Attempt}, status: {Status}", attempt, status);

                if (status == "succeeded")
                {
                    var output = pollDoc.RootElement.GetProperty("output");

                    string? imageUrl = null;

                    // Some models return a STRING
                    if (output.ValueKind == JsonValueKind.String)
                    {
                        imageUrl = output.GetString();
                    }

                    // Some models return an ARRAY
                    else if (output.ValueKind == JsonValueKind.Array &&
                             output.GetArrayLength() > 0)
                    {
                        imageUrl = output[0].GetString();
                    }

                    if (string.IsNullOrWhiteSpace(imageUrl))
                    {
                        throw new Exception("Replicate returned empty output.");
                    }

                    _logger.LogInformation("Replicate generation succeeded. URL: {Url}", imageUrl);

                    return imageUrl;
                }

                if (status == "failed" || status == "canceled")
                {
                    var error = pollDoc.RootElement
                        .TryGetProperty("error", out var errProp) ? errProp.GetString() : "Unknown error";
                    throw new Exception($"Replicate prediction failed. Status: {status}. Error: {error}");
                }

                // status == "starting" or "processing" → keep polling
            }

            throw new Exception("Replicate timed out after 60 seconds.");
        }
    }
}
