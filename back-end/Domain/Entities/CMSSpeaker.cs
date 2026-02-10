using Domain.Interfaces;

namespace Domain.Entities;

/// <summary>
/// Represents a featured speaker for display on the homepage (World Class Minds section)
/// This is separate from SpeakerApplication which is for speaker submissions
/// </summary>
public class CMSSpeaker : IEntity, IAuditable
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Speaker's name (English)
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's name (Arabic)
    /// </summary>
    public string? NameAr { get; set; }

    /// <summary>
    /// Speaker's role/title (English)
    /// </summary>
    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's role/title (Arabic)
    /// </summary>
    public string? RoleAr { get; set; }

    /// <summary>
    /// Speaker's company/organization (English)
    /// </summary>
    public string Company { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's company/organization (Arabic)
    /// </summary>
    public string? CompanyAr { get; set; }

    /// <summary>
    /// Speaker's profile image URL
    /// </summary>
    public string Image { get; set; } = string.Empty;

    /// <summary>
    /// Speaker's topic (English)
    /// </summary>
    public string? Topic { get; set; }

    /// <summary>
    /// Speaker's topic (Arabic)
    /// </summary>
    public string? TopicAr { get; set; }

    /// <summary>
    /// Speaker's bio (English)
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Speaker's bio (Arabic)
    /// </summary>
    public string? BioAr { get; set; }

    /// <summary>
    /// LinkedIn profile URL
    /// </summary>
    public string? LinkedIn { get; set; }

    /// <summary>
    /// Twitter/X profile URL
    /// </summary>
    public string? Twitter { get; set; }

    /// <summary>
    /// Website URL
    /// </summary>
    public string? Website { get; set; }

    /// <summary>
    /// Whether this speaker is featured
    /// </summary>
    public bool IsFeatured { get; set; } = true;

    /// <summary>
    /// Display order for sorting
    /// </summary>
    public int OrderIndex { get; set; } = 0;

    /// <summary>
    /// Whether this speaker is active (visible on homepage)
    /// </summary>
    public bool IsActive { get; set; } = true;

    // IAuditable implementation
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}
