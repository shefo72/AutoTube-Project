using Autotube.DTOs.GapAnalysis.DTOs;
using Autotube.Models;
using MediatR;

namespace Autotube.Commands
{
    public record FetchTrendingVideosCommand(
        string? Region,
        string? CategoryId,
        string? Keywords,
        int MaxResults
    ) : IRequest<ApiResponse<IReadOnlyList<TrendingVideoDto>>>;

    public record AnalyzeGapCommand(
        string VideoId
    ) : IRequest<ApiResponse<GapReportDto>>;

    public record SaveAnalysisSessionCommand(
        int GapReportId,
        string VideoId,
        string Notes,
        string ContextJson
    ) : IRequest<ApiResponse<AnalysisSessionDto>>;

    public record AnalyzeSingleVideoCommand(
        string VideoId
    ) : IRequest<ApiResponse<GapReportDto>>;
}
