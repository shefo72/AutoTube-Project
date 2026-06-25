using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class YouTubeChannel
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string ChannelTitle { get; set; } = null!;

    public string YoutubeChannelExternalId { get; set; } = null!;

    public string? ChannelDescription { get; set; }

    public string? ChannelThumbnailUrl { get; set; }

    public long? SubscriberCount { get; set; }

    public long? VideoCount { get; set; }

    public long? ViewCount { get; set; }

    public string? AccessToken { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? TokenExpiresAt { get; set; }

    public bool IsActive { get; set; }

    public DateTime ConnectedAt { get; set; }

    public DateTime? LastSyncedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
