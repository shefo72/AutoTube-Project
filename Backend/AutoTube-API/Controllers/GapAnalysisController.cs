using Asp.Versioning;
using Autotube.Commands;
using Autotube.DTOs.GapAnalysis.DTOs;
using Autotube.Models;
using Autotube.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Autotube.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("fixed")]
    public class GapAnalysisController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GapAnalysisController(IMediator mediator) => _mediator = mediator;

        // Retrieves the gap analysis report for a specific video by its ID.
        [HttpPost("analyze")]
        [ProducesResponseType(typeof(ApiResponse<GapReportDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status502BadGateway)]
        public async Task<IActionResult> Analyze(
            [FromBody] AnalyzeRequest request,
            CancellationToken cancellationToken = default)
        {
            var command = new AnalyzeGapCommand(request.VideoId);
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.Success)
                return result.Message.Contains("not found", StringComparison.OrdinalIgnoreCase)
                    ? NotFound(result)
                    : BadRequest(result);

            return Ok(result);
        }

        // Retrieves the aggregate gap analysis report, optionally filtered by channel ID.
        [HttpGet("aggregate")]
        [ProducesResponseType(typeof(ApiResponse<AggregateReport>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAggregateReport(
            [FromQuery] string? channelId = null,
            CancellationToken cancellationToken = default)
        {
            var query = new GetAggregateReportQuery(channelId);
            var result = await _mediator.Send(query, cancellationToken);

            if (result == null)
                return NotFound(new { Message = "There is no available info to analyze." });

            var response = new ApiResponse<AggregateReport>
            {
                Success = true,
                Message = "Aggregate report generated successfully",
                Data = result
            };

            return Ok(response);

        }
        
        // Retrieves the history of gap analysis reports with pagination support.
        [HttpGet("history")]
        [ProducesResponseType(typeof(PagedResponse<GapReportDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetHistory(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var query = new GetAnalysisHistoryQuery(page, pageSize);
            var result = await _mediator.Send(query, cancellationToken);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }

    public record AnalyzeRequest(string VideoId);
}
