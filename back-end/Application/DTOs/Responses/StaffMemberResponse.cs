using Domain.Enums;

namespace Application.DTOs.Responses;

/// <summary>
/// Response DTO for staff member with permissions
/// </summary>
public class StaffMemberResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User's email
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// User's phone number
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// User's role (should be Staff)
    /// </summary>
    public UserRole Role { get; set; }

    /// <summary>
    /// Whether the user is active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Whether the email is verified
    /// </summary>
    public bool EmailVerified { get; set; }

    /// <summary>
    /// Last login timestamp
    /// </summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Created at timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Staff permissions
    /// </summary>
    public StaffPermissionsResponse? Permissions { get; set; }
}

/// <summary>
/// Response DTO for staff permissions
/// </summary>
public class StaffPermissionsResponse
{
    /// <summary>
    /// Can view attendees
    /// </summary>
    public bool CanViewAttendees { get; set; }

    /// <summary>
    /// Can manage (approve/reject) attendees
    /// </summary>
    public bool CanManageAttendees { get; set; }

    /// <summary>
    /// Can view speakers
    /// </summary>
    public bool CanViewSpeakers { get; set; }

    /// <summary>
    /// Can manage (approve/reject) speakers
    /// </summary>
    public bool CanManageSpeakers { get; set; }

    /// <summary>
    /// Can view partners
    /// </summary>
    public bool CanViewPartners { get; set; }

    /// <summary>
    /// Can manage (approve/reject) partners
    /// </summary>
    public bool CanManagePartners { get; set; }

    /// <summary>
    /// Can view users
    /// </summary>
    public bool CanViewUsers { get; set; }

    /// <summary>
    /// Can delete users
    /// </summary>
    public bool CanDeleteUsers { get; set; }

    /// <summary>
    /// Can export data
    /// </summary>
    public bool CanExportData { get; set; }

    /// <summary>
    /// Can view analytics
    /// </summary>
    public bool CanViewAnalytics { get; set; }

    /// <summary>
    /// Can manage content
    /// </summary>
    public bool CanManageContent { get; set; }
}
