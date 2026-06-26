using System;
using System.Collections.Generic;
using Autotube.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Autotube.Data;

public partial class AutoTubeDbContext : DbContext
{
    public AutoTubeDbContext()
    {
    }

    public AutoTubeDbContext(DbContextOptions<AutoTubeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AggregatedCounter> AggregatedCounters { get; set; }

    public virtual DbSet<AnalysisSession> AnalysisSessions { get; set; }

    public virtual DbSet<AnalyticsSnapshot> AnalyticsSnapshots { get; set; }

    public virtual DbSet<CachedTrendResult> CachedTrendResults { get; set; }

    public virtual DbSet<Channel> Channels { get; set; }

    public virtual DbSet<Script> Scripts { get; set; }

    public virtual DbSet<ContentGapAnalysis> ContentGapAnalyses { get; set; }

    public virtual DbSet<ContentGoal> ContentGoals { get; set; }

    public virtual DbSet<ContentNich> ContentNiches { get; set; }

    public virtual DbSet<Counter> Counters { get; set; }

    public virtual DbSet<DistributedLock> DistributedLocks { get; set; }

    public virtual DbSet<EfmigrationsHistory> EfmigrationsHistories { get; set; }

    public virtual DbSet<GapReport> GapReports { get; set; }

    public virtual DbSet<GeneratedContent> GeneratedContents { get; set; }

    public virtual DbSet<GeneratedThumbnail> GeneratedThumbnails { get; set; }

    public virtual DbSet<GeneratedVideo> GeneratedVideos { get; set; }

    public virtual DbSet<GeneratedVideoClip> GeneratedVideoClips { get; set; }

    public virtual DbSet<Hash> Hashes { get; set; }

    public virtual DbSet<HistoricalStatistic> HistoricalStatistics { get; set; }

    public virtual DbSet<Job> Jobs { get; set; }

    public virtual DbSet<JobParameter> JobParameters { get; set; }

    public virtual DbSet<JobQueue> JobQueues { get; set; }

    public virtual DbSet<JobState> JobStates { get; set; }

    public virtual DbSet<List> Lists { get; set; }

    public virtual DbSet<Opportunity> Opportunities { get; set; }

    public virtual DbSet<PaymentGateway> PaymentGateways { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<Server> Servers { get; set; }

    public virtual DbSet<Set> Sets { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }

    public virtual DbSet<UploadedImageThumbnail> UploadedImageThumbnails { get; set; }

    public virtual DbSet<UsageQuota> UsageQuotas { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Video> Videos { get; set; }

    public virtual DbSet<VideoAnalysis> VideoAnalyses { get; set; }

    public virtual DbSet<UserSubscription> UserSubscriptions { get; set; }

    public virtual DbSet<CreditTransaction> CreditTransactions { get; set; }

    public virtual DbSet<AllInOne> AllInOnes { get; set; }


   protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    => optionsBuilder.UseSqlServer("Server= ;Database= ;User Id= ;Password= ;TrustServerCertificate=True;");
       protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<AggregatedCounter>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("AggregatedCounter")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Key, "IX_CounterAggregated_Key").IsUnique();

            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
            entity.Property(e => e.Key).HasMaxLength(100);
        });

