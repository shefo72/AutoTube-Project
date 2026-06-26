namespace Autotube.DTOs.PaymentP
{
    public class CreateSubscriptionDto
    {
        public int SubscriptionPlanId { get; set; }

        public int PaymentGatewayId { get; set; }

        public string CardHolderName { get; set; } = null!;

        public string CardNumber { get; set; } = null!;

        public string ExpiryDate { get; set; } = null!;
    }
}
