using System.Text.Json.Serialization;

namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for registering an attendee
/// </summary>
public class RegisterAttendeeRequest
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
    
    [JsonPropertyName("motivation")]
    public string Motivation { get; set; } = string.Empty;
    
    [JsonPropertyName("newsletter")]
    public bool Newsletter { get; set; } = false;
}
