using Autotube.DTOs.Billing.Enums;

namespace Autotube.Models
{
    public class UserSubscription
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public PlanType PlanType { get; set; }

        public int CreditsGranted { get; set; }

        public int CreditsRemaining { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime RenewalDate { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
