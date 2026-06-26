-- ============================================================
-- Users
-- ============================================================
CREATE TABLE Users (
    id                INT IDENTITY(1,1)  NOT NULL,
    full_name         NVARCHAR(150)      NOT NULL,
    password_hash     NVARCHAR(500)      NULL,
    email             NVARCHAR(255)      NOT NULL,
    email_verified    BIT                NOT NULL DEFAULT 0,
    role              NVARCHAR(50)       NOT NULL DEFAULT 'User',
    date_of_birth     DATE               NULL,
    profile_image_url NVARCHAR(500)      NULL,
    phone_number      NVARCHAR(20)       NULL,
    google_id         NVARCHAR(255)      NULL,
    auth_provider     NVARCHAR(50)       NOT NULL DEFAULT 'local',
    is_active         BIT                NOT NULL DEFAULT 1,
    created_at        DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    updated_at        DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    last_login_at     DATETIME2          NULL,
    CONSTRAINT PK_Users             PRIMARY KEY (id),
    CONSTRAINT UQ_Users_email       UNIQUE (email),
    CONSTRAINT CHK_Users_role       CHECK (role IN ('Admin', 'User'))
);
GO

-- ============================================================
-- Content_Niches
-- ============================================================
CREATE TABLE Content_Niches (
    id         INT IDENTITY(1,1) NOT NULL,
    niche_name NVARCHAR(100)     NOT NULL,
    CONSTRAINT PK_Content_Niches            PRIMARY KEY (id),
    CONSTRAINT UQ_Content_Niches_niche_name UNIQUE (niche_name)
);
GO

INSERT INTO Content_Niches (niche_name) VALUES
    ('Coding'), ('Tech Reviews'), ('Gaming'), ('Education'),
    ('Business & Finance'), ('Podcasts'), ('Cooking'), ('Fitness'),
    ('Football'), ('Vlogs'), ('Marketing'), ('Storytelling'),
    ('Entertainment'), ('Lifestyle'), ('Music');
GO

-- ============================================================
-- Content_Goals
-- ============================================================
CREATE TABLE Content_Goals (
    id         INT IDENTITY(1,1) NOT NULL,
    goal_key   NVARCHAR(50)      NOT NULL,
    goal_label NVARCHAR(150)     NOT NULL,
    CONSTRAINT PK_Content_Goals          PRIMARY KEY (id),
    CONSTRAINT UQ_Content_Goals_goal_key UNIQUE (goal_key)
);
GO

INSERT INTO Content_Goals (goal_key, goal_label) VALUES
    ('grow',    'Grow subscribers faster'),
    ('content', 'Find content ideas faster'),
    ('scripts', 'Write better scripts'),
    ('seo',     'Improve SEO & rankings'),
    ('thumbs',  'Better thumbnails'),
    ('gaps',    'Discover content gaps');
GO

-- ============================================================
-- Subscription_Plans
-- ============================================================
CREATE TABLE Subscription_Plans (
    id                   INT IDENTITY(1,1) NOT NULL,
    name                 NVARCHAR(100)     NOT NULL,
    billing_cycle        NVARCHAR(20)      NOT NULL,
    price                DECIMAL(10,2)     NOT NULL,
    analyses_limit       INT               NOT NULL,
    video_packs          INT               NOT NULL,
    has_advanced_scripts BIT               NOT NULL,
    has_priority_support BIT               NOT NULL,
    is_popular           BIT               NOT NULL DEFAULT 0,
    created_at           DATETIME2         NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_Subscription_Plans PRIMARY KEY (id)
);
GO

-- ============================================================
-- Channels
-- ============================================================
CREATE TABLE Channels (
    Id              INT IDENTITY(1,1) NOT NULL,
    ChannelId       NVARCHAR(64)      NOT NULL,
    Title           NVARCHAR(256)     NOT NULL,
    Description     NVARCHAR(MAX)     NOT NULL,
    ThumbnailUrl    NVARCHAR(1024)    NOT NULL,
    SubscriberCount BIGINT            NOT NULL,
    TotalViews      BIGINT            NOT NULL,
    VideoCount      BIGINT            NOT NULL,
    CreatedAt       DATETIME2         NOT NULL,
    UpdatedAt       DATETIME2         NOT NULL,
    IsDeleted       BIT               NOT NULL,
    OwnerUserId     INT               NULL,
    CONSTRAINT PK_Channels             PRIMARY KEY (Id),
    CONSTRAINT UQ_Channels_ChannelId   UNIQUE (ChannelId),
    CONSTRAINT FK_Channels_Users_Owner FOREIGN KEY (OwnerUserId) REFERENCES Users (id) ON DELETE CASCADE
);
GO

