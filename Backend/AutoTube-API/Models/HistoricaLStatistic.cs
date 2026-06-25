using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class HistoricalStatistic
{
    public int Id { get; set; }

    public string ChannelId { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public long Views { get; set; }

    public long Subscribers { get; set; }

    public long WatchTimeMinutes { get; set; }

    public double EngagementRate { get; set; }

    public double ClickThroughRate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Channel Channel { get; set; } = null!;
}
