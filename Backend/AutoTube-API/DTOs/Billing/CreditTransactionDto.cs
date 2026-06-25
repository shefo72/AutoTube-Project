namespace Autotube.DTOs.Billing
{
    public class CreditTransactionDto
    {
        public int Id { get; set; }

        public int Credits { get; set; }

        public string TransactionType { get; set; } = null!;

        public string FeatureType { get; set; } = null!;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
