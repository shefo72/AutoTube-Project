using Autotube.DTOs.All_in_One.Video;
using AutoTubeAPI.DTOs.VideoGeneration;
using System.Text;
using System.Text.Json;

namespace Autotube.Services.All_in_One.Video
{
    public class AllInOnePiAPIService : IAllInOnePiAPIService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        public AllInOnePiAPIService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _config = config;
            _http.Timeout = TimeSpan.FromSeconds(100);
        }

        public async Task<string> CreateVideoTaskAsync(string prompt)
        {
            var apiKey = _config["PiApi:ApiKey"]
                ?? throw new Exception("Missing PiAPI key");

            var requestBody = new
            {
                model = "seedance",
                task_type = "seedance-2-fast",
                input = new
                {
                    prompt = prompt,
                    mode = "text_to_video",
                    duration = 15,
                    aspect_ratio = "16:9"
                }
            };

            var json = JsonSerializer.Serialize(requestBody);

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.piapi.ai/api/v1/task");

            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            request.Headers.Add("X-API-Key", apiKey);
            request.Headers.Add("Accept", "application/json");

            var response = await _http.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"PiAPI Error: {content}");

            using var doc = JsonDocument.Parse(content);

            return doc.RootElement
                .GetProperty("data")
                .GetProperty("task_id")
                .GetString()
                ?? throw new Exception("No task_id returned");
        }

        public async Task<PiAPIStatusResponseDto> GetTaskStatusAsync(string taskId)
        {
            var apiKey = _config["PiApi:ApiKey"]
                ?? throw new Exception("Missing PiAPI key");

            var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://api.piapi.ai/api/v1/task/{taskId}");

            request.Headers.Add("X-API-Key", apiKey);

            var response = await _http.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"PiAPI Status Error: {content}");

            using var doc = JsonDocument.Parse(content);

            var data = doc.RootElement.GetProperty("data");

            var status = data.GetProperty("status").GetString();

            string? videoUrl = null;

            if (status?.ToLower() == "completed")
            {
                if (data.TryGetProperty("output", out var output) &&
                    output.TryGetProperty("video", out var video))
                {
                    videoUrl = video.GetString();
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
