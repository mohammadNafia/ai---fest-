using Application.DTOs.Responses;
using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace API.Middleware;

/// <summary>
/// Global error handling middleware
/// </summary>
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
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
            _logger.LogError(ex, "An unhandled exception occurred: {ExceptionType} - {Message} - {StackTrace}", 
                ex.GetType().Name, ex.Message, ex.StackTrace);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        var message = "An error occurred while processing your request.";

        // Handle specific exception types
        switch (exception)
        {
            case ArgumentNullException:
            case ArgumentException:
                code = HttpStatusCode.BadRequest;
                message = exception.Message;
                break;
            case UnauthorizedAccessException:
                code = HttpStatusCode.Unauthorized;
                message = "Unauthorized access.";
                break;
            case KeyNotFoundException:
                code = HttpStatusCode.NotFound;
                message = exception.Message;
                break;
            case Microsoft.EntityFrameworkCore.DbUpdateException dbEx:
                // Database update/connection issue
                code = HttpStatusCode.ServiceUnavailable;
                message = $"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}";
                break;
            case Npgsql.NpgsqlException npgsqlEx:
                // PostgreSQL connection issue
                code = HttpStatusCode.ServiceUnavailable;
                message = $"Database connection error: {npgsqlEx.Message}. Please ensure PostgreSQL is running.";
                break;
            case InvalidOperationException invOpEx when invOpEx.Message.Contains("database") || invOpEx.Message.Contains("connection") || invOpEx.Message.Contains("No database provider"):
                // Database not configured
                code = HttpStatusCode.ServiceUnavailable;
                message = "Database is not available. Please ensure the database is created and migrations are applied.";
                break;
        }

        // Include inner exception details for debugging
        if (exception.InnerException != null && !string.IsNullOrEmpty(exception.InnerException.Message))
        {
            message += $" Details: {exception.InnerException.Message}";
        }

        var response = ApiResponse<object>.ErrorResponse(message);
        var result = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        return context.Response.WriteAsync(result);
    }
}
