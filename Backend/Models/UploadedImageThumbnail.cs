using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class UploadedImageThumbnail
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? GeneratedContentId { get; set; }

    public string OriginalImagePath { get; set; } = null!;

    public string GeneratedImagePath { get; set; } = null!;

    public string Prompt { get; set; } = null!;

    public string AiProvider { get; set; } = null!;

    public int? DownloadCount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual GeneratedContent? GeneratedContent { get; set; }

    public virtual User User { get; set; } = null!;
}
