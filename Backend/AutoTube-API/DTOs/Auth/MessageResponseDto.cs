namespace AutoTubeAPI.DTOs.Auth
{
    public class MessageResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = default!;
    }
}