-- ============================================================
-- Videos
-- ============================================================
CREATE TABLE Videos (
    Id                  INT IDENTITY(1,1) NOT NULL,
    VideoId             NVARCHAR(32)      NOT NULL,
    ChannelId           NVARCHAR(64)      NOT NULL,
    Title               NVARCHAR(512)     NOT NULL,
    Description         NVARCHAR(MAX)     NOT NULL,
    ThumbnailUrl        NVARCHAR(1024)    NOT NULL,
    ViewCount           BIGINT            NOT NULL,
    LikeCount           BIGINT            NOT NULL,
    CommentCount        BIGINT            NOT NULL,
    WatchTimeMinutes    BIGINT            NOT NULL,
    ClickThroughRate    FLOAT             NOT NULL,
    AverageViewDuration FLOAT             NOT NULL,
    PublishedAt         DATETIME2         NOT NULL,
    Category            NVARCHAR(128)     NULL,
    CreatedAt           DATETIME2         NOT NULL,
    UpdatedAt           DATETIME2         NOT NULL,
    IsDeleted           BIT               NOT NULL,
    CompetitionScore    FLOAT             NOT NULL DEFAULT 0,
    DemandScore         FLOAT             NOT NULL DEFAULT 0,
    GapScore            FLOAT             NOT NULL DEFAULT 0,
    TrendScore          FLOAT             NOT NULL DEFAULT 0,
    CONSTRAINT PK_Videos          PRIMARY KEY (Id),
    CONSTRAINT UQ_Videos_VideoId  UNIQUE (VideoId),
    CONSTRAINT FK_Videos_Channels FOREIGN KEY (ChannelId) REFERENCES Channels (ChannelId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Videos_ChannelId_ViewCount ON Videos (ChannelId, ViewCount);
CREATE INDEX IX_Videos_ChannelId           ON Videos (ChannelId);
CREATE INDEX IX_Videos_VideoId             ON Videos (VideoId);
GO

-- ============================================================
-- GapReports
-- ============================================================
CREATE TABLE GapReports (
    Id                          INT IDENTITY(1,1) NOT NULL,
    ChannelId                   NVARCHAR(64)      NOT NULL,
    VideoId                     NVARCHAR(32)      NOT NULL,
    VideoTitle                  NVARCHAR(512)     NOT NULL,
    CompetitionDifficulty       FLOAT             NOT NULL,
    OpportunityScore            FLOAT             NOT NULL,
    TrendGrowth                 FLOAT             NOT NULL,
    StrengthsJson               NVARCHAR(MAX)     NOT NULL,
    WeaknessesJson              NVARCHAR(MAX)     NOT NULL,
    ContentGapsJson             NVARCHAR(MAX)     NOT NULL,
    MissedOpportunitiesJson     NVARCHAR(MAX)     NOT NULL,
    AudiencePainPointsJson      NVARCHAR(MAX)     NOT NULL,
    HookImprovementsJson        NVARCHAR(MAX)     NOT NULL,
    RetentionImprovementsJson   NVARCHAR(MAX)     NOT NULL,
    SeoRecommendationsJson      NVARCHAR(MAX)     NOT NULL,
    CtrOptimizationSuggestionsJson NVARCHAR(MAX)  NOT NULL,
    ViralPotentialAnalysis      NVARCHAR(MAX)     NOT NULL,
    RawAiResponse               NVARCHAR(MAX)     NOT NULL,
    Status                      INT               NOT NULL,
    CreatedAt                   DATETIME2         NOT NULL,
    UpdatedAt                   DATETIME2         NOT NULL,
    IsDeleted                   BIT               NOT NULL DEFAULT 0,
    User_Id                     INT               NOT NULL,
    CONSTRAINT PK_GapReports                PRIMARY KEY (Id),
    CONSTRAINT FK_GapReports_Users          FOREIGN KEY (User_Id)  REFERENCES Users  (id)      ON DELETE CASCADE,
    CONSTRAINT FK_GapReports_Videos_VideoId FOREIGN KEY (VideoId)  REFERENCES Videos (VideoId)
);
GO

CREATE INDEX IX_GapReports_ChannelId ON GapReports (ChannelId);
CREATE INDEX IX_GapReports_CreatedAt ON GapReports (CreatedAt);
CREATE INDEX IX_GapReports_VideoId   ON GapReports (VideoId);
GO

-- ============================================================
-- AnalysisSessions
-- ============================================================
CREATE TABLE AnalysisSessions (
    Id          INT IDENTITY(1,1) NOT NULL,
    GapReportId INT               NOT NULL,
    VideoId     NVARCHAR(32)      NOT NULL,
    SessionId   CHAR(36)          NOT NULL,
    SessionDate DATETIME2         NOT NULL,
    ContextJson NVARCHAR(MAX)     NOT NULL,
    Notes       NVARCHAR(2000)    NOT NULL,
    CreatedAt   DATETIME2         NOT NULL,
    UpdatedAt   DATETIME2         NOT NULL,
    IsDeleted   BIT               NOT NULL DEFAULT 0,
    CONSTRAINT PK_AnalysisSessions           PRIMARY KEY (Id),
    CONSTRAINT UQ_AnalysisSessions_SessionId UNIQUE (SessionId),
    CONSTRAINT FK_AnalysisSessions_GapReports FOREIGN KEY (GapReportId) REFERENCES GapReports (Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_AnalysisSessions_GapReportId ON AnalysisSessions (GapReportId);
GO

-- ============================================================
-- Opportunities
-- ============================================================
CREATE TABLE Opportunities (
    Id                  INT IDENTITY(1,1) NOT NULL,
    Keyword             NVARCHAR(256)     NOT NULL,
    Category            NVARCHAR(128)     NOT NULL,
    Region              NVARCHAR(10)      NOT NULL,
    GapScore            FLOAT             NOT NULL,
    DemandScore         FLOAT             NOT NULL,
    CompetitionScore    FLOAT             NOT NULL,
    TrendScore          FLOAT             NOT NULL,
    Difficulty          INT               NOT NULL,
    SearchVolume        BIGINT            NOT NULL,
    AvgViews            BIGINT            NOT NULL,
    OpportunityTagsJson NVARCHAR(MAX)     NOT NULL,
    AnalyzedAt          DATETIME2         NOT NULL,
    CreatedAt           DATETIME2         NOT NULL,
    UpdatedAt           DATETIME2         NOT NULL,
    IsDeleted           BIT               NOT NULL DEFAULT 0,
    CONSTRAINT PK_Opportunities PRIMARY KEY (Id)
);
GO

CREATE INDEX IX_Opportunities_GapScore         ON Opportunities (GapScore);
CREATE INDEX IX_Opportunities_Keyword          ON Opportunities (Keyword);
CREATE INDEX IX_Opportunities_Region_Category  ON Opportunities (Region, Category);
GO

-- ============================================================
-- CachedTrendResults
-- ============================================================
CREATE TABLE CachedTrendResults (
    Id         INT IDENTITY(1,1) NOT NULL,
    CacheKey   NVARCHAR(500)     NOT NULL,
    Region     NVARCHAR(10)      NULL DEFAULT '',
    Category   NVARCHAR(50)      NULL DEFAULT '',
    Keywords   NVARCHAR(200)     NULL DEFAULT '',
    ResultJson NVARCHAR(MAX)     NOT NULL,
    ExpiresAt  DATETIME2         NOT NULL,
    HitCount   INT               NOT NULL DEFAULT 0,
    CreatedAt  DATETIME2         NOT NULL DEFAULT GETDATE(),
    UpdatedAt  DATETIME2         NOT NULL DEFAULT GETDATE(),
    IsDeleted  BIT               NOT NULL DEFAULT 0,
    CONSTRAINT PK_CachedTrendResults          PRIMARY KEY (Id),
    CONSTRAINT UQ_CachedTrendResults_CacheKey UNIQUE (CacheKey)
);
GO

CREATE INDEX IX_CachedTrendResults_ExpiresAt ON CachedTrendResults (ExpiresAt);
GO

-- ============================================================
-- Analytics_Snapshots
-- ============================================================
CREATE TABLE Analytics_Snapshots (
    Id                  INT IDENTITY(1,1) NOT NULL,
    ChannelId           NVARCHAR(64)      NOT NULL,
    SubscriberCount     BIGINT            NOT NULL,
    TotalViews          BIGINT            NOT NULL,
    WatchTimeMinutes    BIGINT            NOT NULL,
    AvgEngagementRate   FLOAT             NOT NULL,
    AvgClickThroughRate FLOAT             NOT NULL,
    NewSubscribers      BIGINT            NOT NULL,
    NewViews            BIGINT            NOT NULL,
    RecordedAt          DATETIME2         NOT NULL,
    CreatedAt           DATETIME2         NOT NULL,
    UpdatedAt           DATETIME2         NOT NULL,
    IsDeleted           BIT               NOT NULL,
    CONSTRAINT PK_Analytics_Snapshots         PRIMARY KEY (Id),
    CONSTRAINT FK_AnalyticsSnapshots_Channels FOREIGN KEY (ChannelId) REFERENCES Channels (ChannelId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_AnalyticsSnapshots_ChannelId_RecordedAt ON Analytics_Snapshots (ChannelId, RecordedAt);
GO

-- ============================================================
-- Historical_Statistics
-- ============================================================
CREATE TABLE Historical_Statistics (
    Id               INT IDENTITY(1,1) NOT NULL,
    ChannelId        NVARCHAR(64)      NOT NULL,
    Date             DATETIME2         NOT NULL,
    Views            BIGINT            NOT NULL DEFAULT 0,
    Subscribers      BIGINT            NOT NULL DEFAULT 0,
    WatchTimeMinutes BIGINT            NOT NULL DEFAULT 0,
    EngagementRate   FLOAT             NOT NULL DEFAULT 0,
    ClickThroughRate FLOAT             NOT NULL DEFAULT 0,
    CreatedAt        DATETIME2         NOT NULL,
    UpdatedAt        DATETIME2         NOT NULL,
    IsDeleted        BIT               NOT NULL DEFAULT 0,
    CONSTRAINT PK_Historical_Statistics              PRIMARY KEY (Id),
    CONSTRAINT UQ_HistoricalStatistics_ChannelId_Date UNIQUE (ChannelId, Date),
    CONSTRAINT FK_HistoricalStatistics_Channels      FOREIGN KEY (ChannelId) REFERENCES Channels (ChannelId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_HistoricalStatistics_ChannelId ON Historical_Statistics (ChannelId);
GO

-- ============================================================
-- VideoAnalyses
-- ============================================================
CREATE TABLE VideoAnalyses (
    Id                    INT IDENTITY(1,1) NOT NULL,
    VideoId               NVARCHAR(MAX)     NOT NULL,
    CompetitionDifficulty FLOAT             NOT NULL,
    OpportunityScore      FLOAT             NOT NULL,
    TrendGrowth           FLOAT             NOT NULL,
    CreatedAt             DATETIME2(6)      NOT NULL,
    CONSTRAINT PK_VideoAnalyses PRIMARY KEY (Id)
);
GO

-- ============================================================
-- Payment_Gateways
-- ============================================================
CREATE TABLE Payment_Gateways (
    id                 INT IDENTITY(1,1) NOT NULL,
    provider_name      NVARCHAR(100)     NOT NULL,
    external_reference NVARCHAR(255)     NULL,
    CONSTRAINT PK_Payment_Gateways PRIMARY KEY (id)
);
GO

-- ============================================================
-- Payment_methods
-- ============================================================
CREATE TABLE Payment_methods (
    id                  INT IDENTITY(1,1) NOT NULL,
    user_id             INT               NOT NULL,
    payment_gateway_id  INT               NULL,
    card_holder_name    NVARCHAR(100)     NULL,
    card_last4          NVARCHAR(4)       NULL,
    expiry_date         NVARCHAR(5)       NULL,
    created_at          DATETIME2         NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_Payment_methods    PRIMARY KEY (id),
    CONSTRAINT FK_Users_Payment      FOREIGN KEY (user_id)            REFERENCES Users            (id) ON DELETE CASCADE,
    CONSTRAINT FK_Payment_Gateways   FOREIGN KEY (payment_gateway_id) REFERENCES Payment_Gateways (id)
);
GO

-- ============================================================
-- Subscriptions
-- ============================================================
CREATE TABLE Subscriptions (
    id                   INT IDENTITY(1,1) NOT NULL,
    user_id              INT               NOT NULL,
    subscription_plan_id INT               NOT NULL,
    Payment_method_id    INT               NULL,
    status               NVARCHAR(50)      NULL DEFAULT 'Active',
    start_date           DATETIME2         NULL DEFAULT GETUTCDATE(),
    end_date             DATETIME2         NULL,
    CONSTRAINT PK_Subscriptions                   PRIMARY KEY (id),
    CONSTRAINT FK_Users_Subscriptions             FOREIGN KEY (user_id)              REFERENCES Users              (id) ON DELETE CASCADE,
    CONSTRAINT FK_SubscriptionPlans_Subscriptions FOREIGN KEY (subscription_plan_id) REFERENCES Subscription_Plans (id),
    CONSTRAINT FK_Payment_methods_Subscriptions   FOREIGN KEY (Payment_method_id)    REFERENCES Payment_methods    (id)
);
GO

-- ============================================================
-- User_Subscriptions
-- ============================================================
CREATE TABLE User_Subscriptions (
    Id               INT IDENTITY(1,1) NOT NULL,
    UserId           INT               NOT NULL,
    PlanType         NVARCHAR(20)      NOT NULL,
    CreditsGranted   INT               NOT NULL,
    CreditsRemaining INT               NOT NULL,
    StartDate        DATETIME2         NOT NULL,
    RenewalDate      DATETIME2         NOT NULL,
    IsActive         BIT               NOT NULL DEFAULT 1,
    CreatedAt        DATETIME2         NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_User_Subscriptions         PRIMARY KEY (Id),
    CONSTRAINT FK_UserSubscriptions_Users    FOREIGN KEY (UserId) REFERENCES Users (id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_UserSubscriptions_UserId ON User_Subscriptions (UserId);
GO

-- ============================================================
-- Usage_Quotas
-- ============================================================
CREATE TABLE Usage_Quotas (
    id                           INT IDENTITY(1,1) NOT NULL,
    user_id                      INT               NOT NULL,
    gap_analyses_used            INT               NOT NULL DEFAULT 0,
    thumbnail_optimizations_used INT               NOT NULL DEFAULT 0,
    script_generations_used      INT               NOT NULL DEFAULT 0,
    video_generations_used       INT               NOT NULL DEFAULT 0,
    content_generations_used     INT               NOT NULL DEFAULT 0,
    period_start                 DATETIME2         NULL,
    period_end                   DATETIME2         NULL,
    max_quota                    INT               NOT NULL DEFAULT 50,
    CONSTRAINT PK_Usage_Quotas          PRIMARY KEY (id),
    CONSTRAINT UQ_Usage_Quotas_user_id  UNIQUE (user_id),
    CONSTRAINT FK_Users_Quotas          FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);
GO

-- ============================================================
-- Credit_Transactions
-- ============================================================
CREATE TABLE Credit_Transactions (
    Id              INT IDENTITY(1,1) NOT NULL,
    UserId          INT               NOT NULL,
    Credits         INT               NOT NULL,
    TransactionType NVARCHAR(20)      NOT NULL,
    FeatureType     NVARCHAR(30)      NOT NULL,
    Description     NVARCHAR(255)     NULL,
    CreatedAt       DATETIME2         NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Credit_Transactions       PRIMARY KEY (Id),
    CONSTRAINT FK_CreditTransactions_Users  FOREIGN KEY (UserId) REFERENCES Users (id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_CreditTransactions_UserId_CreatedAt ON Credit_Transactions (UserId, CreatedAt);
GO

-- ============================================================
-- Content_Gap_Analyses
-- ============================================================
CREATE TABLE Content_Gap_Analyses (
    id                  INT IDENTITY(1,1) NOT NULL,
    user_id             INT               NOT NULL,
    keyword             NVARCHAR(255)     NOT NULL,
    demand_score        DECIMAL(5,2)      NULL,
    trend_score         DECIMAL(5,2)      NULL,
    competition_score   DECIMAL(5,2)      NULL,
    gap_score           DECIMAL(5,2)      NULL,
    raw_metrics_json    NVARCHAR(MAX)     NULL,
    recommended_action  NVARCHAR(255)     NULL,
    created_at          DATETIME2         NULL DEFAULT GETUTCDATE(),
    OpportunityScore    FLOAT             NOT NULL DEFAULT 0,
    GapReportId         INT               NULL,
    CONSTRAINT PK_Content_Gap_Analyses                      PRIMARY KEY (id),
    CONSTRAINT FK_Users_Analyses                            FOREIGN KEY (user_id)    REFERENCES Users      (id) ON DELETE CASCADE,
    CONSTRAINT FK_ContentGapAnalyses_GapReports_GapReportId FOREIGN KEY (GapReportId) REFERENCES GapReports (Id) ON DELETE NO ACTION
);
GO

CREATE INDEX IX_ContentGapAnalyses_UserId_GapScore   ON Content_Gap_Analyses (user_id, gap_score DESC);
CREATE INDEX IX_ContentGapAnalyses_UserId_CreatedAt  ON Content_Gap_Analyses (user_id, created_at DESC);
GO

INSERT INTO Content_Gap_Analyses
    (user_id, keyword, demand_score, trend_score, competition_score, gap_score, raw_metrics_json, recommended_action, created_at, OpportunityScore, GapReportId)
VALUES
    (2, 'AI YouTube Automation',    95.00, 90.00, 35.00, 92.00, NULL, 'Growth Opportunity', '2026-06-03 13:08:26', 0, 1),
    (2, 'ChatGPT Content Creation', 88.00, 84.00, 40.00, 89.00, NULL, 'Growth Strategy',    '2026-06-02 15:08:26', 0, 1),
    (2, 'YouTube SEO 2026',         85.00, 80.00, 45.00, 87.00, NULL, 'Niche Expansion',    '2026-06-01 15:08:26', 0, 1),
    (2, 'AI Thumbnail Design',      82.00, 78.00, 50.00, 84.00, NULL, 'Evergreen Topic',    '2026-05-31 15:08:26', 0, 1),
    (2, 'Faceless YouTube Channels',80.00, 75.00, 55.00, 81.00, NULL, 'Growth Campaign',    '2026-05-30 15:08:26', 0, 1);
GO

-- ============================================================
-- Generated_Contents
-- ============================================================
CREATE TABLE Generated_Contents (
    id                    INT IDENTITY(1,1) NOT NULL,
    user_id               INT               NOT NULL,
    source_gap_analysis_id INT              NULL,
    topic                 NVARCHAR(255)     NULL,
    generated_title       NVARCHAR(MAX)     NULL,
    generated_description NVARCHAR(MAX)     NULL,
    generated_script      NVARCHAR(MAX)     NULL,
    ai_provider           NVARCHAR(100)     NULL,
    ai_provider_version   NVARCHAR(50)      NULL,
    tokens_used           INT               NULL,
    approval_status       NVARCHAR(50)      NULL DEFAULT 'Pending',
    published_status      NVARCHAR(50)      NULL DEFAULT 'Draft',
    created_at            DATETIME2         NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_Generated_Contents                PRIMARY KEY (id),
    CONSTRAINT FK_Users_Contents                    FOREIGN KEY (user_id)                REFERENCES Users               (id) ON DELETE CASCADE,
    CONSTRAINT FK_Analyses_Contents                 FOREIGN KEY (source_gap_analysis_id) REFERENCES Content_Gap_Analyses (id),
    CONSTRAINT CHK_Generated_Contents_approval_status  CHECK (approval_status  IN ('Pending', 'Approved', 'Rejected')),
    CONSTRAINT CHK_Generated_Contents_published_status CHECK (published_status IN ('Draft', 'Published'))
);
GO

CREATE INDEX IX_GeneratedContents_UserId_CreatedAt ON Generated_Contents (user_id, created_at DESC);
GO

-- ============================================================
-- Generated_Thumbnails
-- ============================================================
CREATE TABLE Generated_Thumbnails (
    id                   INT IDENTITY(1,1) NOT NULL,
    user_id              INT               NOT NULL,
    generated_content_id INT               NULL,
    prompt               NVARCHAR(2000)    NOT NULL,
    style                NVARCHAR(100)     NULL,
    image_path           NVARCHAR(MAX)     NOT NULL,
    ai_provider          NVARCHAR(100)     NOT NULL,
    reuse_count          INT               NULL DEFAULT 0,
    download_count       INT               NULL DEFAULT 0,
    is_favorite          BIT               NULL DEFAULT 0,
    created_at           DATETIME2         NULL DEFAULT GETUTCDATE(),
    reference_image_path NVARCHAR(500)     NULL,
    CONSTRAINT PK_Generated_Thumbnails         PRIMARY KEY (id),
    CONSTRAINT FK_GeneratedThumbnails_Users    FOREIGN KEY (user_id)             REFERENCES Users              (id) ON DELETE CASCADE,
    CONSTRAINT FK_GeneratedThumbnails_Contents FOREIGN KEY (generated_content_id) REFERENCES Generated_Contents (id)
);
GO

-- ============================================================
-- Uploaded_Image_Thumbnails
-- ============================================================
CREATE TABLE Uploaded_Image_Thumbnails (
    id                   INT IDENTITY(1,1) NOT NULL,
    user_id              INT               NOT NULL,
    generated_content_id INT               NULL,
    original_image_path  NVARCHAR(500)     NOT NULL,
    generated_image_path NVARCHAR(500)     NOT NULL,
    prompt               NVARCHAR(MAX)     NOT NULL,
    ai_provider          NVARCHAR(100)     NOT NULL,
    download_count       INT               NULL DEFAULT 0,
    created_at           DATETIME2         NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_Uploaded_Image_Thumbnails         PRIMARY KEY (id),
    CONSTRAINT FK_UploadedImageThumbnails_Users     FOREIGN KEY (user_id)              REFERENCES Users              (id) ON DELETE CASCADE,
    CONSTRAINT FK_UploadedImageThumbnails_Contents  FOREIGN KEY (generated_content_id) REFERENCES Generated_Contents (id)
);
GO

-- ============================================================
-- Generated_Videos
-- ============================================================
CREATE TABLE Generated_Videos (
    id                   INT IDENTITY(1,1) NOT NULL,
    user_id              INT               NOT NULL,
    generated_content_id INT               NULL,
    provider_task_id     NVARCHAR(255)     NULL,
    provider_name        NVARCHAR(100)     NOT NULL DEFAULT 'piapi',
    provider_model       NVARCHAR(100)     NOT NULL DEFAULT 'seedance',
    generation_mode      NVARCHAR(50)      NULL DEFAULT 'text_to_video',
    prompt               NVARCHAR(MAX)     NOT NULL,
    enhanced_prompt      NVARCHAR(MAX)     NULL,
    voice_tone           NVARCHAR(50)      NOT NULL,
    video_style          NVARCHAR(50)      NOT NULL,
    duration_seconds     INT               NOT NULL,
    aspect_ratio         NVARCHAR(20)      NOT NULL,
    generation_status    NVARCHAR(50)      NULL DEFAULT 'Pending',
    generated_video_url  NVARCHAR(MAX)     NULL,
    is_merged            BIT               NULL DEFAULT 0,
    clip_count           INT               NULL DEFAULT 1,
    error_message        NVARCHAR(MAX)     NULL,
    credits_used         INT               NULL DEFAULT 0,
    created_at           DATETIME2         NULL DEFAULT GETUTCDATE(),
    started_at           DATETIME2         NULL,
    completed_at         DATETIME2         NULL,
    CONSTRAINT PK_Generated_Videos           PRIMARY KEY (id),
    CONSTRAINT UX_GeneratedVideos_TaskId     UNIQUE (provider_task_id),
    CONSTRAINT FK_Videos_Users               FOREIGN KEY (user_id)              REFERENCES Users              (id) ON DELETE CASCADE,
    CONSTRAINT FK_Videos_Contents            FOREIGN KEY (generated_content_id) REFERENCES Generated_Contents (id),
    CONSTRAINT CHK_Generated_Videos_aspect_ratio      CHECK (aspect_ratio      IN ('16:9','9:16','1:1','4:3','3:4')),
    CONSTRAINT CHK_Generated_Videos_duration_seconds  CHECK (duration_seconds  IN (5,10,15,20,25,30)),
    CONSTRAINT CHK_Generated_Videos_generation_status CHECK (generation_status  IN ('Pending','Queued','Processing','Completed','Failed')),
    CONSTRAINT CHK_Generated_Videos_video_style       CHECK (video_style       IN ('Cinematic','Documentary','Futuristic','Realistic','Anime','Luxury','Sports')),
    CONSTRAINT CHK_Generated_Videos_voice_tone        CHECK (voice_tone        IN ('Energetic','Professional','Narrator','Dramatic','Motivational','Calm'))
);
GO

CREATE INDEX IX_GeneratedVideos_UserId_CreatedAt ON Generated_Videos (user_id, created_at DESC);
CREATE INDEX IX_GeneratedVideos_Status           ON Generated_Videos (generation_status);
GO

-- ============================================================
-- Generated_Video_Clips
-- ============================================================
CREATE TABLE Generated_Video_Clips (
    id                INT IDENTITY(1,1) NOT NULL,
    generated_video_id INT              NOT NULL,
    clip_order        INT               NOT NULL,
    provider_task_id  NVARCHAR(255)     NULL,
    clip_video_url    NVARCHAR(MAX)     NULL,
    generation_status NVARCHAR(50)      NULL,
    created_at        DATETIME2         NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Generated_Video_Clips                  PRIMARY KEY (id),
    CONSTRAINT FK_VideoClips_Videos                      FOREIGN KEY (generated_video_id) REFERENCES Generated_Videos (id) ON DELETE CASCADE,
    CONSTRAINT CHK_Generated_Video_Clips_generation_status CHECK (generation_status IN ('Pending','Processing','Completed','Failed'))
);
GO

CREATE INDEX IX_GeneratedVideoClips_VideoId ON Generated_Video_Clips (generated_video_id);
GO

-- ============================================================
-- Scripts
-- ============================================================
CREATE TABLE Scripts (
    Id          INT IDENTITY(1,1) NOT NULL,
    Topic       NVARCHAR(MAX)     NOT NULL,
    RawJson     NVARCHAR(MAX)     NOT NULL,
    CreatedAt   DATETIME2(6)      NOT NULL,
    GapReportId INT               NULL,
    User_Id     INT               NULL,
    CONSTRAINT PK_Scripts                      PRIMARY KEY (Id),
    CONSTRAINT FK_Scripts_GapReports_GapReportId FOREIGN KEY (GapReportId) REFERENCES GapReports (Id) ON DELETE SET NULL,
    CONSTRAINT FK_Scripts_Users_User_Id          FOREIGN KEY (User_Id)     REFERENCES Users      (id) ON DELETE NO ACTION
);
GO

CREATE INDEX IX_Scripts_GapReportId ON Scripts (GapReportId);
GO

-- ============================================================
-- All_In_Ones
-- ============================================================
CREATE TABLE All_In_Ones (
    Id               INT IDENTITY(1,1) NOT NULL,
    user_id          INT               NOT NULL,
    ScriptId         INT               NOT NULL DEFAULT 1,
    Prompt           NVARCHAR(MAX)     NOT NULL,
    thumbnail_prompt NVARCHAR(MAX)     NULL,
    image_path       NVARCHAR(MAX)     NOT NULL,
    image_provider   NVARCHAR(255)     NOT NULL,
    Video_Path       NVARCHAR(MAX)     NULL,
    Status           NVARCHAR(50)      NULL,
    created_at       DATETIME2         NULL,
    voice_tone       NVARCHAR(50)      NOT NULL DEFAULT 'Professional',
    video_style      NVARCHAR(50)      NOT NULL DEFAULT 'Realistic',
    Video_Prompt     NVARCHAR(MAX)     NULL,
    PiApi_Task_Id    NVARCHAR(255)     NULL,
    Error_Message    NVARCHAR(MAX)     NULL,
    Updated_at       DATETIME2         NULL,
    CONSTRAINT PK_All_In_Ones            PRIMARY KEY (Id),
    CONSTRAINT FK_AllInOnes_Users_UserId FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);
GO

-- ============================================================
-- User_Niches
-- ============================================================
CREATE TABLE User_Niches (
    user_id  INT NOT NULL,
    niche_id INT NOT NULL,
    CONSTRAINT PK_User_Niches        PRIMARY KEY (user_id, niche_id),
    CONSTRAINT FK_UserNiches_Users   FOREIGN KEY (user_id)  REFERENCES Users          (id) ON DELETE CASCADE,
    CONSTRAINT FK_UserNiches_Niches  FOREIGN KEY (niche_id) REFERENCES Content_Niches (id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_UserNiches_UserId ON User_Niches (user_id);
GO

-- ============================================================
-- User_Goals
-- ============================================================
CREATE TABLE User_Goals (
    user_id INT NOT NULL,
    goal_id INT NOT NULL,
    CONSTRAINT PK_User_Goals       PRIMARY KEY (user_id, goal_id),
    CONSTRAINT FK_UserGoals_Users  FOREIGN KEY (user_id) REFERENCES Users         (id) ON DELETE CASCADE,
    CONSTRAINT FK_UserGoals_Goals  FOREIGN KEY (goal_id) REFERENCES Content_Goals (id) ON DELETE CASCADE
);
GO