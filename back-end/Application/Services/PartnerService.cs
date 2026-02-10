using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;

namespace Application.Services;

/// <summary>
/// Service implementation for partner operations
/// </summary>
public class PartnerService : IPartnerService
{
    private readonly IPartnerRepository _repository;
    private readonly IMapper _mapper;

    public PartnerService(IPartnerRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PartnerResponse>> SubmitPartnerAsync(SubmitPartnerRequest request, Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = _mapper.Map<PartnerRequest>(request);
            entity.Id = Guid.NewGuid();
            entity.UserId = userId; // Link to current logged-in user
            entity.Status = SubmissionStatus.Pending;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            var response = _mapper.Map<PartnerResponse>(entity);
            return ApiResponse<PartnerResponse>.SuccessResponse(response, "Partnership request submitted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<PartnerResponse>.ErrorResponse($"Failed to submit partnership request: {ex.Message}");
        }
    }

    public async Task<ApiResponse<PartnerResponse>> GetPartnerByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await _repository.GetByIdAsync(id, cancellationToken);
            if (entity == null)
            {
                return ApiResponse<PartnerResponse>.ErrorResponse("Partnership request not found");
            }

            var response = _mapper.Map<PartnerResponse>(entity);
            return ApiResponse<PartnerResponse>.SuccessResponse(response);
        }
        catch (Exception ex)
        {
            return ApiResponse<PartnerResponse>.ErrorResponse($"Failed to get partner: {ex.Message}");
        }
    }

    public async Task<ApiResponse<PaginatedResponse<PartnerResponse>>> GetAllPartnersAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        try
        {
            var allPartners = await _repository.GetAllAsync(cancellationToken);
            var total = allPartners.Count();
            var paged = allPartners.Skip((page - 1) * pageSize).Take(pageSize);

            var responses = _mapper.Map<IEnumerable<PartnerResponse>>(paged);

            var paginatedResponse = new PaginatedResponse<PartnerResponse>
            {
                Data = responses,
                Total = total,
                Page = page,
                PageSize = pageSize
            };

            return ApiResponse<PaginatedResponse<PartnerResponse>>.SuccessResponse(paginatedResponse);
        }
        catch (Exception ex)
        {
            return ApiResponse<PaginatedResponse<PartnerResponse>>.ErrorResponse($"Failed to get partners: {ex.Message}");
        }
    }

    public async Task<ApiResponse<PartnerResponse>> UpdatePartnerStatusAsync(Guid id, SubmissionStatus status, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await _repository.GetByIdAsync(id, cancellationToken);
            if (entity == null)
            {
                return ApiResponse<PartnerResponse>.ErrorResponse("Partnership request not found");
            }

            entity.Status = status;
            entity.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(entity, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            var response = _mapper.Map<PartnerResponse>(entity);
            return ApiResponse<PartnerResponse>.SuccessResponse(response, "Status updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<PartnerResponse>.ErrorResponse($"Failed to update status: {ex.Message}");
        }
    }
}
