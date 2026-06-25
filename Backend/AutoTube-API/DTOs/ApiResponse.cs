namespace Autotube.DTOs;

public sealed record ApiResponse<T>
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public IReadOnlyList<string> Errors { get; init; } = [];

    public static ApiResponse<T> Ok(T data, string message = "Success")
        => new() { Success = true, Message = message, Data = data };

    public static ApiResponse<T> Fail(string error, string message = "An error occurred")
        => new() { Success = false, Message = message, Errors = [error] };

    public static ApiResponse<T> Fail(IEnumerable<string> errors, string message = "Validation failed")
        => new() { Success = false, Message = message, Errors = errors.ToList() };
}
