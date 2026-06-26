using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class Channel
{
    public int Id { get; set; }

    public string ChannelId { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ThumbnailUrl { get; set; } = string.Empty;

    public long SubscriberCount { get; set; }

    public long TotalViews { get; set; }

    public long VideoCount { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public int? OwnerUserId { get; set; }

    public virtual ICollection<AnalyticsSnapshot> AnalyticsSnapshots { get; set; } = new List<AnalyticsSnapshot>();

    public virtual ICollection<HistoricalStatistic> HistoricalStatistics { get; set; } = new List<HistoricalStatistic>();

    public virtual User? OwnerUser { get; set; }

    public virtual ICollection<Video> Videos { get; set; } = new List<Video>();
}
