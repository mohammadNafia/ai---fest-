using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

/// <summary>
/// Represents a user in the system
/// </summary>
public class User : IEntity, IAuditable
{
    /// <summary>
    /// Unique identifier for the user
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User's email address (unique)
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's phone number (for login)
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// User's full name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Hashed password
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// User's role in the system
    /// </summary>
    public UserRole Role { get; set; } = UserRole.Guest;

    /// <summary>
    /// URL to user's avatar image (optional)
    /// </summary>
    public string? AvatarUrl { get; set; }

    /// <summary>
    /// Indicates whether the user account is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Indicates whether the user's email has been verified
    /// </summary>
    public bool EmailVerified { get; set; } = false;

    /// <summary>
    /// Date and time when the user last logged in (nullable)
    /// </summary>
    public DateTime? LastLoginAt { get; set; }

    // IAuditable implementation
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Navigation properties
    // AttendeeRegistrations removed - Users with role=User are attendees
    // No separate AttendeeRegistration table needed

    /// <summary>
    /// Speaker applications submitted by this user
    /// </summary>
    public virtual ICollection<SpeakerApplication> SpeakerApplications { get; set; } = new List<SpeakerApplication>();

    /// <summary>
    /// Partner requests submitted by this user
    /// </summary>
    public virtual ICollection<PartnerRequest> PartnerRequests { get; set; } = new List<PartnerRequest>();

    /// <summary>
    /// Activity logs created by this user
    /// </summary>
    public virtual ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();
}
