using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Domain.Enums;

namespace Application.Interfaces;

/// <summary>
/// Service interface for speaker operations
/// </summary>
public interface ISpeakerService
{
    Task<ApiResponse<SpeakerResponse>> SubmitSpeakerAsync(SubmitSpeakerRequest request, Guid userId, CancellationToken cancellationToken = default);
    Task<ApiResponse<SpeakerResponse>> GetSpeakerByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ApiResponse<PaginatedResponse<SpeakerResponse>>> GetAllSpeakersAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);
    Task<ApiResponse<SpeakerResponse>> UpdateSpeakerStatusAsync(Guid id, SubmissionStatus status, CancellationToken cancellationToken = default);
}
