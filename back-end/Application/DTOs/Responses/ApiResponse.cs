namespace Application.DTOs.Responses;

/// <summary>
/// Standard API response wrapper
/// </summary>
/// <typeparam name="T">Type of data being returned</typeparam>
public class ApiResponse<T>
{
    /// <summary>
    /// Indicates whether the operation was successful
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Response data (only present when Success is true)
    /// </summary>
    public T? Data { get; set; }

    /// <summary>
    /// Error message (only present when Success is false)
    /// </summary>
    public string? Error { get; set; }

    /// <summary>
    /// Optional success message
    /// </summary>
    public string? Message { get; set; }

    public static ApiResponse<T> SuccessResponse(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static ApiResponse<T> ErrorResponse(string error)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Error = error
        };
    }
}
