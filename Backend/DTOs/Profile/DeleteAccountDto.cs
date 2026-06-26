namespace AutoTubeAPI.DTOs.Profile
{
    public class DeleteAccountDto
    {
        public string? Password { get; set; }

        public string ConfirmationText { get; set; } = string.Empty; // must equal "DELETE"
    }
}