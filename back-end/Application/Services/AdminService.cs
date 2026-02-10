using Application.DTOs.Responses;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Persistence;

namespace Application.Services;

/// <summary>
/// Service implementation for admin operations
/// </summary>
public class AdminService : IAdminService
{
    private readonly ISpeakerRepository _speakerRepository;
    private readonly IPartnerRepository _partnerRepository;
    private readonly IMapper _mapper;

    public AdminService(
        ISpeakerRepository speakerRepository,
        IPartnerRepository partnerRepository,
        IMapper mapper)
    {
        _speakerRepository = speakerRepository;
        _partnerRepository = partnerRepository;
        _mapper = mapper;
    }

    public Task<ApiResponse<object>> GetAllSubmissionsAsync(CancellationToken cancellationToken = default)
    {
        // For now, return empty results to allow API to work without database
        // TODO: Enable database queries once database is set up
        // Note: Attendees are now Users with role=User, accessed via User endpoints
        var result = new
        {
            Attendees = Array.Empty<object>(), // Users with role=User are attendees
            Speakers = Array.Empty<SpeakerResponse>(),
            Partners = Array.Empty<PartnerResponse>(),
            TotalCount = 0,
            Message = "Database not configured. Please ensure PostgreSQL is running and migrations are applied."
        };

        return Task.FromResult(ApiResponse<object>.SuccessResponse(result));
    }

    public Task<ApiResponse<object>> GetDashboardStatsAsync(CancellationToken cancellationToken = default)
    {
        // For now, return empty stats to allow API to work without database
        // TODO: Enable database queries once database is set up
        var stats = new
        {
            TotalAttendees = 0,
            TotalSpeakers = 0,
            TotalPartners = 0,
            PendingAttendees = 0,
            PendingSpeakers = 0,
            PendingPartners = 0,
            ApprovedAttendees = 0,
            ApprovedSpeakers = 0,
            ApprovedPartners = 0
        };

        return Task.FromResult(ApiResponse<object>.SuccessResponse(stats));
    }
}
