using Autotube.DTOs.Billing.Enums;
using Autotube.DTOs.UploadedThumbnail;
using Autotube.Exceptions;
using Autotube.Models;
using Autotube.Repositories.Thumbnail;
using Autotube.Services.Billing.Quota;
using Autotube.Services.Thumbnail.ExternalApis;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Autotube.Services.Thumbnail
{
    public class UploadedThumbnailGenerationService
    {
        private readonly FluxKontextService _fluxKontextService;
        private readonly UploadedThumbnailRepository _repository;
        private readonly IQuotaService _quotaService;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<UploadedThumbnailGenerationService> _logger;

        // Allowed image extensions
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

        public UploadedThumbnailGenerationService(
            FluxKontextService fluxKontextService,
            UploadedThumbnailRepository repository,
            IQuotaService quotaService,
            IWebHostEnvironment env,
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory,
            ILogger<UploadedThumbnailGenerationService> logger)
        {
            _fluxKontextService = fluxKontextService;
            _repository = repository;
            _quotaService = quotaService;
            _env = env;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<UploadedThumbnailResponseDto> GenerateAsync(
            GenerateUploadedThumbnailDto dto,
            string baseUrl,
            int userId)
        {
            // Check credits before generation
            if (!await _quotaService.HasEnoughCreditsAsync(
                userId,
                CreditCosts.ThumbnailImage))
            {
                var quota = await _quotaService.GetQuotaAsync(userId);

                throw new InsufficientCreditsException(
                    CreditCosts.ThumbnailImage,
                    quota.CreditsRemaining);
            }

            // Validate the uploaded image
            ValidateImage(dto.Image);

            // Save the original uploaded image locally
            var originalRelativePath = await SaveOriginalImageAsync(dto.Image);
            _logger.LogInformation("Original image saved: {Path}", originalRelativePath);

            // Build a public URL for the image so Replicate can fetch it
            var imagePublicUrl = $"{baseUrl}{originalRelativePath}";

            // Call Flux Kontext Pro via Replicate
            _logger.LogInformation(
                "Calling Flux Kontext Pro with prompt: {Prompt}",
                dto.Prompt);

            var generatedImageUrl =
                await _fluxKontextService.GenerateThumbnailAsync(
                    imagePublicUrl,
                    dto.Prompt);

            // Download and save the generated image locally
            var generatedRelativePath =
                await SaveGeneratedImageAsync(generatedImageUrl);

            _logger.LogInformation(
                "Generated image saved: {Path}",
                generatedRelativePath);

            // Save a record to the database
            var thumbnail = new UploadedImageThumbnail
            {
                UserId = userId,
                OriginalImagePath = originalRelativePath,
                GeneratedImagePath = generatedRelativePath,
                Prompt = dto.Prompt,
                AiProvider = "Flux Kontext Pro",
                DownloadCount = 0,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.SaveAsync(thumbnail);

            _logger.LogInformation(
                "Thumbnail record saved with ID: {Id}",
                thumbnail.Id);

            // Deduct credits only after successful generation
            await _quotaService.DeductCreditsAsync(
                userId,
                CreditCosts.ThumbnailImage,
                CreditFeature.ThumbnailImage,
                "Image thumbnail generated");

            // Return response DTO
            return MapToDto(thumbnail);
        }

        // Private helpers 

        private void ValidateImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
                throw new ArgumentException("No image was uploaded.");

            if (image.Length > MaxFileSizeBytes)
                throw new ArgumentException("Image exceeds the 10MB size limit.");

            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                throw new ArgumentException($"Invalid file type '{extension}'. Allowed: jpg, jpeg, png, webp.");
        }

        private async Task<string> SaveOriginalImageAsync(IFormFile image)
        {
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            var fileName = $"{Guid.NewGuid()}{extension}";

            var folder = Path.Combine(_env.WebRootPath, "uploaded-thumbnails", "originals");
            Directory.CreateDirectory(folder);

            var fullPath = Path.Combine(folder, fileName);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await image.CopyToAsync(stream);

            // Return the relative web path (used as URL path)
            return $"/uploaded-thumbnails/originals/{fileName}";
        }

        private async Task<string> SaveGeneratedImageAsync(string generatedImageUrl)
        {
            var fileName = $"{Guid.NewGuid()}.png";

            var folder = Path.Combine(_env.WebRootPath, "uploaded-thumbnails", "generated");
            Directory.CreateDirectory(folder);

            var fullPath = Path.Combine(folder, fileName);

            var httpClient = _httpClientFactory.CreateClient();
            var imageBytes = await httpClient.GetByteArrayAsync(generatedImageUrl);
            await File.WriteAllBytesAsync(fullPath, imageBytes);

            return $"/uploaded-thumbnails/generated/{fileName}";
        }

        private UploadedThumbnailResponseDto MapToDto(UploadedImageThumbnail thumbnail)
        {
            return new UploadedThumbnailResponseDto
            {
                Id = thumbnail.Id,
                Prompt = thumbnail.Prompt,
                OriginalImagePath = thumbnail.OriginalImagePath,
                GeneratedImagePath = thumbnail.GeneratedImagePath,
                AiProvider = thumbnail.AiProvider,
                CreatedAt = (DateTime)thumbnail.CreatedAt
            };
        }
    }
}
