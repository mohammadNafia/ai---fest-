namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for creating/updating CMS Speaker
/// </summary>
public class CMSSpeakerRequest
{
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
    public bool IsFeatured { get; set; } = true;
    public int OrderIndex { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
