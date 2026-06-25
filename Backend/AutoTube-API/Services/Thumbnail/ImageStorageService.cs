using Microsoft.Extensions.Logging;

namespace Autotube.Services.Thumbnail
{

    public class ImageStorageService
    {
        private const string FolderName = "generated-thumbnails";

        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ImageStorageService> _logger;

        public ImageStorageService(IWebHostEnvironment env, ILogger<ImageStorageService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public async Task<string> SaveFromUrlAsync(string imageUrl, HttpClient httpClient)
        {
            _logger.LogInformation("Downloading image from URL: {Url}", imageUrl);

            // Download the image bytes from the URL
            var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);

            // Save to disk and return the web path
            return await SaveBytesAsync(imageBytes, ".png");
        }

        public async Task<string> SaveFromBase64Async(string base64Data)
        {
            _logger.LogInformation("Saving image from base64 data.");

            // Remove the data URI prefix if present (e.g. "data:image/png;base64,")
            var cleanBase64 = base64Data.Contains(",")
                ? base64Data.Split(',')[1]
                : base64Data;

            var imageBytes = Convert.FromBase64String(cleanBase64);
            return await SaveBytesAsync(imageBytes, ".png");
        }


        // Private Helpers
        private async Task<string> SaveBytesAsync(byte[] bytes, string extension)
        {
            // Build the full directory path inside wwwroot
            var folderPath = Path.Combine(_env.WebRootPath, FolderName);

            // Create the folder if it doesn't exist yet
            Directory.CreateDirectory(folderPath);

            // Generate a unique file name using a GUID to avoid collisions
            var fileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(folderPath, fileName);

            // Write the image file asynchronously
            await File.WriteAllBytesAsync(fullPath, bytes);

            _logger.LogInformation("Image saved to {Path}", fullPath);

            // Return the URL-friendly relative path (used in responses and stored in DB)
            return $"/{FolderName}/{fileName}";
        }

        public string GetAbsolutePath(string relativePath)
        {
            // relativePath looks like: /generated-thumbnails/abc123.png
            // We remove the leading "/" and combine with wwwroot
            var sanitized = relativePath.TrimStart('/');
            return Path.Combine(_env.WebRootPath, sanitized);
        }
    }
}
