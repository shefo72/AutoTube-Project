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
    public class ScriptBridgeController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ScriptBridgeController(IMediator mediator) => _mediator = mediator;
        // Retrieves the history of gap analysis reports with pagination support.
        [HttpPost("sessions")]
        [ProducesResponseType(typeof(ApiResponse<AnalysisSessionDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SaveSession(
            [FromBody] SaveSessionRequest request,
            CancellationToken cancellationToken = default)
        {
            var command = new SaveAnalysisSessionCommand(
                request.GapReportId,
                request.VideoId,
                request.Notes ?? string.Empty,
                request.ContextJson ?? "{}");

            var result = await _mediator.Send(command, cancellationToken);

            if (!result.Success)
                return result.Message.Contains("not found", StringComparison.OrdinalIgnoreCase)
                    ? NotFound(result)
                    : BadRequest(result);

            return CreatedAtAction(
                nameof(GetSessionById),
                new { sessionId = result.Data!.SessionId },
                result);
        }

        [HttpGet("sessions/report/{gapReportId:int}")]
        [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<AnalysisSessionDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSessionsByReport(
            [FromRoute] int gapReportId,
            CancellationToken cancellationToken = default)
        {
            var query = new GetAnalysisSessionsByReportQuery(gapReportId);
            var result = await _mediator.Send(query, cancellationToken);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // Retrieves a specific analysis session by its unique identifier (sessionId).
        [HttpGet("sessions/{sessionId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<AnalysisSessionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetSessionById(
            [FromRoute] Guid sessionId,
            CancellationToken cancellationToken = default)
        {
            var query = new GetSessionByIdQuery(sessionId);
            var result = await _mediator.Send(query, cancellationToken);

            return result.Success ? Ok(result) : NotFound(result);
        }
    }

    public record SaveSessionRequest(
        int GapReportId,
        string VideoId,
        string? Notes,
        string? ContextJson);

}
