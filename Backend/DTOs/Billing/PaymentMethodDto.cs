namespace Autotube.DTOs.BillingUsageP
{
    public class PaymentMethodDto
    {
        public int Id { get; set; }

        public string CardHolderName { get; set; } = null!;

        public string CardLast4 { get; set; } = null!;

        public string ExpiryDate { get; set; } = null!;

        public string? PaymentProvider { get; set; }
    }
}
