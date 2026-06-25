namespace AutoTubeAPI.DTOs.Auth
{
    public class YouTubeConnectResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = default!;
        public YouTubeChannelDto? Channel { get; set; }
    }
}
