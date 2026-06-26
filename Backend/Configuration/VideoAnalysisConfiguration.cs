using Autotube.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace Autotube.Configuration
{
    public class VideoAnalysisConfiguration : IEntityTypeConfiguration<VideoAnalysis>
    {
        public void Configure(EntityTypeBuilder<VideoAnalysis> builder)
        {
            builder.ToTable("VideoAnalyses");
            builder.HasKey(v => v.Id);

            builder.Property(v => v.OpportunityScore).IsRequired();

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var listConverter = new ValueConverter<List<string>, string>(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<List<string>>(v, options) ?? new List<string>()
            );

            builder.Property(v => v.ContentGaps).HasConversion(listConverter);
            builder.Property(v => v.AudiencePainPoints).HasConversion(listConverter);
            builder.Property(v => v.MissedOpportunities).HasConversion(listConverter);
            builder.Property(v => v.Weaknesses).HasConversion(listConverter);
            builder.Property(v => v.Strengths).HasConversion(listConverter);
            builder.Property(v => v.SeoRecommendations).HasConversion(listConverter);
            builder.Property(v => v.CtrOptimizationSuggestions).HasConversion(listConverter);
            builder.Property(v => v.HookImprovements).HasConversion(listConverter);
            builder.Property(v => v.RetentionImprovements).HasConversion(listConverter);
        }
    }
}
