using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class JobQueue
{
    public int Id { get; set; }

    public int JobId { get; set; }

    public DateTime? FetchedAt { get; set; }

    public string Queue { get; set; } = null!;

    public string? FetchToken { get; set; }
}
