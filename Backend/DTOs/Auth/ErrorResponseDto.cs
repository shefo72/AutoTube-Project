namespace AutoTubeAPI.DTOs.Auth
{
    public class ErrorResponseDto
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = default!;
        public List<string>? Errors { get; set; }
        public int StatusCode { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
