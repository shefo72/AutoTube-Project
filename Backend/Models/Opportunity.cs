using Autotube.DTOs.GapAnalysis.Enums;
using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class Opportunity
{
    public int Id { get; set; }

    public string Keyword { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public double GapScore { get; set; }

    public double DemandScore { get; set; }

    public double CompetitionScore { get; set; }

    public double TrendScore { get; set; }

    public long SearchVolume { get; set; }

    public long AvgViews { get; set; }

    public string OpportunityTagsJson { get; set; } = "[]";

    public string Region { get; set; } = string.Empty;

    public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public OpportunityDifficulty Difficulty { get; set; } = OpportunityDifficulty.Medium;

}
