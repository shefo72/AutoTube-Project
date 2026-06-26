using Autotube.DTOs.Billing.Enums;
using Autotube.Exceptions;
using Autotube.Models;
using Autotube.Services.Billing.Quota;
using AutoTubeAPI.DTOs.VideoGeneration;
using AutoTubeAPI.Repositories.VideoClips;
using AutoTubeAPI.Repositories.VideoGeneration;
using AutoTubeAPI.Services.Gemini;
using AutoTubeAPI.Services.PiAPI;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace AutoTubeAPI.Services.VideoGeneration
{
    public class VideoGenerationService : IVideoGenerationService
    {
        private readonly IVideoGenerationRepository _repository;
        private readonly IVideoClipsRepository _clipRepository;
        private readonly IQuotaService _quotaService;
        private readonly IPiAPIService _piAPIService;
        private readonly ISceneGeneratorService _sceneGenerator;
        public VideoGenerationService(
            IVideoGenerationRepository repository,
            IVideoClipsRepository clipRepository,
            IQuotaService quotaService,
            IPiAPIService piAPIService,
            ISceneGeneratorService sceneGenerator)
        {
            _repository = repository;
            _clipRepository = clipRepository;
            _quotaService = quotaService;
            _piAPIService = piAPIService;
            _sceneGenerator = sceneGenerator;
        }

        // Helper → calculate how many clips we need
        private int CalculateClipCount(int durationSeconds)
        {
            return (int)Math.Ceiling(durationSeconds / 15.0);
        }

        // Main video generation entry point 
        public async Task<VideoGenerationResponseDto> GenerateVideoAsync(
                CreateVideoGenerationRequestDto request,
                int userId)
        {
            var cost = CreditCosts.GetVideoGenerationCost(
             request.DurationSeconds);

            if (!await _quotaService.HasEnoughCreditsAsync(
                userId,
                cost))
            {
                var quota = await _quotaService.GetQuotaAsync(userId);

                throw new InsufficientCreditsException(
                    cost,
                    quota.CreditsRemaining);
            }
            var validDurations = new[] { 5, 10, 15, 20, 25, 30 };

            if (!validDurations.Contains(request.DurationSeconds))
                throw new Exception("Invalid duration");

            var enhancedPrompt =
                $"{request.VideoStyle} style, " +
                $"{request.VoiceTone} tone, " +
                $"{request.Prompt}";

            var clipCount =
                CalculateClipCount(request.DurationSeconds);

            List<SceneDto> scenes = new();

            // Gemini only for videos longer than 15 seconds
            if (request.DurationSeconds > 15)
            {
                scenes =
                    await _sceneGenerator.GenerateScenesAsync(
                        enhancedPrompt,
                        request.DurationSeconds);

                if (scenes == null || scenes.Count != clipCount)
                {
                    throw new Exception(
                        $"Gemini returned {scenes?.Count ?? 0} scenes while {clipCount} expected.");
                }
            }

            var video = new GeneratedVideo
            {
                UserId = userId,
                ProviderName = "PiAPI",
                ProviderModel = "seedance-2-fast",
                Prompt = request.Prompt,
                EnhancedPrompt = enhancedPrompt,
                VoiceTone = request.VoiceTone,
                VideoStyle = request.VideoStyle,
                DurationSeconds = request.DurationSeconds,
                AspectRatio = request.AspectRatio,
                ClipCount = clipCount,
                GenerationMode = "text_to_video",
                GenerationStatus = "Queued",
                CreatedAt = DateTime.UtcNow
            };

            video = await _repository.CreateAsync(video);

            try
            {
                var clips = new List<GeneratedVideoClip>();

                for (int i = 0; i < clipCount; i++)
                {
                    clips.Add(new GeneratedVideoClip
                    {
                        GeneratedVideoId = video.Id,
                        ClipOrder = i + 1,
                        GenerationStatus = "Pending",
                        CreatedAt = DateTime.UtcNow
                    });
                }

                await _clipRepository.AddRangeAsync(clips);

                // 5 / 10 / 15 seconds
                if (request.DurationSeconds <= 15)
                {
                    var taskId =
                        await _piAPIService.CreateVideoTaskAsync(
                            enhancedPrompt,
                            "text_to_video",
                            request.DurationSeconds,
                            request.AspectRatio);

                    if (string.IsNullOrWhiteSpace(taskId))
                        throw new Exception("PiAPI returned empty taskId");

                    clips[0].ProviderTaskId = taskId;
                    clips[0].GenerationStatus = "Processing";

                    await _clipRepository.UpdateAsync(clips[0]);

                    video.ProviderTaskId = taskId;

                }
                else
                {
                    // 20 / 25 / 30 seconds
                    foreach (var clip in clips)
                    {
                        var scene =
                            scenes[clip.ClipOrder - 1];

                        var taskId =
                            await _piAPIService.CreateVideoTaskAsync(
                                scene.Prompt,
                                "text_to_video",
                                scene.DurationSeconds,
                                request.AspectRatio);

                        if (string.IsNullOrWhiteSpace(taskId))
                            throw new Exception("PiAPI returned empty taskId");

                        clip.ProviderTaskId = taskId;
                        clip.GenerationStatus = "Processing";

                        await _clipRepository.UpdateAsync(clip);
                    }
                }

                video.GenerationStatus = "Processing";
                video.StartedAt = DateTime.UtcNow;
                await _quotaService.DeductCreditsAsync(
                 userId,
                  cost,
                  CreditFeature.VideoGeneration,
                  $"Video generation ({request.DurationSeconds}s)");

                await _repository.UpdateAsync(video);

                return new VideoGenerationResponseDto
                {
                    VideoGenerationId = video.Id,
                    Status = video.GenerationStatus,
                    Message = "Video generation started successfully"
                };
            }
            catch (Exception ex)
            {
                video.GenerationStatus = "Failed";
                video.ErrorMessage = ex.Message;

                await _repository.UpdateAsync(video);

                return new VideoGenerationResponseDto
                {
                    VideoGenerationId = video.Id,
                    Status = "Failed",
                    Message = ex.Message
                };
            }
        }

        // Status Check
        public async Task<string> GetGenerationStatusAsync(int id, int userId)
        {
            var video = await _repository.GetByIdForUserAsync(id, userId);

            if (video == null)
                return "Video not found";

            return video.GenerationStatus;
        }

        // History
        public async Task<List<VideoGenerationHistoryDto>> GetHistoryAsync(int userId)
        {
            return await _repository.GetUserHistoryAsync(userId);
        }

        // Download URL 
        public async Task<string> GetDownloadUrlAsync(int id, int userId)
        {
            var video = await _repository.GetByIdForUserAsync(id, userId);
            if (video == null)
                throw new Exception("Video not found");

            if (video.UserId != userId)
                throw new Exception("Unauthorized access to this video");

            if (video.GenerationStatus != "Completed")
                throw new Exception("Video is not completed yet");

            if (string.IsNullOrWhiteSpace(video.GeneratedVideoUrl))
                throw new Exception("Video URL is missing");

            return video.GeneratedVideoUrl;
        }

        // VIDEO POLLING SYSTEM
        public async Task PollVideoStatusAsync()
        {
            var processingClips =
                await _clipRepository.GetProcessingClipsAsync();

            foreach (var clip in processingClips)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(clip.ProviderTaskId))
                        continue;

                    var response =
                        await _piAPIService.GetTaskStatusAsync(
                            clip.ProviderTaskId);

                    var status = response.Status?.ToLower();

                    if (status == "processing")
                        continue;

                    if (status == "completed")
                    {
                        var videoUrl = response.VideoUrl;

                        if (string.IsNullOrWhiteSpace(videoUrl))
                            continue;

                        var savedClipPath =
                            await DownloadClipAsync(
                                videoUrl,
                                clip.GeneratedVideoId,
                                clip.ClipOrder
                            );

                        clip.ClipVideoUrl = savedClipPath;
                        clip.GenerationStatus = "Completed";

                        await _clipRepository.UpdateAsync(clip);

                        var allClips =
                            await _clipRepository.GetByVideoIdAsync(
                                clip.GeneratedVideoId);

                        var allCompleted =
                            allClips.All(x => x.GenerationStatus == "Completed");

                        if (allCompleted)
                        {
                            var parentVideo = await _repository.GetByIdAsync(
                                clip.GeneratedVideoId);

                            if (parentVideo != null)
                            {
                                var orderedClipPaths = allClips
                                    .OrderBy(x => x.ClipOrder)
                                    .Select(x => x.ClipVideoUrl!)
                                    .ToList();

                                //  FIX: only merge if more than 1 clip
                                if (orderedClipPaths.Count == 1)
                                {
                                    parentVideo.GeneratedVideoUrl = orderedClipPaths.First();
                                }
                                else
                                {
                                    var mergedVideoPath = await MergeVideosAsync(
                                        parentVideo.Id,
                                        orderedClipPaths
                                    );

                                    parentVideo.GeneratedVideoUrl = mergedVideoPath;
                                    parentVideo.IsMerged = true;
                                }

                                parentVideo.GenerationStatus = "Completed";
                                parentVideo.CompletedAt = DateTime.UtcNow;

                                await _repository.UpdateAsync(parentVideo);
                            }
                        }

                        continue;
                    }

                    if (status == "failed")
                    {
                        clip.GenerationStatus = "Failed";
                        await _clipRepository.UpdateAsync(clip);

                        var parentVideo =
                            await _repository.GetByIdAsync(
                                clip.GeneratedVideoId);

                        if (parentVideo != null)
                        {
                            parentVideo.GenerationStatus = "Failed";
                            parentVideo.ErrorMessage =
                                $"Clip #{clip.ClipOrder} failed.";

                            await _repository.UpdateAsync(parentVideo);
                        }
                    }
                }
                catch (Exception ex)
                {
                    clip.GenerationStatus = "Failed";
                    await _clipRepository.UpdateAsync(clip);

                    var parentVideo =
                        await _repository.GetByIdAsync(
                            clip.GeneratedVideoId);

                    if (parentVideo != null)
                    {
                        parentVideo.GenerationStatus = "Failed";
                        parentVideo.ErrorMessage = ex.Message;

                        await _repository.UpdateAsync(parentVideo);
                    }
                }
            }
        }

        // File Handling
        private async Task<string> DownloadClipAsync(
              string videoUrl,
              int videoId,
              int clipOrder)
        {
            using var httpClient = new HttpClient();

            var bytes = await httpClient.GetByteArrayAsync(videoUrl);

            var folderPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "videos",
                "clips"
            );

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{videoId}_{clipOrder}.mp4";
            var fullPath = Path.Combine(folderPath, fileName);

            await File.WriteAllBytesAsync(fullPath, bytes);

            return $"/videos/clips/{fileName}";
        }

        private async Task<string> MergeVideosAsync(
             int videoId,
             List<string> clipPaths)
        {
            var mergeFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "videos",
                "merged"
            );

            if (!Directory.Exists(mergeFolder))
                Directory.CreateDirectory(mergeFolder);

            var outputFileName = $"{videoId}_merged.mp4";

            var outputPath = Path.Combine(mergeFolder, outputFileName);

            var listFilePath = Path.Combine(
                mergeFolder,
                $"{videoId}_list.txt"
            );

            var physicalClipPaths = clipPaths
                .Select(url =>
                    Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        url.TrimStart('/')
                            .Replace("/", Path.DirectorySeparatorChar.ToString())
                   ))
                .ToList();

            var lines = physicalClipPaths
                .Select(path => $"file '{path}'")
                .ToList();


            Console.WriteLine("Merging clips:");

            foreach (var path in physicalClipPaths)
            {
                Console.WriteLine(path);
            }


            await File.WriteAllLinesAsync(listFilePath, lines);

            var process = new Process();

            process.StartInfo.FileName = "ffmpeg";

            process.StartInfo.Arguments =
                $"-f concat -safe 0 -i \"{listFilePath}\" -c copy \"{outputPath}\" -y";

            process.StartInfo.RedirectStandardError = true;
            process.StartInfo.UseShellExecute = false;

            process.Start();

            var error = await process.StandardError.ReadToEndAsync();

            await process.WaitForExitAsync();

            if (process.ExitCode != 0)
                throw new Exception($"FFmpeg merge failed: {error}");

            if (!File.Exists(outputPath))
                throw new Exception("Merged video file was not created");

            return $"/videos/merged/{outputFileName}";

        }
    }
}