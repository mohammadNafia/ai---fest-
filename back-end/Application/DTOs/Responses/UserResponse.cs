using Domain.Enums;

namespace Application.DTOs.Responses;

/// <summary>
/// Response DTO for user information
/// </summary>
public class UserResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User's email
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// User's phone number
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// User's role
    /// </summary>
    public UserRole Role { get; set; }

    /// <summary>
    /// User's avatar URL
    /// </summary>
    public string? AvatarUrl { get; set; }

    /// <summary>
    /// Whether the user is active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Whether the email is verified
    /// </summary>
    public bool EmailVerified { get; set; }

    /// <summary>
    /// Last login timestamp
    /// </summary>
    public DateTime? LastLoginAt { get; set; }
}
