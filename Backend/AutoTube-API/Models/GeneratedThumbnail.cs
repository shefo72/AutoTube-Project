using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class GeneratedThumbnail
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? GeneratedContentId { get; set; }

    public string Prompt { get; set; } = null!;

    public string? Style { get; set; }

    public string ImagePath { get; set; } = null!;

    public string AiProvider { get; set; } = null!;

    public int? ReuseCount { get; set; }

    public int? DownloadCount { get; set; }

    public bool? IsFavorite { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? ReferenceImagePath { get; set; }

    public virtual GeneratedContent? GeneratedContent { get; set; }

    public virtual User User { get; set; } = null!;
}
