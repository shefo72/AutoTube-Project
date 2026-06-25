using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class AnalyticsSnapshot
{
    public int Id { get; set; }

    public string ChannelId { get; set; } = string.Empty;

    public long SubscriberCount { get; set; }

    public long TotalViews { get; set; }

    public long WatchTimeMinutes { get; set; }

    public double AvgEngagementRate { get; set; }

    public double AvgClickThroughRate { get; set; }

    public long NewSubscribers { get; set; }

    public long NewViews { get; set; }

    public DateTime RecordedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Channel Channel { get; set; } = null!;
}
