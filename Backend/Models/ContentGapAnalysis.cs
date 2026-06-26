using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class ContentGapAnalysis
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public int GapReportId { get; set; }
    public string Keyword { get; set; } = null!;

    public decimal? DemandScore { get; set; }

    public decimal? TrendScore { get; set; }

    public decimal? CompetitionScore { get; set; }

    public decimal? GapScore { get; set; }

    public string? RawMetricsJson { get; set; }

    public string? RecommendedAction { get; set; }

    public float OpportunityScore { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<GeneratedContent> GeneratedContents { get; set; } = new List<GeneratedContent>();

    public virtual User User { get; set; } = null!;

    public GapReport GapReport { get; set; } = null!;
}
