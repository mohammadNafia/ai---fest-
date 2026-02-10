namespace Domain.Enums;

/// <summary>
/// Represents the role of a user in the system
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Guest user with minimal access
    /// </summary>
    Guest = 0,

    /// <summary>
    /// Regular authenticated user
    /// </summary>
    User = 1,

    /// <summary>
    /// Administrator with full access
    /// </summary>
    Admin = 2,

    /// <summary>
    /// Staff member with limited administrative access
    /// </summary>
    Staff = 3,

    /// <summary>
    /// Reviewer with content review permissions
    /// </summary>
    Reviewer = 4,

    /// <summary>
    /// Speaker at the summit
    /// </summary>
    Speaker = 5,

    /// <summary>
    /// Partner/Sponsor/Media/Startup
    /// </summary>
    Partner = 6
}
