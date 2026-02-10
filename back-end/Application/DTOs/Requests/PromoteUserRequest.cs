using System.Text.Json.Serialization;

namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for promoting a user by email
/// </summary>
public class PromoteUserRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("promotionType")]
    public string PromotionType { get; set; } = string.Empty; // "speaker", "partner", "staff"

    // Optional fields for speaker/partner (if not provided, will use user's existing data)
    [JsonPropertyName("organization")]
    public string? Organization { get; set; }

    [JsonPropertyName("category")]
    public string? Category { get; set; }

    [JsonPropertyName("occupation")]
    public string? Occupation { get; set; }

    [JsonPropertyName("institution")]
    public string? Institution { get; set; }
}
