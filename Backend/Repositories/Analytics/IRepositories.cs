using Autotube.DTOs.Analytics;
using Autotube.Models;

namespace Autotube.Repositories.Analytics;

public interface IChannelRepository
{
    Task<Channel?> GetByChannelIdAsync(string channelId, CancellationToken ct = default);

    Task<Channel?> GetByIdAsync(int id, CancellationToken ct = default);

    Task<Channel> AddAsync(Channel channel, CancellationToken ct = default);

    Task UpdateAsync(Channel channel, CancellationToken ct = default);

    Task<bool> ExistsAsync(string channelId, CancellationToken ct = default);
}


public interface IVideoRepository
{
    Task<IReadOnlyList<Video>> GetTopVideosByChannelAsync(string channelId, int count, CancellationToken ct = default);

    Task<Video?> GetByVideoIdAsync(string videoId, CancellationToken ct = default);

    Task AddRangeAsync(IEnumerable<Video> videos, CancellationToken ct = default);

    Task UpdateAsync(Video video, CancellationToken ct = default);

    Task<List<Video>> GetAllByChannelIdAsync(string channelId, CancellationToken ct = default);
    Task UpdateRangeAsync(IEnumerable<Video> videos, CancellationToken ct = default);
    

    Task<IReadOnlyList<string>> GetCategoriesWithCountsAsync(string channelId, CancellationToken ct = default);

    Task<IReadOnlyList<DistributionDto>> GetDistributionAsync(
        string channelId,
        string type,
        CancellationToken ct = default);
}


public interface IAnalyticsSnapshotRepository
{
    Task<AnalyticsSnapshot?> GetLatestByChannelAsync(string channelId, CancellationToken ct = default);

    Task<IReadOnlyList<AnalyticsSnapshot>> GetByChannelAsync(
        string channelId,
        DateTime from,
        DateTime to,
        CancellationToken ct = default);

    Task AddAsync(AnalyticsSnapshot snapshot, CancellationToken ct = default);
}


public interface IHistoricalStatisticRepository
{
    Task<IReadOnlyList<HistoricalStatistic>> GetByChannelAsync(
        string channelId,
        int days,
        CancellationToken ct = default);

    Task AddAsync(HistoricalStatistic stat, CancellationToken ct = default);

    Task<HistoricalStatistic?> GetByChannelAndDateAsync(
        string channelId,
        DateTime date,
        CancellationToken ct = default);

    Task UpdateAsync(HistoricalStatistic stat, CancellationToken ct = default);
}