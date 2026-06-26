using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class CachedTrendResult
{
    public int Id { get; set; }

    public string CacheKey { get; set; } = string.Empty;

    public string Region { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Keywords { get; set; } = string.Empty;

    public string ResultJson { get; set; } = "[]";

    public DateTime ExpiresAt { get; set; }

    public int HitCount { get; set; } = 0;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }
}
