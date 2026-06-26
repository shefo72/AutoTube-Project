using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class AnalysisSession
{
    public int Id { get; set; }

    public Guid SessionId { get; set; } = Guid.NewGuid();

    public int GapReportId { get; set; }

    public string VideoId { get; set; } = string.Empty;

    public string ContextJson { get; set; } = "{}";

    public string Notes { get; set; } = string.Empty;

    public DateTime SessionDate { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual GapReport GapReport { get; set; } 
}
