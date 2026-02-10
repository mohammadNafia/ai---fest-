namespace Domain.Interfaces;

/// <summary>
/// Interface for entities that track creation and modification information
/// </summary>
public interface IAuditable
{
    /// <summary>
    /// Date and time when the entity was created
    /// </summary>
    DateTime CreatedAt { get; set; }

    /// <summary>
    /// Date and time when the entity was last updated
    /// </summary>
    DateTime UpdatedAt { get; set; }

    /// <summary>
    /// ID of the user who created the entity (nullable)
    /// </summary>
    Guid? CreatedBy { get; set; }

    /// <summary>
    /// ID of the user who last updated the entity (nullable)
    /// </summary>
    Guid? UpdatedBy { get; set; }
}
