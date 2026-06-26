using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class Subscription
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int SubscriptionPlanId { get; set; }

    public int? PaymentMethodId { get; set; }

    public string? Status { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public virtual PaymentMethod? PaymentMethod { get; set; }

    public virtual SubscriptionPlan SubscriptionPlan { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
