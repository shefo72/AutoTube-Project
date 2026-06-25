using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class UsageQuota
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int GapAnalysesUsed { get; set; }

    public int ThumbnailOptimizationsUsed { get; set; }

    public int ScriptGenerationsUsed { get; set; }

    public int VideoGenerationsUsed { get; set; }

    public int ContentGenerationsUsed { get; set; }

    public DateTime? PeriodStart { get; set; }

    public DateTime? PeriodEnd { get; set; }

    public int MaxQuota { get; set; }

    public virtual User User { get; set; } = null!;
}
