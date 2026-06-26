using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class GeneratedContent
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? SourceGapAnalysisId { get; set; }

    public string? Topic { get; set; }

    public string? GeneratedTitle { get; set; }

    public string? GeneratedDescription { get; set; }

    public string? GeneratedScript { get; set; }

    public string? AiProvider { get; set; }

    public string? AiProviderVersion { get; set; }

    public int? TokensUsed { get; set; }

    public string? ApprovalStatus { get; set; }

    public string? PublishedStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<GeneratedThumbnail> GeneratedThumbnails { get; set; } = new List<GeneratedThumbnail>();

    public virtual ICollection<GeneratedVideo> GeneratedVideos { get; set; } = new List<GeneratedVideo>();

    public virtual ContentGapAnalysis? SourceGapAnalysis { get; set; }

    public virtual ICollection<UploadedImageThumbnail> UploadedImageThumbnails { get; set; } = new List<UploadedImageThumbnail>();

    public virtual User User { get; set; } = null!;
}
