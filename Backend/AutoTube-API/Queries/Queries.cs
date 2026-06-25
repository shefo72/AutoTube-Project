using Autotube.DTOs.GapAnalysis.DTOs;
using MediatR;
using Autotube.Queries.Common;
using Autotube.Models;

namespace Autotube.Queries
{
    public record GetGapReportByVideoIdQuery(string VideoId) : IRequest<ApiResponse<GapReportDto>>;

    public record GetAnalysisHistoryQuery(int Page, int PageSize) : IRequest<PagedResponse<GapReportDto>>;

    public record GetAnalysisSessionsByReportQuery(int GapReportId) : IRequest<ApiResponse<IReadOnlyList<AnalysisSessionDto>>>;

    public record GetSessionByIdQuery(Guid SessionId) : IRequest<ApiResponse<AnalysisSessionDto>>;

    public record GetTrendingVideosFromCacheQuery(
        string Region,
        string CategoryId,
        string Keywords,
        int MaxResults
    ) : IRequest<ApiResponse<IReadOnlyList<TrendingVideoDto>>>;

    public record GetVideosByChannelQuery(string ChannelTitle) : IRequest<ApiResponse<IReadOnlyList<VideoDto>>>;

    public record GetAggregateReportQuery(string? ChannelId) : IRequest<AggregateReport>;
}
