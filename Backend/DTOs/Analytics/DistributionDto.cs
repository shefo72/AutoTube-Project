namespace Autotube.DTOs.Analytics
{
    public record DistributionDto
    {
        public string Label { get; init; } = string.Empty;
        public long Value { get; init; }
    }
}
