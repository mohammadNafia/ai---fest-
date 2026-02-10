using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

/// <summary>
/// Represents a partnership request for the summit
/// </summary>
public class PartnerRequest : IEntity, IAuditable
{
    /// <summary>
    /// Unique identifier for the request
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// ID of the user who submitted this request (nullable)
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// Organization or company name
    /// </summary>
    public string Organization { get; set; } = string.Empty;

    /// <summary>
    /// Contact email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Partnership category
    /// </summary>
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Partnership requirements or details (optional)
    /// </summary>
    public string? Requirements { get; set; }

    /// <summary>
    /// Current status of the request
    /// </summary>
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Pending;

    /// <summary>
    /// ID of the user who reviewed this request (nullable)
    /// </summary>
    public Guid? ReviewedBy { get; set; }

    /// <summary>
    /// Date and time when the request was reviewed (nullable)
    /// </summary>
    public DateTime? ReviewedAt { get; set; }

    // IAuditable implementation
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Navigation properties
    /// <summary>
    /// User who submitted this request
    /// </summary>
    public virtual User? User { get; set; }

    /// <summary>
    /// User who reviewed this request
    /// </summary>
    public virtual User? Reviewer { get; set; }
}
