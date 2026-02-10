using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

/// <summary>
/// Represents an activity log entry for tracking system actions
/// </summary>
public class ActivityLog : IEntity
{
    /// <summary>
    /// Unique identifier for the log entry
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// ID of the user who performed the action (nullable)
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// Type of entity the action was performed on
    /// </summary>
    public EntityType EntityType { get; set; }

    /// <summary>
    /// ID of the entity the action was performed on
    /// </summary>
    public Guid EntityId { get; set; }

    /// <summary>
    /// Type of action performed
    /// </summary>
    public ActionType Action { get; set; }

    /// <summary>
    /// Additional details about the action (stored as JSON)
    /// </summary>
    public string? Details { get; set; }

    /// <summary>
    /// IP address of the user who performed the action (nullable)
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent of the client that performed the action (nullable)
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Date and time when the action was performed
    /// </summary>
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    /// <summary>
    /// User who performed the action
    /// </summary>
    public virtual User? User { get; set; }
}
