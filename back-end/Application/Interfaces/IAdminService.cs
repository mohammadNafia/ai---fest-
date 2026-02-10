using Application.DTOs.Responses;

namespace Application.Interfaces;

/// <summary>
/// Service interface for admin operations
/// </summary>
public interface IAdminService
{
    Task<ApiResponse<object>> GetAllSubmissionsAsync(CancellationToken cancellationToken = default);
    Task<ApiResponse<object>> GetDashboardStatsAsync(CancellationToken cancellationToken = default);
}
