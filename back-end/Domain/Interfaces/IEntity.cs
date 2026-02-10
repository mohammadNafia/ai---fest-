namespace Domain.Interfaces;

/// <summary>
/// Base interface for all domain entities
/// </summary>
public interface IEntity
{
    /// <summary>
    /// Unique identifier for the entity
    /// </summary>
    Guid Id { get; set; }
}
