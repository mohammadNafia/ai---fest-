using Domain.Enums;

namespace Application.DTOs.Responses;

/// <summary>
/// Response DTO for partner request
/// </summary>
public class PartnerResponse
{
    public Guid Id { get; set; }
    public string Organization { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public SubmissionStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
