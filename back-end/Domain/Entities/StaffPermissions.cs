using Domain.Interfaces;

namespace Domain.Entities;

/// <summary>
/// Represents configurable permissions for staff members
/// Admin can configure what staff members can and cannot do
/// </summary>
public class StaffPermissions : IEntity, IAuditable
{
    /// <summary>
    /// Unique identifier for the permissions record
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// ID of the staff user these permissions belong to
    /// </summary>
    public Guid StaffUserId { get; set; }

    /// <summary>
    /// Can view attendees
    /// </summary>
    public bool CanViewAttendees { get; set; } = false;

    /// <summary>
    /// Can approve/reject attendees
    /// </summary>
    public bool CanManageAttendees { get; set; } = false;

    /// <summary>
    /// Can view speakers
    /// </summary>
    public bool CanViewSpeakers { get; set; } = false;

    /// <summary>
    /// Can approve/reject speakers
    /// </summary>
    public bool CanManageSpeakers { get; set; } = false;

    /// <summary>
    /// Can view partners
    /// </summary>
    public bool CanViewPartners { get; set; } = false;

    /// <summary>
    /// Can approve/reject partners
    /// </summary>
    public bool CanManagePartners { get; set; } = false;

    /// <summary>
    /// Can view users
    /// </summary>
    public bool CanViewUsers { get; set; } = false;

    /// <summary>
    /// Can delete users
    /// </summary>
    public bool CanDeleteUsers { get; set; } = false;

    /// <summary>
    /// Can export data
    /// </summary>
    public bool CanExportData { get; set; } = false;

    /// <summary>
    /// Can view analytics
    /// </summary>
    public bool CanViewAnalytics { get; set; } = false;

    /// <summary>
    /// Can manage content
    /// </summary>
    public bool CanManageContent { get; set; } = false;

    // IAuditable implementation
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Navigation properties
    /// <summary>
    /// Staff user these permissions belong to
    /// </summary>
    public virtual User? StaffUser { get; set; }
}