        modelBuilder.Entity<AnalysisSession>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GapReportId, "IX_AnalysisSessions_GapReportId");

            entity.HasIndex(e => e.SessionId, "IX_AnalysisSessions_SessionId").IsUnique();

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Notes).HasMaxLength(2000);
            entity.Property(e => e.SessionDate).HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.VideoId).HasMaxLength(32);

            entity.HasOne(d => d.GapReport).WithMany(p => p.AnalysisSessions)
                .HasForeignKey(d => d.GapReportId)
                .HasConstraintName("FK_AnalysisSessions_GapReports");
        });

        modelBuilder.Entity<AnalyticsSnapshot>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Analytics_Snapshots");

            entity.HasIndex(e => new { e.ChannelId, e.RecordedAt }, "IX_AnalyticsSnapshots_ChannelId_RecordedAt");

            entity.Property(e => e.ChannelId).HasMaxLength(64);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.RecordedAt).HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Channel).WithMany(p => p.AnalyticsSnapshots)
                .HasPrincipalKey(p => p.ChannelId)
                .HasForeignKey(d => d.ChannelId)
                .HasConstraintName("FK_AnalyticsSnapshots_Channels");
        });

        modelBuilder.Entity<CachedTrendResult>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.CacheKey, "IX_CachedTrendResults_CacheKey").IsUnique();

            entity.HasIndex(e => e.ExpiresAt, "IX_CachedTrendResults_ExpiresAt");

            entity.Property(e => e.CacheKey).HasMaxLength(500);
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.ExpiresAt).HasColumnType("datetime");
            entity.Property(e => e.Keywords).HasMaxLength(200);
            entity.Property(e => e.Region).HasMaxLength(10);
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Channel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasIndex(e => e.ChannelId, "AK_Channels_ChannelId").IsUnique();

            entity.HasIndex(e => e.OwnerUserId, "FK_Channels_Users_Owner");

            entity.Property(e => e.ChannelId).HasMaxLength(64);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ThumbnailUrl).HasMaxLength(1024);
            entity.Property(e => e.Title).HasMaxLength(256);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.OwnerUser).WithMany(p => p.Channels)
                .HasForeignKey(d => d.OwnerUserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Channels_Users_Owner");
        });

        modelBuilder.Entity<Script>(entity =>
        {
            entity.ToTable("Scripts");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Topic)
                .IsRequired()
                .HasColumnType("longtext");

            entity.Property(e => e.RawJson)
                .IsRequired()
                .HasColumnType("longtext");

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.HasIndex(e => e.GapReportId, "IX_Scripts_GapReportId");

            entity.HasOne(d => d.GapReport)
                .WithMany(p => p.Scripts)
                .HasForeignKey(d => d.GapReportId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Scripts_GapReports_GapReportId");

            entity.Property(e => e.UserId)
                .HasColumnName("User_Id");
            entity.HasOne(s => s.User)
                  .WithMany(u => u.Scripts)
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ContentGapAnalysis>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Content_Gap_Analyses");

            entity.HasIndex(e => new { e.UserId, e.CreatedAt }, "IX_ContentGapAnalyses_UserId_CreatedAt").IsDescending(false, true);

            entity.HasIndex(e => new { e.UserId, e.GapScore }, "IX_ContentGapAnalyses_UserId_GapScore").IsDescending(false, true);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CompetitionScore)
                .HasPrecision(5, 2)
                .HasColumnName("competition_score");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DemandScore)
                .HasPrecision(5, 2)
                .HasColumnName("demand_score");
            entity.Property(e => e.GapScore)
                .HasPrecision(5, 2)
                .HasColumnName("gap_score");
            entity.Property(e => e.Keyword)
                .HasMaxLength(255)
                .HasColumnName("keyword");
            entity.Property(e => e.OpportunityScore)
                .HasColumnType("double");
            entity.Property(e => e.RawMetricsJson).HasColumnName("raw_metrics_json");
            entity.Property(e => e.RecommendedAction)
                .HasMaxLength(255)
                .HasColumnName("recommended_action");
            entity.Property(e => e.TrendScore)
                .HasPrecision(5, 2)
                .HasColumnName("trend_score");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.ContentGapAnalyses)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Users_Analyses");

            entity.HasOne(c => c.GapReport)
                .WithMany(g => g.ContentGapAnalyses)
                .HasForeignKey(c => c.GapReportId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ContentGoal>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Content_Goals");

            entity.HasIndex(e => e.GoalKey, "goal_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GoalKey)
                .HasMaxLength(50)
                .HasColumnName("goal_key");
            entity.Property(e => e.GoalLabel)
                .HasMaxLength(150)
                .HasColumnName("goal_label");
        });

        modelBuilder.Entity<ContentNich>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Content_Niches");

            entity.HasIndex(e => e.NicheName, "UQ_Content_Niches_niche_name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.NicheName)
                .HasMaxLength(100)
                .HasColumnName("niche_name");
        });

        modelBuilder.Entity<Counter>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("Counter")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.Key, "IX_Counter_Key");

            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
            entity.Property(e => e.Key).HasMaxLength(100);
        });

        modelBuilder.Entity<DistributedLock>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("DistributedLock")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.Property(e => e.CreatedAt).HasMaxLength(6);
            entity.Property(e => e.Resource).HasMaxLength(100);
        });

        modelBuilder.Entity<EfmigrationsHistory>(entity =>
        {
            entity.HasKey(e => e.MigrationId).HasName("PRIMARY");

            entity.ToTable("__EFMigrationsHistory");

            entity.Property(e => e.MigrationId).HasMaxLength(150);
            entity.Property(e => e.ProductVersion).HasMaxLength(32);
        });

        modelBuilder.Entity<GapReport>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.ChannelId, "IX_GapReports_ChannelId");

            entity.HasIndex(e => e.CreatedAt, "IX_GapReports_CreatedAt");

            entity.HasIndex(e => e.VideoId, "IX_GapReports_VideoId");

            entity.Property(e => e.ChannelId).HasMaxLength(64);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.VideoId)
                .HasMaxLength(32)
                .UseCollation("utf8mb4_0900_ai_ci");
            entity.Property(e => e.VideoTitle).HasMaxLength(512);

            entity.HasOne(d => d.Video).WithMany(p => p.GapReports)
                .HasPrincipalKey(p => p.VideoId)
                .HasForeignKey(d => d.VideoId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.Property(e => e.UserId)
                 .HasColumnName("User_Id");
            entity.HasOne(g => g.User)
                      .WithMany(u => u.GapReports)
                      .HasForeignKey(g => g.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<GeneratedContent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Generated_Contents");

            entity.HasIndex(e => e.SourceGapAnalysisId, "FK_Analyses_Contents");

            entity.HasIndex(e => new { e.UserId, e.CreatedAt }, "IX_GeneratedContents_UserId_CreatedAt").IsDescending(false, true);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AiProvider)
                .HasMaxLength(100)
                .HasColumnName("ai_provider");
            entity.Property(e => e.AiProviderVersion)
                .HasMaxLength(50)
                .HasColumnName("ai_provider_version");
            entity.Property(e => e.ApprovalStatus)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Pending'")
                .HasColumnName("approval_status");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.GeneratedDescription).HasColumnName("generated_description");
            entity.Property(e => e.GeneratedScript).HasColumnName("generated_script");
            entity.Property(e => e.GeneratedTitle).HasColumnName("generated_title");
            entity.Property(e => e.PublishedStatus)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Draft'")
                .HasColumnName("published_status");
            entity.Property(e => e.SourceGapAnalysisId).HasColumnName("source_gap_analysis_id");
            entity.Property(e => e.TokensUsed).HasColumnName("tokens_used");
            entity.Property(e => e.Topic)
                .HasMaxLength(255)
                .HasColumnName("topic");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.SourceGapAnalysis).WithMany(p => p.GeneratedContents)
                .HasForeignKey(d => d.SourceGapAnalysisId)
                .HasConstraintName("FK_Analyses_Contents");

            entity.HasOne(d => d.User).WithMany(p => p.GeneratedContents)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Users_Contents");
        });

        modelBuilder.Entity<GeneratedThumbnail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Generated_Thumbnails");

            entity.HasIndex(e => e.GeneratedContentId, "FK_GeneratedThumbnails_Contents");

            entity.HasIndex(e => e.UserId, "FK_GeneratedThumbnails_Users");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AiProvider)
                .HasMaxLength(100)
                .HasColumnName("ai_provider");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DownloadCount)
                .HasDefaultValueSql("'0'")
                .HasColumnName("download_count");
            entity.Property(e => e.GeneratedContentId).HasColumnName("generated_content_id");
            entity.Property(e => e.ImagePath).HasColumnName("image_path");
            entity.Property(e => e.IsFavorite)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_favorite");
            entity.Property(e => e.Prompt)
                .HasMaxLength(2000)
                .HasColumnName("prompt");
            entity.Property(e => e.ReferenceImagePath)
                .HasMaxLength(500)
                .HasColumnName("reference_image_path");
            entity.Property(e => e.ReuseCount)
                .HasDefaultValueSql("'0'")
                .HasColumnName("reuse_count");
            entity.Property(e => e.Style)
                .HasMaxLength(100)
                .HasColumnName("style");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.GeneratedContent).WithMany(p => p.GeneratedThumbnails)
                .HasForeignKey(d => d.GeneratedContentId)
                .HasConstraintName("FK_GeneratedThumbnails_Contents");

            entity.HasOne(d => d.User).WithMany(p => p.GeneratedThumbnails)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_GeneratedThumbnails_Users");
        });

        modelBuilder.Entity<GeneratedVideo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Generated_Videos");

            entity.HasIndex(e => e.GeneratedContentId, "FK_Videos_Contents");

            entity.HasIndex(e => e.GenerationStatus, "IX_GeneratedVideos_Status");

            entity.HasIndex(e => new { e.UserId, e.CreatedAt }, "IX_GeneratedVideos_UserId_CreatedAt").IsDescending(false, true);

            entity.HasIndex(e => e.ProviderTaskId, "UX_GeneratedVideos_TaskId").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AspectRatio)
                .HasMaxLength(20)
                .HasColumnName("aspect_ratio");
            entity.Property(e => e.ClipCount)
                .HasDefaultValueSql("'1'")
                .HasColumnName("clip_count");
            entity.Property(e => e.CompletedAt)
                .HasColumnType("datetime")
                .HasColumnName("completed_at");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.CreditsUsed)
                .HasDefaultValueSql("'0'")
                .HasColumnName("credits_used");
            entity.Property(e => e.DurationSeconds).HasColumnName("duration_seconds");
            entity.Property(e => e.EnhancedPrompt).HasColumnName("enhanced_prompt");
            entity.Property(e => e.ErrorMessage).HasColumnName("error_message");
            entity.Property(e => e.GeneratedContentId).HasColumnName("generated_content_id");
            entity.Property(e => e.GeneratedVideoUrl).HasColumnName("generated_video_url");
            entity.Property(e => e.GenerationMode)
                .HasMaxLength(50)
                .HasDefaultValueSql("'text_to_video'")
                .HasColumnName("generation_mode");
            entity.Property(e => e.GenerationStatus)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Pending'")
                .HasColumnName("generation_status");
            entity.Property(e => e.IsMerged)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_merged");
            entity.Property(e => e.Prompt).HasColumnName("prompt");
            entity.Property(e => e.ProviderModel)
                .HasMaxLength(100)
                .HasDefaultValueSql("'seedance'")
                .HasColumnName("provider_model");
            entity.Property(e => e.ProviderName)
                .HasMaxLength(100)
                .HasDefaultValueSql("'piapi'")
                .HasColumnName("provider_name");
            entity.Property(e => e.ProviderTaskId).HasColumnName("provider_task_id");
            entity.Property(e => e.StartedAt)
                .HasColumnType("datetime")
                .HasColumnName("started_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.VideoStyle)
                .HasMaxLength(50)
                .HasColumnName("video_style");
            entity.Property(e => e.VoiceTone)
                .HasMaxLength(50)
                .HasColumnName("voice_tone");

            entity.HasOne(d => d.GeneratedContent).WithMany(p => p.GeneratedVideos)
                .HasForeignKey(d => d.GeneratedContentId)
                .HasConstraintName("FK_Videos_Contents");

            entity.HasOne(d => d.User).WithMany(p => p.GeneratedVideos)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Videos_Users");
        });

        modelBuilder.Entity<GeneratedVideoClip>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Generated_Video_Clips");

            entity.HasIndex(e => e.GeneratedVideoId, "IX_GeneratedVideoClips_VideoId");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ClipOrder).HasColumnName("clip_order");
            entity.Property(e => e.ClipVideoUrl).HasColumnName("clip_video_url");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.GeneratedVideoId).HasColumnName("generated_video_id");
            entity.Property(e => e.GenerationStatus)
                .HasMaxLength(50)
                .HasColumnName("generation_status");
            entity.Property(e => e.ProviderTaskId)
                .HasMaxLength(255)
                .HasColumnName("provider_task_id");

            entity.HasOne(d => d.GeneratedVideo).WithMany(p => p.GeneratedVideoClips)
                .HasForeignKey(d => d.GeneratedVideoId)
                .HasConstraintName("FK_VideoClips_Videos");
        });

        modelBuilder.Entity<Hash>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("Hash")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => new { e.Key, e.Field }, "IX_Hash_Key_Field").IsUnique();

            entity.Property(e => e.ExpireAt).HasMaxLength(6);
            entity.Property(e => e.Field).HasMaxLength(40);
            entity.Property(e => e.Key).HasMaxLength(100);
        });

        modelBuilder.Entity<HistoricalStatistic>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Historical_Statistics");

            entity.HasIndex(e => e.ChannelId, "IX_HistoricalStatistics_ChannelId");

            entity.HasIndex(e => new { e.ChannelId, e.Date }, "IX_HistoricalStatistics_ChannelId_Date").IsUnique();

            entity.Property(e => e.ChannelId).HasMaxLength(64);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Channel).WithMany(p => p.HistoricalStatistics)
                .HasPrincipalKey(p => p.ChannelId)
                .HasForeignKey(d => d.ChannelId)
                .HasConstraintName("FK_HistoricalStatistics_Channels");
        });

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("Job")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.StateName, "IX_Job_StateName");

            entity.Property(e => e.CreatedAt).HasMaxLength(6);
            entity.Property(e => e.ExpireAt).HasMaxLength(6);
            entity.Property(e => e.StateName).HasMaxLength(20);
        });

        modelBuilder.Entity<JobParameter>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("JobParameter")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.JobId, "FK_JobParameter_Job");

            entity.HasIndex(e => new { e.JobId, e.Name }, "IX_JobParameter_JobId_Name").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(40);

            entity.HasOne(d => d.Job).WithMany(p => p.JobParameters)
                .HasForeignKey(d => d.JobId)
                .HasConstraintName("FK_JobParameter_Job");
        });

        modelBuilder.Entity<JobQueue>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("JobQueue")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => new { e.Queue, e.FetchedAt }, "IX_JobQueue_QueueAndFetchedAt");

            entity.Property(e => e.FetchToken).HasMaxLength(36);
            entity.Property(e => e.FetchedAt).HasMaxLength(6);
            entity.Property(e => e.Queue).HasMaxLength(50);
        });

        modelBuilder.Entity<JobState>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("JobState")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.JobId, "FK_JobState_Job");

            entity.Property(e => e.CreatedAt).HasMaxLength(6);
            entity.Property(e => e.Name).HasMaxLength(20);
            entity.Property(e => e.Reason).HasMaxLength(100);

            entity.HasOne(d => d.Job).WithMany(p => p.JobStates)
                .HasForeignKey(d => d.JobId)
                .HasConstraintName("FK_JobState_Job");
        });

        modelBuilder.Entity<List>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("List")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.Property(e => e.ExpireAt).HasMaxLength(6);
            entity.Property(e => e.Key).HasMaxLength(100);
        });

        modelBuilder.Entity<Opportunity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GapScore, "IX_Opportunities_GapScore");

            entity.HasIndex(e => e.Keyword, "IX_Opportunities_Keyword");

            entity.HasIndex(e => new { e.Region, e.Category }, "IX_Opportunities_Region_Category");

            entity.Property(e => e.AnalyzedAt).HasColumnType("datetime");
            entity.Property(e => e.Category).HasMaxLength(128);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Keyword).HasMaxLength(256);
            entity.Property(e => e.Region).HasMaxLength(10);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<PaymentGateway>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Payment_Gateways");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ExternalReference)
                .HasMaxLength(255)
                .HasColumnName("external_reference");
            entity.Property(e => e.ProviderName)
                .HasMaxLength(100)
                .HasColumnName("provider_name");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Payment_methods");

            entity.HasIndex(e => e.PaymentGatewayId, "FK_Payment_Gateways");

            entity.HasIndex(e => e.UserId, "FK_Users_Payment");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CardHolderName)
                .HasMaxLength(100)
                .HasColumnName("card_holder_name");
            entity.Property(e => e.CardLast4)
                .HasMaxLength(4)
                .HasColumnName("card_last4");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ExpiryDate)
                .HasMaxLength(5)
                .HasColumnName("expiry_date");
            entity.Property(e => e.PaymentGatewayId).HasColumnName("payment_gateway_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.PaymentGateway).WithMany(p => p.PaymentMethods)
                .HasForeignKey(d => d.PaymentGatewayId)
                .HasConstraintName("FK_Payment_Gateways");

            entity.HasOne(d => d.User).WithMany(p => p.PaymentMethods)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Users_Payment");
        });

        modelBuilder.Entity<Server>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("Server")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.Property(e => e.Id).HasMaxLength(100);
            entity.Property(e => e.LastHeartbeat).HasMaxLength(6);
        });

        modelBuilder.Entity<Set>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("Set")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => new { e.Key, e.Value }, "IX_Set_Key_Value").IsUnique();

            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Value).HasMaxLength(256);
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("State")
                .HasCharSet("utf8mb3")
                .UseCollation("utf8mb3_general_ci");

            entity.HasIndex(e => e.JobId, "FK_HangFire_State_Job");

            entity.Property(e => e.CreatedAt).HasMaxLength(6);
            entity.Property(e => e.Name).HasMaxLength(20);
            entity.Property(e => e.Reason).HasMaxLength(100);

            entity.HasOne(d => d.Job).WithMany(p => p.States)
                .HasForeignKey(d => d.JobId)
                .HasConstraintName("FK_HangFire_State_Job");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasIndex(e => e.PaymentMethodId, "FK_Payment_methods_Subscriptions");

            entity.HasIndex(e => e.SubscriptionPlanId, "FK_SubscriptionPlans_Subscriptions");

            entity.HasIndex(e => e.UserId, "FK_Users_Subscriptions");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.EndDate)
                .HasColumnType("datetime")
                .HasColumnName("end_date");
            entity.Property(e => e.PaymentMethodId).HasColumnName("Payment_method_id");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Active'")
                .HasColumnName("status");
            entity.Property(e => e.SubscriptionPlanId).HasColumnName("subscription_plan_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("FK_Payment_methods_Subscriptions");

            entity.HasOne(d => d.SubscriptionPlan).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.SubscriptionPlanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SubscriptionPlans_Subscriptions");

            entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Users_Subscriptions");
        });

        modelBuilder.Entity<SubscriptionPlan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Subscription_Plans");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AnalysesLimit).HasColumnName("analyses_limit");
            entity.Property(e => e.BillingCycle)
                .HasMaxLength(20)
                .HasColumnName("billing_cycle");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.HasAdvancedScripts).HasColumnName("has_advanced_scripts");
            entity.Property(e => e.HasPrioritySupport).HasColumnName("has_priority_support");
            entity.Property(e => e.IsPopular).HasColumnName("is_popular");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.VideoPacks).HasColumnName("video_packs");
        });

        modelBuilder.Entity<UploadedImageThumbnail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Uploaded_Image_Thumbnails");

            entity.HasIndex(e => e.GeneratedContentId, "FK_UploadedImageThumbnails_Contents");

            entity.HasIndex(e => e.UserId, "FK_UploadedImageThumbnails_Users");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AiProvider)
                .HasMaxLength(100)
                .HasColumnName("ai_provider");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DownloadCount)
                .HasDefaultValueSql("'0'")
                .HasColumnName("download_count");
            entity.Property(e => e.GeneratedContentId).HasColumnName("generated_content_id");
            entity.Property(e => e.GeneratedImagePath)
                .HasMaxLength(500)
                .HasColumnName("generated_image_path");
            entity.Property(e => e.OriginalImagePath)
                .HasMaxLength(500)
                .HasColumnName("original_image_path");
            entity.Property(e => e.Prompt).HasColumnName("prompt");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.GeneratedContent).WithMany(p => p.UploadedImageThumbnails)
                .HasForeignKey(d => d.GeneratedContentId)
                .HasConstraintName("FK_UploadedImageThumbnails_Contents");

            entity.HasOne(d => d.User).WithMany(p => p.UploadedImageThumbnails)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_UploadedImageThumbnails_Users");
        });

        modelBuilder.Entity<UsageQuota>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Usage_Quotas");

            entity.HasIndex(e => e.UserId, "UQ_Usage_Quotas_user_id").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ContentGenerationsUsed).HasColumnName("content_generations_used");
            entity.Property(e => e.GapAnalysesUsed).HasColumnName("gap_analyses_used");
            entity.Property(e => e.MaxQuota)
                .HasDefaultValueSql("'50'")
                .HasColumnName("max_quota");
            entity.Property(e => e.PeriodEnd)
                .HasColumnType("datetime")
                .HasColumnName("period_end");
            entity.Property(e => e.PeriodStart)
                .HasColumnType("datetime")
                .HasColumnName("period_start");
            entity.Property(e => e.ScriptGenerationsUsed).HasColumnName("script_generations_used");
            entity.Property(e => e.ThumbnailOptimizationsUsed).HasColumnName("thumbnail_optimizations_used");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.VideoGenerationsUsed).HasColumnName("video_generations_used");

            entity.HasOne(d => d.User).WithOne(p => p.UsageQuota)
                .HasForeignKey<UsageQuota>(d => d.UserId)
                .HasConstraintName("FK_Users_Quotas");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasIndex(e => e.Email, "UQ_Users_email").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AuthProvider)
                .HasMaxLength(50)
                .HasDefaultValueSql("'local'")
                .HasColumnName("auth_provider");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.EmailVerified).HasColumnName("email_verified");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.GoogleId)
                .HasMaxLength(255)
                .HasColumnName("google_id");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("'1'")
                .HasColumnName("is_active");
            entity.Property(e => e.LastLoginAt)
                .HasColumnType("datetime")
                .HasColumnName("last_login_at");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(500)
                .HasColumnName("password_hash");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .HasColumnName("phone_number");
            entity.Property(e => e.ProfileImageUrl)
                .HasMaxLength(500)
                .HasColumnName("profile_image_url");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasDefaultValueSql("'User'")
                .HasColumnName("role");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasMany(d => d.Goals).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserGoal",
                    r => r.HasOne<ContentGoal>().WithMany()
                        .HasForeignKey("GoalId")
                        .HasConstraintName("FK_UserGoals_Goals"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK_UserGoals_Users"),
                    j =>
                    {
                        j.HasKey("UserId", "GoalId")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("User_Goals");
                        j.HasIndex(new[] { "GoalId" }, "FK_UserGoals_Goals");
                        j.IndexerProperty<int>("UserId").HasColumnName("user_id");
                        j.IndexerProperty<int>("GoalId").HasColumnName("goal_id");
                    });

            entity.HasMany(d => d.Niches).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserNich",
                    r => r.HasOne<ContentNich>().WithMany()
                        .HasForeignKey("NicheId")
                        .HasConstraintName("FK_UserNiches_Niches"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK_UserNiches_Users"),
                    j =>
                    {
                        j.HasKey("UserId", "NicheId")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("User_Niches");
                        j.HasIndex(new[] { "NicheId" }, "FK_UserNiches_Niches");
                        j.HasIndex(new[] { "UserId" }, "IX_UserNiches_UserId");
                        j.IndexerProperty<int>("UserId").HasColumnName("user_id");
                        j.IndexerProperty<int>("NicheId").HasColumnName("niche_id");
                    });
        });

        modelBuilder.Entity<Video>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasIndex(e => e.ChannelId, "IX_Videos_ChannelId");

            entity.HasIndex(e => new { e.ChannelId, e.ViewCount }, "IX_Videos_ChannelId_ViewCount");

            entity.HasIndex(e => e.VideoId, "IX_Videos_VideoId").IsUnique();

            entity.Property(e => e.Category).HasMaxLength(128);
            entity.Property(e => e.ChannelId).HasMaxLength(64);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.PublishedAt).HasColumnType("datetime");
            entity.Property(e => e.ThumbnailUrl).HasMaxLength(1024);
            entity.Property(e => e.Title).HasMaxLength(512);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.VideoId).HasMaxLength(32);

            entity.Property(e => e.CompetitionScore).HasColumnType("double");
            entity.Property(e => e.DemandScore).HasColumnType("double");
            entity.Property(e => e.GapScore).HasColumnType("double");
            entity.Property(e => e.TrendScore).HasColumnType("double");

            entity.HasOne(d => d.Channel).WithMany(p => p.Videos)
                .HasPrincipalKey(p => p.ChannelId)
                .HasForeignKey(d => d.ChannelId)
                .HasConstraintName("FK_Videos_Channels");
        });

        modelBuilder.Entity<VideoAnalysis>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CreatedAt).HasMaxLength(6);
        });

        modelBuilder.Entity<Autotube.Models.UserSubscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("User_Subscriptions");

            entity.HasIndex(e => e.UserId, "IX_UserSubscriptions_UserId");

            entity.Property(e => e.PlanType)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.RenewalDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");

            entity.HasOne(d => d.User).WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_UserSubscriptions_Users");
        });

        modelBuilder.Entity<Autotube.Models.CreditTransaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("Credit_Transactions");

            entity.HasIndex(e => new { e.UserId, e.CreatedAt }, "IX_CreditTransactions_UserId_CreatedAt")
                .IsDescending(false, true);

            entity.Property(e => e.TransactionType)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(e => e.FeatureType)
                .HasConversion<string>()
                .HasMaxLength(30);

            entity.Property(e => e.Description).HasMaxLength(255);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("utc_timestamp()")
                .HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_CreditTransactions_Users");
        });

        modelBuilder.Entity<AllInOne>(entity =>
        {
            entity.ToTable("All_In_Ones");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId)
                  .HasColumnName("User_Id");

            entity.Property(e => e.ScriptId)
                  .HasColumnName("ScriptId");

            entity.Property(e => e.Prompt);

            entity.Property(e => e.voice_tone)
                  .HasColumnName("voice_tone");

            entity.Property(e => e.video_style)
                  .HasColumnName("video_style");

            entity.Property(e => e.ThumbnailPrompt)
                  .HasColumnName("Thumbnail_Prompt");

            entity.Property(e => e.ImagePath)
                  .HasColumnName("Image_Path");

            entity.Property(e => e.ImageProvider)
                  .HasColumnName("Image_Provider");

            entity.Property(e => e.VideoPrompt)
                  .HasColumnName("Video_Prompt");

            entity.Property(e => e.PiApiTaskId)
                  .HasColumnName("PiApi_Task_Id");

            entity.Property(e => e.VideoPath)
                  .HasColumnName("Video_Path");

            entity.Property(e => e.ErrorMessage)
                  .HasColumnName("Error_Message");

            entity.Property(e => e.CreatedAt)
                  .HasColumnName("Created_at");

            entity.Property(e => e.UpdatedAt)
                  .HasColumnName("Updated_at");

            entity.Property(e => e.Status)
                  .HasDefaultValue("Pending");

            entity.HasOne(e => e.User)
                  .WithMany(u => u.AllInOne)
                  .HasForeignKey(e => e.UserId);

            entity.HasOne(e => e.Script)
                  .WithMany(s => s.AllInOne)
                  .HasForeignKey(e => e.ScriptId);
        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
