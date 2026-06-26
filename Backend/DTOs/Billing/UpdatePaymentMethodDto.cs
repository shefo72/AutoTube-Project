namespace Autotube.DTOs.BillingUsageP
{
    public class UpdatePaymentMethodDto
    {
        public string CardHolderName { get; set; } = null!;

        public string CardNumber { get; set; } = null!;

        public string ExpiryDate { get; set; } = null!;

    }
}
