using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Domain.Enums;

namespace Application.DTOs.Requests;

/// <summary>
/// Request DTO for updating user role (admin only)
/// </summary>
public class UpdateUserRoleRequest
{
    /// <summary>
    /// User ID to update
    /// </summary>
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    /// <summary>
    /// New role to assign (as string - will be converted to enum)
    /// </summary>
    [JsonPropertyName("role")]
    public string? RoleString { get; set; }

    /// <summary>
    /// Parsed role enum (computed property)
    /// </summary>
    [JsonIgnore]
    public UserRole Role
    {
        get
        {
            if (string.IsNullOrWhiteSpace(RoleString))
                return UserRole.Guest;
            
            // Try case-insensitive enum parsing
            if (Enum.TryParse<UserRole>(RoleString, true, out var result))
            {
                return result;
            }
            
            return UserRole.Guest;
        }
    }
}
