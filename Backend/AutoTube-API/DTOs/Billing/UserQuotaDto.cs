namespace Autotube.DTOs.Billing
{
    public class UserQuotaDto
    {
        public string Plan { get; set; } = null!;

        public int CreditsGranted { get; set; }

        public int CreditsRemaining { get; set; }

        public DateTime RenewalDate { get; set; }
    }

}
