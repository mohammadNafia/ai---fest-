namespace Domain.Interfaces;

/// <summary>
/// Interface for entities that support soft deletion
/// </summary>
public interface ISoftDeletable
{
    /// <summary>
    /// Indicates whether the entity has been soft deleted
    /// </summary>
    bool IsDeleted { get; set; }

    /// <summary>
    /// Date and time when the entity was deleted (nullable)
    /// </summary>
    DateTime? DeletedAt { get; set; }

    /// <summary>
    /// ID of the user who deleted the entity (nullable)
    /// </summary>
    Guid? DeletedBy { get; set; }
}
