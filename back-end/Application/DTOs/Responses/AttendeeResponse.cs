using Domain.Enums;

namespace Application.DTOs.Responses;

/// <summary>
/// Response DTO for attendee registration
/// </summary>
public class AttendeeResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Occupation { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Motivation { get; set; } = string.Empty;
    public SubmissionStatus Status { get; set; }
    public bool Newsletter { get; set; }
    public DateTime CreatedAt { get; set; }
}
