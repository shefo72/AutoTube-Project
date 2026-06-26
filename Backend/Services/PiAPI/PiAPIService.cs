using AutoTubeAPI.DTOs.VideoGeneration;
using System.Text;
using System.Text.Json;

namespace AutoTubeAPI.Services.PiAPI
{
    public class PiAPIService : IPiAPIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public PiAPIService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;

            _apiKey = configuration["PiApi:ApiKey"]
                ?? throw new Exception("PiAPI API key is missing!");

            //  safer for long-running tasks
            _httpClient.Timeout = TimeSpan.FromSeconds(100);
        }

        public async Task<string?> CreateVideoTaskAsync(
            string prompt,
            string generationMode,
            int durationSeconds,
            string aspectRatio)
        {
            generationMode = "text_to_video";

            var requestBody = new
            {
                model = "seedance",
                task_type = "seedance-2-fast",
                input = new
                {
                    prompt,
                    mode = generationMode,
                    duration = durationSeconds,
                    aspect_ratio = aspectRatio
                }
            };

            var json = JsonSerializer.Serialize(requestBody);

            var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json");

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.piapi.ai/api/v1/task"
            );

            request.Content = content;
            request.Headers.Add("X-API-Key", _apiKey);
            request.Headers.Add("Accept", "application/json");

            var response = await _httpClient.SendAsync(request);

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"PiAPI Error: {responseContent}");

            using var document = JsonDocument.Parse(responseContent);

            if (!document.RootElement.TryGetProperty("data", out var data) ||
                !data.TryGetProperty("task_id", out var taskIdElement))
            {
                throw new Exception("Invalid PiAPI response: missing task_id");
            }

            return taskIdElement.GetString();
        }

        public async Task<PiAPIStatusResponseDto> GetTaskStatusAsync(string taskId)
        {
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://api.piapi.ai/api/v1/task/{taskId}"
            );

            request.Headers.Add("X-API-Key", _apiKey);

            var response = await _httpClient.SendAsync(request);

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"PiAPI Status Error: {responseContent}");

            using var document = JsonDocument.Parse(responseContent);

            if (!document.RootElement.TryGetProperty("data", out var data))
                throw new Exception("PiAPI response missing data");

            var status = data.GetProperty("status").GetString();

            string? videoUrl = null;

            if (string.Equals(status, "completed", StringComparison.OrdinalIgnoreCase))
            {
                if (data.TryGetProperty("output", out var output) &&
                    output.TryGetProperty("video", out var videoElement))
                {
                    videoUrl = videoElement.GetString();
                }
            }

            return new PiAPIStatusResponseDto
            {
                Status = status ?? "unknown",
                VideoUrl = videoUrl
            };
        }
    }
}