namespace Autotube.Exceptions
{
    public class InsufficientCreditsException : Exception
    {
        public int RequiredCredits { get; }

        public int RemainingCredits { get; }

        public InsufficientCreditsException(int requiredCredits, int remainingCredits)
            : base("Insufficient credits.")
        {
            RequiredCredits = requiredCredits;
            RemainingCredits = remainingCredits;
        }
    }
}
