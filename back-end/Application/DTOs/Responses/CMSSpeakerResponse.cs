namespace Application.DTOs.Responses;

/// <summary>
/// Response DTO for CMS Speaker
/// </summary>
public class CMSSpeakerResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? NameAr { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? RoleAr { get; set; }
    public string Company { get; set; } = string.Empty;
    public string? CompanyAr { get; set; }
    public string Image { get; set; } = string.Empty;
    public string? Topic { get; set; }
    public string? TopicAr { get; set; }
    public string? Bio { get; set; }
    public string? BioAr { get; set; }
    public string? LinkedIn { get; set; }
    public string? Twitter { get; set; }
    public string? Website { get; set; }
    public bool IsFeatured { get; set; }
    public int OrderIndex { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
