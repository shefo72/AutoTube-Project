using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class GeneratedVideoClip
{
    public int Id { get; set; }

    public int GeneratedVideoId { get; set; }

    public int ClipOrder { get; set; }

    public string? ProviderTaskId { get; set; }

    public string? ClipVideoUrl { get; set; }

    public string? GenerationStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual GeneratedVideo GeneratedVideo { get; set; } = null!;
}
