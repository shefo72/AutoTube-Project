using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class GeneratedVideo
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? GeneratedContentId { get; set; }

    public string? ProviderTaskId { get; set; }

    public string ProviderName { get; set; } = null!;

    public string ProviderModel { get; set; } = null!;

    public string? GenerationMode { get; set; }

    public string Prompt { get; set; } = null!;

    public string? EnhancedPrompt { get; set; }

    public string VoiceTone { get; set; } = null!;

    public string VideoStyle { get; set; } = null!;

    public int DurationSeconds { get; set; }

    public string AspectRatio { get; set; } = null!;

    public string? GenerationStatus { get; set; }

    public string? GeneratedVideoUrl { get; set; }

    public bool? IsMerged { get; set; }

    public int? ClipCount { get; set; }

    public string? ErrorMessage { get; set; }

    public int? CreditsUsed { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public virtual GeneratedContent? GeneratedContent { get; set; }

    public virtual ICollection<GeneratedVideoClip> GeneratedVideoClips { get; set; } = new List<GeneratedVideoClip>();

    public virtual User User { get; set; } = null!;
}
