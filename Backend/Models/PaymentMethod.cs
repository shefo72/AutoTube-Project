using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class PaymentMethod
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? PaymentGatewayId { get; set; }

    public string? CardHolderName { get; set; }

    public string? CardLast4 { get; set; }

    public string? ExpiryDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual PaymentGateway? PaymentGateway { get; set; }

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    public virtual User User { get; set; } = null!;
}
