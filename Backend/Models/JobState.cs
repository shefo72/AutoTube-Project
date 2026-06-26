using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class JobState
{
    public int Id { get; set; }

    public int JobId { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Name { get; set; } = null!;

    public string? Reason { get; set; }

    public string? Data { get; set; }

    public virtual Job Job { get; set; } = null!;
}
