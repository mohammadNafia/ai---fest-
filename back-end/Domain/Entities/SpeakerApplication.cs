using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

/// <summary>
/// Represents a speaker application for the summit
/// </summary>
public class SpeakerApplication : IEntity, IAuditable
{
    /// <summary>
    /// Unique identifier for the application
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// ID of the user who submitted this application (nullable)
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// Speaker's full name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's occupation
    /// </summary>
    public string Occupation { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's institution or company
    /// </summary>
    public string Institution { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's phone number
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's skills and expertise
    /// </summary>
    public string Skills { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's professional experience
    /// </summary>
    public string Experience { get; set; } = string.Empty;

    /// <summary>
    /// Topics the speaker can present on
    /// </summary>
    public string Topics { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's achievements and accomplishments
    /// </summary>
    public string Achievements { get; set; } = string.Empty;

    /// <summary>
    /// Current status of the application
    /// </summary>
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Pending;

    /// <summary>
    /// ID of the user who reviewed this application (nullable)
    /// </summary>
    public Guid? ReviewedBy { get; set; }

    /// <summary>
    /// Date and time when the application was reviewed (nullable)
    /// </summary>
    public DateTime? ReviewedAt { get; set; }

    // IAuditable implementation
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Navigation properties
    /// <summary>
    /// User who submitted this application
    /// </summary>
    public virtual User? User { get; set; }

    /// <summary>
    /// User who reviewed this application
    /// </summary>
    public virtual User? Reviewer { get; set; }
}
