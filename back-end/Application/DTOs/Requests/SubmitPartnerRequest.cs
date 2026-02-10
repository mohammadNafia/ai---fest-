namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for submitting a partnership request
/// </summary>
public class SubmitPartnerRequest
{
    public string Organization { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Requirements { get; set; }
}
