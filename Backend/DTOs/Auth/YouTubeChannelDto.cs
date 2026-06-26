namespace AutoTubeAPI.DTOs.Auth
{
    public class YouTubeChannelDto
    {
        public int ChannelId { get; set; }
        public string YouTubeChannelExternalId { get; set; } = default!;
        public string ChannelTitle { get; set; } = default!;
        public string? ChannelDescription { get; set; }
        public string? ChannelThumbnailUrl { get; set; }
        public long? SubscriberCount { get; set; }
        public long? VideoCount { get; set; }
        public long? ViewCount { get; set; }
        public bool IsActive { get; set; }
        public DateTime ConnectedAt { get; set; }
        public DateTime? LastSyncedAt { get; set; }
    }
}
