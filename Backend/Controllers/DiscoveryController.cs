using Asp.Versioning;
using Autotube.Commands;
using Autotube.DTOs.GapAnalysis.DTOs;
using Autotube.Models;
using Autotube.Queries;
using Autotube.Repositories.GapAnalysis;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace Autotube.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("fixed")]
    public class DiscoveryController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;

        public DiscoveryController(IMediator mediator, IUnitOfWork unitOfWork)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
        }

        /*
        Retrieves dashboard statistics including total topics analyzed,
        easy wins percentage, average gap percentage, and high growth channels. 
        */
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats(CancellationToken ct)
        {
            var videoRepo = _unitOfWork.Repository<Video>();
            var reportRepo = _unitOfWork.Repository<GapReport>();
            var channelRepo = _unitOfWork.Repository<Channel>();

            var totalTopics = await videoRepo.Query().CountAsync(ct);
            var totalReports = await reportRepo.Query().CountAsync(ct);

            var easyWins = await reportRepo.Query()
                .CountAsync(r => r.OpportunityScore > 60, ct);

            var avgScore = await reportRepo.Query().AverageAsync(r => (double?)r.OpportunityScore, ct) ?? 0;
            var highGrowthChannels = await channelRepo.Query().CountAsync(c => c.SubscriberCount > 50000, ct);

            var stats = new
            {
                topicsAnalyzed = totalTopics,
                easyWinsPercentage = totalReports > 0 ? Math.Round((double)easyWins / totalReports * 100, 1) : 0,
                avgGapPercentage = Math.Round(avgScore * 10, 1),
                highGrowthChannels = highGrowthChannels
            };

            return Ok(new { success = true, data = stats });
        }


        /*
        Retrieves a list of discovery items based on the specified type 
        (easy wins or high growth channels).
        */
        [HttpGet("list/{type}")]
        public async Task<IActionResult> GetDiscoveryList([FromRoute] string type, CancellationToken ct)
        {
            switch (type.ToLower())
            {
                case "easy-wins":
                    var easyWins = await _unitOfWork.Repository<GapReport>().Query()
                        .Where(r => r.OpportunityScore > 60)
                        .ToListAsync(ct);
                    return Ok(new { success = true, data = easyWins });

                case "high-growth":
                    var channels = await _unitOfWork.Repository<Channel>().Query()
                        .Where(c => c.SubscriberCount > 50000)
                        .ToListAsync(ct);
                    return Ok(new { success = true, data = channels });

                default:
                    return BadRequest(new { success = false, message = "Invalid list type requested." });
            }
        }

    
        /*
        Retrieves trending videos based on region, category, keywords, and max results.
        */
        [HttpGet("trending")]
        [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<TrendingVideoDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetTrendingVideos(
            [FromQuery] string region = "US",
            [FromQuery] string categoryId = "",
            [FromQuery] string keywords = "",
            [FromQuery] int maxResults = 20,
            CancellationToken cancellationToken = default)
        {
            var command = new FetchTrendingVideosCommand(region, categoryId, keywords, maxResults);
            var result = await _mediator.Send(command, cancellationToken);
            return result.Success ? Ok(result) : BadRequest(result);
        }
        
        /*
        Retrieves videos for a specific channel based on the channel name.
        */
        [HttpGet("channels/{channelName}/videos")]
        [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<VideoDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetChannelVideos(
            [FromRoute] string channelName,
            CancellationToken cancellationToken = default)
        {
            var query = new GetVideosByChannelQuery(channelName);
            var result = await _mediator.Send(query, cancellationToken);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}