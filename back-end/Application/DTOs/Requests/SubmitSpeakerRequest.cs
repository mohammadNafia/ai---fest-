namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for submitting a speaker application
/// </summary>
public class SubmitSpeakerRequest
{
    public string Name { get; set; } = string.Empty;
    public string Occupation { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string Topics { get; set; } = string.Empty;
    public string Achievements { get; set; } = string.Empty;
}
