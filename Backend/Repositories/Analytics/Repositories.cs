using Autotube.Data;
using Autotube.DTOs.Analytics;
using Autotube.Models;
using Autotube.Services;
using Microsoft.EntityFrameworkCore;
using System;

namespace Autotube.Repositories.Analytics;

public sealed class ChannelRepository : IChannelRepository
{
    private readonly AutoTubeDbContext _db;
    public ChannelRepository(AutoTubeDbContext db) => _db = db;

    public async Task<Channel?> GetByChannelIdAsync(string channelId, CancellationToken ct = default)
      => await _db.Channels.FirstOrDefaultAsync(c => c.ChannelId == channelId, ct);

    public async Task<Channel?> GetByIdAsync(int id, CancellationToken ct = default)
      => await _db.Channels.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<Channel> AddAsync(Channel channel, CancellationToken ct = default)
    {
        _db.Channels.Add(channel);
        await _db.SaveChangesAsync(ct);
        return channel;
    }

    public async Task UpdateAsync(Channel channel, CancellationToken ct = default)
    {
        _db.Channels.Update(channel);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<bool> ExistsAsync(string channelId, CancellationToken ct = default)
      => await _db.Channels.AnyAsync(c => c.ChannelId == channelId, ct);
}


public sealed class VideoRepository : IVideoRepository
{
    private readonly AutoTubeDbContext _db;
    public VideoRepository(AutoTubeDbContext db) => _db = db;

    public async Task<IReadOnlyList<Video>> GetTopVideosByChannelAsync(string channelId, int count, CancellationToken ct = default)
      => await _db.Videos
        .Where(v => v.ChannelId == channelId)
        .OrderByDescending(v => v.ViewCount)
        .Take(count)
        .ToListAsync(ct);

    public async Task<Video?> GetByVideoIdAsync(string videoId, CancellationToken ct = default)
      => await _db.Videos.FirstOrDefaultAsync(v => v.VideoId == videoId, ct);

    public async Task AddRangeAsync(IEnumerable<Video> videos, CancellationToken ct = default)
    {
        await _db.Videos.AddRangeAsync(videos, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<List<Video>> GetAllByChannelIdAsync(string channelId, CancellationToken ct = default)
    {
        return await _db.Videos.Where(v => v.ChannelId == channelId).ToListAsync(ct);
    }

    public async Task UpdateRangeAsync(IEnumerable<Video> videos, CancellationToken ct = default)
    {
        _db.Videos.UpdateRange(videos);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Video video, CancellationToken ct = default)
    {
        _db.Videos.Update(video);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<string>> GetCategoriesWithCountsAsync(string channelId, CancellationToken ct = default)
      => await _db.Videos
        .Where(v => v.ChannelId == channelId)
        .GroupBy(v => v.Category)
        .OrderByDescending(g => g.Count())
        .Select(g => g.Key)
        .ToListAsync(ct);

    public async Task<IReadOnlyList<DistributionDto>> GetDistributionAsync(string channelId, string type, CancellationToken ct = default)
    {
        var videos = await _db.Videos.Where(v => v.ChannelId == channelId).ToListAsync(ct);

        if (type == "Performance")
        {
            var avg = videos.Any() ? videos.Average(v => v.ViewCount) : 0;
            return new List<DistributionDto>
            {
                new() { Label = "Viral", Value = videos.Count(v => v.ViewCount > avg * 1.5) },
                new() { Label = "Solid", Value = videos.Count(v => v.ViewCount >= avg * 0.5 && v.ViewCount <= avg * 1.5) },
                new() { Label = "Low", Value = videos.Count(v => v.ViewCount < avg * 0.5) }
            };
        }

        return await _db.Videos
          .Where(v => v.ChannelId == channelId)
          .GroupBy(v => v.Category)
          .Select(g => new DistributionDto { Label = g.Key, Value = g.Count() })
          .ToListAsync(ct);
    }
}


public sealed class AnalyticsSnapshotRepository : IAnalyticsSnapshotRepository
{
    private readonly AutoTubeDbContext _db;
    public AnalyticsSnapshotRepository(AutoTubeDbContext db) => _db = db;

    public async Task<AnalyticsSnapshot?> GetLatestByChannelAsync(string channelId, CancellationToken ct = default)
      => await _db.AnalyticsSnapshots
        .Where(s => s.ChannelId == channelId)
        .OrderByDescending(s => s.RecordedAt)
        .FirstOrDefaultAsync(ct);

    public async Task<IReadOnlyList<AnalyticsSnapshot>> GetByChannelAsync(string channelId, DateTime from, DateTime to, CancellationToken ct = default)
      => await _db.AnalyticsSnapshots
        .Where(s => s.ChannelId == channelId && s.RecordedAt >= from && s.RecordedAt <= to)
        .OrderBy(s => s.RecordedAt)
        .ToListAsync(ct);

    public async Task AddAsync(AnalyticsSnapshot snapshot, CancellationToken ct = default)
    {
        _db.AnalyticsSnapshots.Add(snapshot);
        await _db.SaveChangesAsync(ct);
    }
}


public sealed class HistoricalStatisticRepository : IHistoricalStatisticRepository
{
    private readonly AutoTubeDbContext _db;
    public HistoricalStatisticRepository(AutoTubeDbContext db) => _db = db;

    public async Task<IReadOnlyList<HistoricalStatistic>> GetByChannelAsync(string channelId, int days, CancellationToken ct = default)
    {
        var from = DateTime.UtcNow.AddDays(-days);
        return await _db.HistoricalStatistics
          .Where(h => h.ChannelId == channelId && h.Date >= from)
          .OrderBy(h => h.Date)
          .ToListAsync(ct);
    }

    public async Task AddAsync(HistoricalStatistic stat, CancellationToken ct = default)
    {
        _db.HistoricalStatistics.Add(stat);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<HistoricalStatistic?> GetByChannelAndDateAsync(string channelId, DateTime date, CancellationToken ct = default)
      => await _db.HistoricalStatistics
        .FirstOrDefaultAsync(h => h.ChannelId == channelId && h.Date == date.Date, ct);

    public async Task UpdateAsync(HistoricalStatistic stat, CancellationToken ct = default)
    {
        _db.HistoricalStatistics.Update(stat);
        await _db.SaveChangesAsync(ct);
    }
}