using Autotube.DTOs.All_in_One.Thumbnail;
using Autotube.Models;
using Autotube.Repositories.All_in_One.Thumbnail;
using Autotube.Services.All_in_One.Thumbnail.ExternalApis;
using Microsoft.Extensions.Logging;

 namespace Autotube.Services.All_in_One.Thumbnail
{
    public class AllThumbnailGenerationService : IAllThumbnailGenerationService
    {
        private readonly IAllThumbnailRepository _repo;
        private readonly AllReplicateService _replicate;
        private readonly AllStabilityAiService _stability;
        private readonly AllImageStorageService _imageStorage;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<AllThumbnailGenerationService> _logger;

        public AllThumbnailGenerationService(
            IAllThumbnailRepository repo,
            AllReplicateService replicate,
            AllStabilityAiService stability,
            AllImageStorageService imageStorage,
            IHttpClientFactory httpClientFactory,
            ILogger<AllThumbnailGenerationService> logger)
        {
            _repo = repo;
            _replicate = replicate;
            _stability = stability;
            _imageStorage = imageStorage;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        // Main entry point 

        public async Task<GeneratedThumbnailResponseDto> GenerateAsync(GenerateThumbnailDto request, int userId)
        {
            _logger.LogInformation("Original content idea: {Prompt}", request.Prompt);

            var thumbnailPrompt = BuildThumbnailPrompt(request.Prompt);

            _logger.LogInformation("Generated thumbnail prompt: {ThumbnailPrompt}", thumbnailPrompt);

            var (imagePath, providerName) = await GenerateAndSaveImageAsync(thumbnailPrompt);

            //var newThumbnail = new AllInOne
            //{
            //    UserId = userId,
            //    Prompt = request.Prompt,
            //    ThumbnailPrompt = thumbnailPrompt,
            //    ImagePath = imagePath,
            //    ImageProvider = providerName,
            //    CreatedAt = DateTime.UtcNow
            //};

            //var saved = await _repo.SaveAsync(newThumbnail);

            //return new GeneratedThumbnailResponseDto
            //{
            //    Thumbnail = MapToDto(saved)
            //};

            return new GeneratedThumbnailResponseDto
            {
                Thumbnail = new ThumbnailOptionDto
                {
                    Prompt = request.Prompt,
                    ThumbnailPrompt = thumbnailPrompt,
                    ImagePath = imagePath,
                    ImageProvider = providerName,
                    CreatedAt = DateTime.UtcNow
                }
            };
        }

        // Prompt builder 

        private static string BuildThumbnailPrompt(string userIdea)
        {
            var segments = new[]
            {

                BuildSubjectSegment(userIdea),

                "ultra realistic, photorealistic quality, 4K sharp details",

                "dramatic cinematic lighting, strong shadows, high contrast, vivid punchy colors",

                "single clear focal subject, rule-of-thirds composition, clean uncluttered background",

                "strong emotional expression, powerful facial features, high energy",

                "eye-catching first impression, click-worthy composition, trending YouTube visual style",

                "professional YouTube thumbnail, 16:9 aspect ratio",

                BuildNegativeConstraints(),
            };

            return string.Join(",\n", segments);
        }


        private static string BuildSubjectSegment(string userIdea) =>
            $"Create a viral YouTube thumbnail about: {userIdea}";

        private static string BuildNegativeConstraints() =>
            "no text, no captions, no titles, no subtitles, no logos, no watermarks, no overlays";

        // Image generation 

        private async Task<(string imagePath, string providerName)> GenerateAndSaveImageAsync(string prompt)
        {
            var httpClient = _httpClientFactory.CreateClient();

            // Replicate (primary)
            try
            {
                _logger.LogInformation("Attempting image generation with Replicate...");

                var imageUrl = await _replicate.GenerateImageAsync(prompt);
                var imagePath = await _imageStorage.SaveFromUrlAsync(imageUrl, httpClient);

                _logger.LogInformation("Replicate succeeded. Image saved to {Path}", imagePath);
                return (imagePath, "Replicate");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Replicate failed. Falling back to Stability AI.");
            }

            // Stability AI (backup)
            try
            {
                _logger.LogInformation("Attempting image generation with Stability AI...");

                var base64Image = await _stability.GenerateImageBase64Async(prompt);
                var imagePath = await _imageStorage.SaveFromBase64Async(base64Image);

                _logger.LogInformation("Stability AI succeeded. Image saved to {Path}", imagePath);
                return (imagePath, "StabilityAI");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Stability AI also failed. Both providers are unavailable.");
            }

            throw new Exception(
                "Image generation failed. Both Replicate and Stability AI are currently unavailable.");
        }

        // Mapping 

        private static ThumbnailOptionDto MapToDto(AllInOne entity)
        {
            return new ThumbnailOptionDto
            {
                Id = entity.Id,
                Prompt = entity.Prompt,
                ThumbnailPrompt = entity.ThumbnailPrompt,
                ImagePath = entity.ImagePath,
                ImageProvider = entity.ImageProvider,
                CreatedAt = entity.CreatedAt ??DateTime.UtcNow
            };
        }
    }
}
