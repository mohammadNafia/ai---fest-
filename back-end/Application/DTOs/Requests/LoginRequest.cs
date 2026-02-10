using System.Text.Json.Serialization;

namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for user login (email OR phone + password)
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// User's email address OR phone number
    /// </summary>
    [JsonPropertyName("emailOrPhone")]
    public string EmailOrPhone { get; set; } = string.Empty;

    /// <summary>
    /// User's password
    /// </summary>
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}
