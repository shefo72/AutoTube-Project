
using System.Diagnostics;

namespace AutoTubeAPI.Advacedhelp.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        var clientIp = context.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                    ?? context.Connection.RemoteIpAddress?.ToString()
                    ?? "unknown";

        var method = context.Request.Method;
        var path = context.Request.Path + context.Request.QueryString;

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();

            var statusCode = context.Response.StatusCode;
            var elapsed = stopwatch.ElapsedMilliseconds;

            if (statusCode >= 500)
            {
                _logger.LogError(
                    "{Method} {Path} → {StatusCode} ({Elapsed}ms) from {ClientIp}",
                    method, path, statusCode, elapsed, clientIp);
            }
            else if (statusCode >= 400)
            {
                _logger.LogWarning(
                    "{Method} {Path} → {StatusCode} ({Elapsed}ms) from {ClientIp}",
                    method, path, statusCode, elapsed, clientIp);
            }
            else
            {
                _logger.LogInformation(
                    "{Method} {Path} → {StatusCode} ({Elapsed}ms) from {ClientIp}",
                    method, path, statusCode, elapsed, clientIp);
            }
        }
    }
}