using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class ContentGoal
{
    public int Id { get; set; }

    public string GoalKey { get; set; } = null!;

    public string GoalLabel { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
