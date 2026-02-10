using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

/// <summary>
/// Service implementation for CMS operations
/// </summary>
public class CMSService : ICMSService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CMSService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<IEnumerable<CMSSpeakerResponse>>> GetAllSpeakersAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var speakers = await _context.CMSSpeakers
                .Where(s => s.IsActive)
                .OrderBy(s => s.OrderIndex)
                .ThenBy(s => s.CreatedAt)
                .ToListAsync(cancellationToken);

            var responses = _mapper.Map<IEnumerable<CMSSpeakerResponse>>(speakers);
            return ApiResponse<IEnumerable<CMSSpeakerResponse>>.SuccessResponse(responses);
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<CMSSpeakerResponse>>.ErrorResponse($"Failed to get speakers: {ex.Message}");
        }
    }

    public async Task<ApiResponse<CMSSpeakerResponse>> GetSpeakerByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var speaker = await _context.CMSSpeakers.FindAsync(new object[] { id }, cancellationToken);
            if (speaker == null)
            {
                return ApiResponse<CMSSpeakerResponse>.ErrorResponse("Speaker not found");
            }

            var response = _mapper.Map<CMSSpeakerResponse>(speaker);
            return ApiResponse<CMSSpeakerResponse>.SuccessResponse(response);
        }
        catch (Exception ex)
        {
            return ApiResponse<CMSSpeakerResponse>.ErrorResponse($"Failed to get speaker: {ex.Message}");
        }
    }

    public async Task<ApiResponse<CMSSpeakerResponse>> CreateSpeakerAsync(CMSSpeakerRequest request, Guid adminUserId, CancellationToken cancellationToken = default)
    {
        try
        {
            var speaker = _mapper.Map<CMSSpeaker>(request);
            speaker.Id = Guid.NewGuid();
            speaker.CreatedAt = DateTime.UtcNow;
            speaker.UpdatedAt = DateTime.UtcNow;
            speaker.CreatedBy = adminUserId;
            speaker.UpdatedBy = adminUserId;

            _context.CMSSpeakers.Add(speaker);
            await _context.SaveChangesAsync(cancellationToken);

            var response = _mapper.Map<CMSSpeakerResponse>(speaker);
            return ApiResponse<CMSSpeakerResponse>.SuccessResponse(response, "Speaker created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<CMSSpeakerResponse>.ErrorResponse($"Failed to create speaker: {ex.Message}");
        }
    }

    public async Task<ApiResponse<CMSSpeakerResponse>> UpdateSpeakerAsync(Guid id, CMSSpeakerRequest request, Guid adminUserId, CancellationToken cancellationToken = default)
    {
        try
        {
            var speaker = await _context.CMSSpeakers.FindAsync(new object[] { id }, cancellationToken);
            if (speaker == null)
            {
                return ApiResponse<CMSSpeakerResponse>.ErrorResponse("Speaker not found");
            }

            _mapper.Map(request, speaker);
            speaker.UpdatedAt = DateTime.UtcNow;
            speaker.UpdatedBy = adminUserId;

            _context.CMSSpeakers.Update(speaker);
            await _context.SaveChangesAsync(cancellationToken);

            var response = _mapper.Map<CMSSpeakerResponse>(speaker);
            return ApiResponse<CMSSpeakerResponse>.SuccessResponse(response, "Speaker updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<CMSSpeakerResponse>.ErrorResponse($"Failed to update speaker: {ex.Message}");
        }
    }

    public async Task<ApiResponse<object>> DeleteSpeakerAsync(Guid id, Guid adminUserId, CancellationToken cancellationToken = default)
    {
        try
        {
            var speaker = await _context.CMSSpeakers.FindAsync(new object[] { id }, cancellationToken);
            if (speaker == null)
            {
                return ApiResponse<object>.ErrorResponse("Speaker not found");
            }

            _context.CMSSpeakers.Remove(speaker);
            await _context.SaveChangesAsync(cancellationToken);

            return ApiResponse<object>.SuccessResponse(new { id }, "Speaker deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<object>.ErrorResponse($"Failed to delete speaker: {ex.Message}");
        }
    }
}
