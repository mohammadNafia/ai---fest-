using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;

namespace Application.Services;

/// <summary>
/// Service implementation for speaker operations
/// </summary>
public class SpeakerService : ISpeakerService
{
    private readonly ISpeakerRepository _repository;
    private readonly IMapper _mapper;

    public SpeakerService(ISpeakerRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<SpeakerResponse>> SubmitSpeakerAsync(SubmitSpeakerRequest request, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = _mapper.Map<SpeakerApplication>(request);
            entity.Id = Guid.NewGuid();
            entity.UserId = userId; // Link to current logged-in user
            entity.Status = SubmissionStatus.Pending;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            var response = _mapper.Map<SpeakerResponse>(entity);
            return ApiResponse<SpeakerResponse>.SuccessResponse(response, "Speaker application submitted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<SpeakerResponse>.ErrorResponse($"Failed to submit speaker application: {ex.Message}");
        }
    }

    public async Task<ApiResponse<SpeakerResponse>> GetSpeakerByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await _repository.GetByIdAsync(id, cancellationToken);
            if (entity == null)
            {
                return ApiResponse<SpeakerResponse>.ErrorResponse("Speaker application not found");
            }

            var response = _mapper.Map<SpeakerResponse>(entity);
            return ApiResponse<SpeakerResponse>.SuccessResponse(response);
        }
        catch (Exception ex)
        {
            return ApiResponse<SpeakerResponse>.ErrorResponse($"Failed to get speaker: {ex.Message}");
        }
    }

    public async Task<ApiResponse<PaginatedResponse<SpeakerResponse>>> GetAllSpeakersAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        try
        {
            var allSpeakers = await _repository.GetAllAsync(cancellationToken);
            var total = allSpeakers.Count();
            var paged = allSpeakers.Skip((page - 1) * pageSize).Take(pageSize);

            var responses = _mapper.Map<IEnumerable<SpeakerResponse>>(paged);

            var paginatedResponse = new PaginatedResponse<SpeakerResponse>
            {
                Data = responses,
                Total = total,
                Page = page,
                PageSize = pageSize
            };

            return ApiResponse<PaginatedResponse<SpeakerResponse>>.SuccessResponse(paginatedResponse);
        }
        catch (Exception ex)
        {
            return ApiResponse<PaginatedResponse<SpeakerResponse>>.ErrorResponse($"Failed to get speakers: {ex.Message}");
        }
    }

    public async Task<ApiResponse<SpeakerResponse>> UpdateSpeakerStatusAsync(Guid id, SubmissionStatus status, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await _repository.GetByIdAsync(id, cancellationToken);
            if (entity == null)
            {
                return ApiResponse<SpeakerResponse>.ErrorResponse("Speaker application not found");
            }

            entity.Status = status;
            entity.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(entity, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            var response = _mapper.Map<SpeakerResponse>(entity);
            return ApiResponse<SpeakerResponse>.SuccessResponse(response, "Status updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<SpeakerResponse>.ErrorResponse($"Failed to update status: {ex.Message}");
        }
    }
}
