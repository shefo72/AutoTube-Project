using Autotube.DTOs.Billing.Enums;

namespace Autotube.Models
{
    public class CreditTransaction
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int Credits { get; set; }

        public TransactionType TransactionType { get; set; }

        public CreditFeature FeatureType { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
