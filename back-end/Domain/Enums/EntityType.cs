namespace Domain.Enums;

/// <summary>
/// Represents the type of entity in activity logs
/// </summary>
public enum EntityType
{
    /// <summary>
    /// Attendee registration entity
    /// </summary>
    Attendee = 0,

    /// <summary>
    /// Speaker application entity
    /// </summary>
    Speaker = 1,

    /// <summary>
    /// Partner request entity
    /// </summary>
    Partner = 2
}
