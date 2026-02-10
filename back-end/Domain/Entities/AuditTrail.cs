using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

/// <summary>
/// Represents an audit trail entry for tracking data changes
/// </summary>
public class AuditTrail : IEntity
{
    /// <summary>
    /// Unique identifier for the audit entry
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Name of the table that was modified
    /// </summary>
    public string TableName { get; set; } = string.Empty;

    /// <summary>
    /// ID of the record that was modified
    /// </summary>
    public Guid RecordId { get; set; }

    /// <summary>
    /// Type of action performed (INSERT, UPDATE, DELETE)
    /// </summary>
    public ActionType Action { get; set; }

    /// <summary>
    /// Previous values before the change (stored as JSON, nullable)
    /// </summary>
    public string? OldValues { get; set; }

    /// <summary>
    /// New values after the change (stored as JSON, nullable)
    /// </summary>
    public string? NewValues { get; set; }

    /// <summary>
    /// ID of the user who made the change (nullable)
    /// </summary>
    public Guid? ChangedBy { get; set; }

    /// <summary>
    /// Date and time when the change was made
    /// </summary>
    public DateTime ChangedAt { get; set; }

    // Navigation properties
    /// <summary>
    /// User who made the change
    /// </summary>
    public virtual User? User { get; set; }
}
