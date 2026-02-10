using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Domain.Enums;

namespace Application.Interfaces;

/// <summary>
/// Service interface for partner operations
/// </summary>
public interface IPartnerService
{
    Task<ApiResponse<PartnerResponse>> SubmitPartnerAsync(SubmitPartnerRequest request, Guid userId, CancellationToken cancellationToken = default);
    Task<ApiResponse<PartnerResponse>> GetPartnerByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ApiResponse<PaginatedResponse<PartnerResponse>>> GetAllPartnersAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);
    Task<ApiResponse<PartnerResponse>> UpdatePartnerStatusAsync(Guid id, SubmissionStatus status, CancellationToken cancellationToken = default);
}
