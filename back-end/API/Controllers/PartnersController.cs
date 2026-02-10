using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for partnership request operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PartnersController : ControllerBase
{
    private readonly IPartnerService _partnerService;

    public PartnersController(IPartnerService partnerService)
    {
        _partnerService = partnerService;
    }

    /// <summary>
    /// Submit a new partnership request (requires authentication)
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PartnerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PartnerResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<PartnerResponse>>> SubmitPartner([FromBody] SubmitPartnerRequest request)
    {
        // Get user ID from header (from current logged-in user)
        var userIdHeader = Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userIdHeader) || !Guid.TryParse(userIdHeader, out var userId))
        {
            return Unauthorized(ApiResponse<PartnerResponse>.ErrorResponse("User ID is required. Please sign in first."));
        }

        var result = await _partnerService.SubmitPartnerAsync(request, userId);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get partner by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<PartnerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PartnerResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PartnerResponse>>> GetPartner(Guid id)
    {
        var result = await _partnerService.GetPartnerByIdAsync(id);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get all partners with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResponse<PartnerResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<PartnerResponse>>>> GetAllPartners(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _partnerService.GetAllPartnersAsync(page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Update partner status
    /// </summary>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(typeof(ApiResponse<PartnerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PartnerResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PartnerResponse>>> UpdateStatus(
        Guid id, 
        [FromBody] SubmissionStatus status)
    {
        var result = await _partnerService.UpdatePartnerStatusAsync(id, status);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
}
