using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class SubscriptionPlan
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string BillingCycle { get; set; } = null!;

    public decimal Price { get; set; }

    public int AnalysesLimit { get; set; }

    public int VideoPacks { get; set; }

    public bool HasAdvancedScripts { get; set; }

    public bool HasPrioritySupport { get; set; }

    public bool IsPopular { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
