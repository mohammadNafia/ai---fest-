using Application.DTOs.Requests;
using Application.DTOs.Responses;

namespace Application.Interfaces;

/// <summary>
/// Service interface for CMS operations (featured speakers)
/// </summary>
public interface ICMSService
{
    Task<ApiResponse<IEnumerable<CMSSpeakerResponse>>> GetAllSpeakersAsync(CancellationToken cancellationToken = default);
    Task<ApiResponse<CMSSpeakerResponse>> GetSpeakerByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ApiResponse<CMSSpeakerResponse>> CreateSpeakerAsync(CMSSpeakerRequest request, Guid adminUserId, CancellationToken cancellationToken = default);
    Task<ApiResponse<CMSSpeakerResponse>> UpdateSpeakerAsync(Guid id, CMSSpeakerRequest request, Guid adminUserId, CancellationToken cancellationToken = default);
    Task<ApiResponse<object>> DeleteSpeakerAsync(Guid id, Guid adminUserId, CancellationToken cancellationToken = default);
}
