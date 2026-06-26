namespace Autotube.DTOs.BillingUsageP
{
    public class SubscriptionDto
    {
        public int SubscriptionId { get; set; }

        public string PlanName { get; set; } = null!;

        public string BillingCycle { get; set; } = null!;

        public decimal Price { get; set; }

        public string Status { get; set; } = null!;

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
