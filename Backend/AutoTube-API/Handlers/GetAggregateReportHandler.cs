using Autotube.DTOs.GapAnalysis.DTOs;
using Autotube.Models;
using Autotube.Queries;
using Autotube.Repositories.GapAnalysis;
using Autotube.Services.GapAnalysis.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace Autotube.Handlers
{
    public class GetAggregateReportHandler : IRequestHandler<GetAggregateReportQuery, AggregateReport>
    {
        private readonly IGeminiAiService _geminiService;
        private readonly IRepository<GapReport> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetAggregateReportHandler(
            IGeminiAiService geminiService,
            IRepository<GapReport> repository,
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextAccessor)
        {
            _geminiService = geminiService;
            _repository = repository;
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<AggregateReport> Handle(GetAggregateReportQuery request, CancellationToken cancellationToken)
        {

            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            var userRepo = _unitOfWork.Repository<User>();

            if (!int.TryParse(userId, out int intUserId))
                throw new Exception("Invalid user identification.");

            var userResult = await userRepo.FindAsync(u => u.Id == intUserId, cancellationToken);
            var user = userResult.FirstOrDefault();

            if (user == null)
                throw new Exception("User not found.");

            var query = _repository.Query();

            if (!string.IsNullOrEmpty(request.ChannelId))
            {
                query = query.Where(x => x.ChannelId == request.ChannelId);
            }

            var gapReports = await query.ToListAsync(cancellationToken);

            var data = gapReports.Select(x => new GapAnalysisResult(
                JsonSerializer.Deserialize<List<string>>(x.ContentGapsJson) ?? new List<string>(),
                JsonSerializer.Deserialize<List<string>>(x.AudiencePainPointsJson) ?? new List<string>(),
                JsonSerializer.Deserialize<List<string>>(x.MissedOpportunitiesJson) ?? new List<string>(),
                JsonSerializer.Deserialize<List<string>>(x.WeaknessesJson) ?? new List<string>(),
                JsonSerializer.Deserialize<List<string>>(x.StrengthsJson) ?? new List<string>(),
                JsonSerializer.Deserialize<List<string>>(x.SeoRecommendationsJson) ?? new List<string>(),
                JsonSerializer.Deserialize<List<string>>(x.CtrOptimizationSuggestionsJson) ?? new List<string>(),
                JsonSerializer.Deserialize<List<string>>(x.HookImprovementsJson) ?? new List<string>(),
                JsonSerializer.Deserialize<List<string>>(x.RetentionImprovementsJson) ?? new List<string>(),
                x.ViralPotentialAnalysis,
                x.CompetitionDifficulty,
                x.OpportunityScore,
                x.TrendGrowth
            )).ToList();

            if (data == null || !data.Any())
            {
                return new AggregateReport(
                    new List<string>(),
                    new List<string>(),
                    new List<string>(),
                    new List<string>(),
                    "This user has no gap reports available for aggregation.",
                );
            }

            var result = await _geminiService.GenerateAggregateReportAsync(data, cancellationToken);

            return result;
        }
    }
}
