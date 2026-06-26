using Autotube.DTOs.Billing.Enums;
using Autotube.DTOs.ThumbnailP;
using Autotube.Exceptions;
using Autotube.Models;
using Autotube.Repositories.Thumbnail;
using Autotube.Services.Billing.Quota;
using Autotube.Services.Thumbnail.ExternalApis;
using Microsoft.Extensions.Logging;

namespace Autotube.Services.Thumbnail
{
    public class ThumbnailGenerationService
    {
        private readonly IThumbnailRepository _repo;
        private readonly ReplicateService _replicate;
        private readonly StabilityAiService _stability;
        private readonly ImageStorageService _imageStorage;
        private readonly IQuotaService _quotaService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ThumbnailGenerationService> _logger;

        public ThumbnailGenerationService(
            IThumbnailRepository repo,
            ReplicateService replicate,
            StabilityAiService stability,
            ImageStorageService imageStorage,
            IQuotaService quotaService,
            IHttpClientFactory httpClientFactory,
            ILogger<ThumbnailGenerationService> logger)
        {
            _repo = repo;
            _replicate = replicate;
            _stability = stability;
            _imageStorage = imageStorage;
            _quotaService = quotaService;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        // Main entry point
        public async Task<GeneratedThumbnailResponseDto> GenerateAsync(
            GenerateThumbnailDto request,
            int userId)
        {
            // Check credits before generation
            if (!await _quotaService.HasEnoughCreditsAsync(
                userId,
                CreditCosts.ThumbnailText))
            {
                var quota = await _quotaService.GetQuotaAsync(userId);

                throw new InsufficientCreditsException(
                    CreditCosts.ThumbnailText,
                    quota.CreditsRemaining);
            }

            var response = new GeneratedThumbnailResponseDto();

            // Search for a similar cached thumbnail
            var cached = await _repo.FindSimilarAsync(
                request.Prompt,
                request.Style);

            if (cached != null)
            {
                await _repo.IncrementReuseCountAsync(cached.Id);

                response.CachedThumbnail =
                    MapToDto(cached, isCached: true);

                _logger.LogInformation(
                    "Returning cached thumbnail Id {Id}",
                    cached.Id);
            }

            // Build optimized AI prompt
            var aiPrompt = BuildAiPrompt(
                request.Prompt,
                request.Style);

            _logger.LogInformation(
                "Built AI prompt: {Prompt}",
                aiPrompt);

            // Generate image
            var (imagePath, providerName) =
                await GenerateAndSaveImageAsync(aiPrompt);

            // Save generated thumbnail
            var newThumbnail = new GeneratedThumbnail
            {
                UserId = userId,
                Prompt = request.Prompt,
                Style = request.Style,
                ImagePath = imagePath,
                AiProvider = providerName,
                ReuseCount = 0,
                DownloadCount = 0,
                IsFavorite = false,
                CreatedAt = DateTime.UtcNow
            };

            var saved = await _repo.SaveAsync(newThumbnail);

            response.FreshThumbnail =
                MapToDto(saved, isCached: false);

            // Deduct credits only after successful generation
            await _quotaService.DeductCreditsAsync(
                userId,
                CreditCosts.ThumbnailText,
                CreditFeature.ThumbnailText,
                "Thumbnail generated");

            return response;
        }

        // Prompt engineering
        private static string BuildAiPrompt(string userPrompt, string style)
        {
            // Map each style to specific visual descriptors
            var styleDescriptors = style switch
            {
                "Cyberpunk"     => "neon-lit cyberpunk city, glowing holographic panels, " +
                                   "electric blue and magenta neon, futuristic dystopia, " +
                                   "rain-slicked streets, tech-noir atmosphere",

                "Minimalist"    => "ultra-clean minimalist design, flat bold colors, " +
                                   "negative space composition, sharp geometric shapes, " +
                                   "premium modern aesthetic, Swiss design influence",

                "High Contrast" => "extreme high contrast, deep blacks and brilliant whites, " +
                                   "punchy shadows, bold silhouettes, crisp edge definition, " +
                                   "dramatic chiaroscuro lighting",
                "Clickbait Face" => "extreme YouTube reaction face, exaggerated facial expression, " +
                                    "wide eyes, raised eyebrows, mouth open in shock, " +
                                    "high emotional intensity, dramatic reaction, " +
                                    "attention-grabbing facial features, viral thumbnail style, " +
                                    "bright catchlight in eyes, expressive emotions, " +
                                    "high contrast lighting, zoomed-in portrait composition",

                //"Vibrant"       => "ultra-vibrant supersaturated colors, eye-popping palette, " +
                //                   "electric hues, pop-art energy, bold color blocking",

                //"3D Render"     => "ultra realistic 3D render, octane render, cinematic CGI,"+ 
                //                   "depth of field, realistic materials, Unreal Engine quality",



                _ => $"{style} style, visually compelling, modern design"
            };

            // Assemble the final prompt with all quality boosters
            return $"""
                {userPrompt}, {styleDescriptors},

                cinematic dramatic lighting, ultra-high detail, 8K resolution,
                expressive emotions, powerful facial expressions, strong focal point,
                rule-of-thirds composition, clean uncluttered background,
                modern YouTube thumbnail aesthetic, viral creator style,
                bold text-ready space, eye-catching first impression,
                professional color grading, photorealistic quality,
                16:9 aspect ratio optimized, highly clickable composition,
                trending YouTube visual style, masterpiece quality
                """;
        }


        // Image generation
        private async Task<(string imagePath, string providerName)> GenerateAndSaveImageAsync(string prompt)
        {
            // Create a shared HttpClient for downloading images from URLs
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
                // Log the error but don't rethrow – fall through to Stability AI
                _logger.LogWarning(ex, "Replicate failed. Falling back to Stability AI.");
            }

            // Stability (backup)
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

            // Both failed (GOD FORBIDE)
            throw new Exception(
                "Image generation failed. Both Replicate and Stability AI are currently unavailable.");
        }


        // Mapping
        private static ThumbnailOptionDto MapToDto(GeneratedThumbnail entity, bool isCached)
        {
            return new ThumbnailOptionDto
            {
                Id = entity.Id,
                Prompt = entity.Prompt,
                Style = entity.Style,
                ImagePath = entity.ImagePath,
                AiProvider = entity.AiProvider,

                ReuseCount = entity.ReuseCount ?? 0,
                DownloadCount = entity.DownloadCount ?? 0,
                IsFavorite = entity.IsFavorite ?? false,
                CreatedAt = entity.CreatedAt ?? DateTime.UtcNow,

                IsCached = isCached,
                Type = isCached ? "Cached" : "Fresh",

                Message = isCached
                    ? "Similar thumbnail found in cache"
                    : "Brand new thumbnail generated"
            };
        }
    }
}