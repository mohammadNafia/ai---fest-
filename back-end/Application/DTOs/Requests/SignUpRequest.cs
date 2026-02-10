using System.Text.Json.Serialization;

namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for user sign-up
/// </summary>
public class SignUpRequest
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("age")]
    public int Age { get; set; }
    
    [JsonPropertyName("occupation")]
    public string Occupation { get; set; } = string.Empty;
    
    [JsonPropertyName("organization")]
    public string Organization { get; set; } = string.Empty;
    
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
    
    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;
}
