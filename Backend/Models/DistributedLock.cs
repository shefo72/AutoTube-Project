using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class DistributedLock
{
    public string Resource { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
