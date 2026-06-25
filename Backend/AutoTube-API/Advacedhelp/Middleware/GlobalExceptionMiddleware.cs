using Autotube.Exceptions;
using AutoTubeAPI.DTOs.Auth;
using System.Net;
using System.Text.Json;

namespace AutoTubeAPI.Advacedhelp.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Unhandled exception on {Method} {Path}: {Message}",
                context.Request.Method,
                context.Request.Path,
                ex.Message);

            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var statusCode = HttpStatusCode.InternalServerError;
        var message = "An unexpected error occurred. Please try again later.";

        switch (exception)
        {
            case UnauthorizedAccessException:
                statusCode = HttpStatusCode.Unauthorized;          // 401
                message = exception.Message;
                break;

            case InvalidOperationException:
                statusCode = HttpStatusCode.BadRequest;            // 400
                message = exception.Message;
                break;

            case KeyNotFoundException:
                statusCode = HttpStatusCode.NotFound;              // 404
                message = exception.Message;
                break;

            case ArgumentException:
                //   case ArgumentNullException:
                statusCode = HttpStatusCode.BadRequest;            // 400
                message = exception.Message;
                break;

            case InsufficientCreditsException ex:                  // Custom exception for insufficient credits
                statusCode = HttpStatusCode.BadRequest;
                message =
                    $"You do not have enough credits to perform this action. Required Credits: {ex.RequiredCredits}, Your Credits: {ex.RemainingCredits}";
                break;

            case NotImplementedException:
                statusCode = HttpStatusCode.NotImplemented;        // 501
                message = "This feature is not yet available.";
                break;

            default:
                statusCode = HttpStatusCode.InternalServerError;   // 500
                message = "An unexpected error occurred. Please try again later.";
                break;
        }

        var errorResponse = new ErrorResponseDto
        {
            Success = false,
            Message = message,
            StatusCode = (int)statusCode,
            Timestamp = DateTime.Now,
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(errorResponse, jsonOptions);
        await context.Response.WriteAsync(json);
    }
}