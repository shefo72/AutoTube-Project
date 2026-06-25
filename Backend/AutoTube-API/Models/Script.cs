namespace Autotube.Models
{
    public class Script
    {
        public int Id { get; set; }
        public int UserId { get; set; } 

        public int? GapReportId { get; set; }

        public string Topic { get; set; } = string.Empty;

        public string RawJson { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public virtual GapReport? GapReport { get; set; }

        public ICollection<AllInOne> AllInOne { get; set; } = new List<AllInOne>();

        public virtual User User { get; set; } = null!;

    }

}
