using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class User
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    //public string UserName { get; set; } = string.Empty;

    public string? PasswordHash { get; set; }

    public string Email { get; set; } = null!;

    public bool EmailVerified { get; set; }

    public string Role { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }

    public string? ProfileImageUrl { get; set; }

    public string? PhoneNumber { get; set; }

    public string? GoogleId { get; set; }

    public string AuthProvider { get; set; } = null!;

    public bool? IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public virtual ICollection<Channel> Channels { get; set; } = new List<Channel>();

    public virtual ICollection<ContentGapAnalysis> ContentGapAnalyses { get; set; } = new List<ContentGapAnalysis>();

    public virtual ICollection<GeneratedContent> GeneratedContents { get; set; } = new List<GeneratedContent>();

    public virtual ICollection<GeneratedThumbnail> GeneratedThumbnails { get; set; } = new List<GeneratedThumbnail>();

    public virtual ICollection<GeneratedVideo> GeneratedVideos { get; set; } = new List<GeneratedVideo>();

    public virtual ICollection<PaymentMethod> PaymentMethods { get; set; } = new List<PaymentMethod>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    public virtual ICollection<UploadedImageThumbnail> UploadedImageThumbnails { get; set; } = new List<UploadedImageThumbnail>();

    public virtual UsageQuota? UsageQuota { get; set; }

    public virtual ICollection<ContentGoal> Goals { get; set; } = new List<ContentGoal>();

    public virtual ICollection<ContentNich> Niches { get; set; } = new List<ContentNich>();

    public ICollection<GapReport> GapReports { get; set; } = new List<GapReport>();

    public virtual ICollection<AllInOne> AllInOne { get; set; }= new List<AllInOne>();

    public ICollection<Script> Scripts { get; set; } = new List<Script>();



}
