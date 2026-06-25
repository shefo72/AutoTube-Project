using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class Job
{
    public int Id { get; set; }

    public int? StateId { get; set; }

    public string? StateName { get; set; }

    public string InvocationData { get; set; } = null!;

    public string Arguments { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? ExpireAt { get; set; }

    public virtual ICollection<JobParameter> JobParameters { get; set; } = new List<JobParameter>();

    public virtual ICollection<JobState> JobStates { get; set; } = new List<JobState>();

    public virtual ICollection<State> States { get; set; } = new List<State>();
}
