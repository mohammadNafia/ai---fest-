using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for OAuth sign-in
/// </summary>
public class OAuthSignInRequest
{
    /// <summary>
    /// OAuth provider (google, github, etc.)
    /// </summary>
    [Required(ErrorMessage = "Provider is required")]
    public string Provider { get; set; } = string.Empty;

    /// <summary>
    /// OAuth access token from provider
    /// </summary>
    [Required(ErrorMessage = "Access token is required")]
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// User's email from OAuth provider
    /// </summary>
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's name from OAuth provider
    /// </summary>
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// User's avatar URL from OAuth provider (optional)
    /// </summary>
    public string? AvatarUrl { get; set; }
}
