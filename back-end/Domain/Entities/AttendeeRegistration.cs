using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

/// <summary>
/// Represents an attendee registration for the summit
/// </summary>
public class AttendeeRegistration : IEntity, IAuditable
{
    /// <summary>
    /// Unique identifier for the registration
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// ID of the user who submitted this registration (nullable)
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// Attendee's full name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Attendee's age
    /// </summary>
    public int Age { get; set; }

    /// <summary>
    /// Attendee's occupation
    /// </summary>
    public string Occupation { get; set; } = string.Empty;

    /// <summary>
    /// Attendee's organization or company
    /// </summary>
    public string Organization { get; set; } = string.Empty;

    /// <summary>
    /// Attendee's email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Attendee's phone number
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Attendee's motivation for attending
    /// </summary>
    public string Motivation { get; set; } = string.Empty;

    /// <summary>
    /// Current status of the registration
    /// </summary>
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Pending;

    /// <summary>
    /// Indicates whether the attendee wants to receive newsletter
    /// </summary>
    public bool Newsletter { get; set; } = false;

    /// <summary>
    /// ID of the user who reviewed this registration (nullable)
    /// </summary>
    public Guid? ReviewedBy { get; set; }

    /// <summary>
    /// Date and time when the registration was reviewed (nullable)
    /// </summary>
    public DateTime? ReviewedAt { get; set; }

    // IAuditable implementation
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Navigation properties
    /// <summary>
    /// User who submitted this registration
    /// </summary>
    public virtual User? User { get; set; }

    /// <summary>
    /// User who reviewed this registration
    /// </summary>
    public virtual User? Reviewer { get; set; }
}
