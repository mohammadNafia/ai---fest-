using Domain.Enums;

namespace Application.DTOs.Responses;

/// <summary>
/// Response DTO for speaker application
/// </summary>
public class SpeakerResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Occupation { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string Topics { get; set; } = string.Empty;
    public string Achievements { get; set; } = string.Empty;
    public SubmissionStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
