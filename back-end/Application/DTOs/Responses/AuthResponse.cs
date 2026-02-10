using Application.DTOs.Responses;

namespace Application.DTOs.Responses;

/// <summary>
/// Response DTO for authentication operations
/// </summary>
public class AuthResponse
{
    /// <summary>
    /// JWT access token
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Refresh token (optional)
    /// </summary>
    public string? RefreshToken { get; set; }

    /// <summary>
    /// User information
    /// </summary>
    public UserResponse User { get; set; } = null!;

    /// <summary>
    /// Token expiration time
    /// </summary>
    public DateTime ExpiresAt { get; set; }
}
