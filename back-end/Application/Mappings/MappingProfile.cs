using Application.DTOs.Requests;
using Application.DTOs.Responses;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

/// <summary>
/// AutoMapper profile for entity to DTO mappings
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Request to Entity mappings
        // RegisterAttendeeRequest mapping removed - Users are created directly via SignUp (role=User)
        
        CreateMap<SubmitSpeakerRequest, SpeakerApplication>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.ReviewedBy, opt => opt.Ignore())
            .ForMember(dest => dest.ReviewedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Reviewer, opt => opt.Ignore());

        CreateMap<SubmitPartnerRequest, PartnerRequest>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.ReviewedBy, opt => opt.Ignore())
            .ForMember(dest => dest.ReviewedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Reviewer, opt => opt.Ignore());

        // Entity to Response mappings
        // AttendeeRegistration mapping removed - Users with role=User are attendees
        CreateMap<SpeakerApplication, SpeakerResponse>();
        CreateMap<PartnerRequest, PartnerResponse>();
        CreateMap<User, UserResponse>();
        CreateMap<StaffPermissions, StaffPermissionsResponse>();
        
        // CMS Speaker mappings
        CreateMap<CMSSpeaker, CMSSpeakerResponse>();
        CreateMap<CMSSpeakerRequest, CMSSpeaker>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore());
    }
}
