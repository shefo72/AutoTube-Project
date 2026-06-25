namespace Autotube.Models
{
    public class AllInOne
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ScriptId { get; set; }

        public string Prompt { get; set; } = string.Empty;

        public string voice_tone { get; set; } = string.Empty;

        public string video_style { get; set; } = string.Empty;

        public string? ThumbnailPrompt { get; set; }

        public string ImagePath { get; set; } = string.Empty;

        public string ImageProvider { get; set; } = string.Empty;

        public string? VideoPrompt { get; set; }

        public string? PiApiTaskId { get; set; }

        public string? VideoPath { get; set; }

        public string Status { get; set; } = "Pending";

        public string? ErrorMessage { get; set; }

        public DateTime? CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; }

        public virtual User User { get; set; } = null!;

        public virtual Script Script { get; set; } = null!;
    }
}
