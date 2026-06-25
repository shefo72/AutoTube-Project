using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class PaymentGateway
{
    public int Id { get; set; }

    public string ProviderName { get; set; } = null!;

    public string? ExternalReference { get; set; }

    public virtual ICollection<PaymentMethod> PaymentMethods { get; set; } = new List<PaymentMethod>();
}
