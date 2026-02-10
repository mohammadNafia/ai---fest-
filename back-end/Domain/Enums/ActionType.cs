namespace Domain.Enums;

/// <summary>
/// Represents the type of action performed on an entity
/// </summary>
public enum ActionType
{
    /// <summary>
    /// Entity was created
    /// </summary>
    Created = 0,

    /// <summary>
    /// Entity was updated
    /// </summary>
    Updated = 1,

    /// <summary>
    /// Entity was deleted
    /// </summary>
    Deleted = 2,

    /// <summary>
    /// Entity was approved
    /// </summary>
    Approved = 3,

    /// <summary>
    /// Entity was rejected
    /// </summary>
    Rejected = 4
}
