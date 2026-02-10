using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for CMS operations (featured speakers for homepage)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CMSController : ControllerBase
{
    private readonly ICMSService _cmsService;
    private readonly ILogger<CMSController> _logger;

    public CMSController(ICMSService cmsService, ILogger<CMSController> logger)
    {
        _cmsService = cmsService;
        _logger = logger;
    }

    /// <summary>
    /// Get all active CMS speakers (for homepage display)
    /// </summary>
    [HttpGet("speakers")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CMSSpeakerResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<CMSSpeakerResponse>>>> GetSpeakers()
    {
        var result = await _cmsService.GetAllSpeakersAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get CMS speaker by ID
    /// </summary>
    [HttpGet("speakers/{id}")]
    [ProducesResponseType(typeof(ApiResponse<CMSSpeakerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CMSSpeakerResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CMSSpeakerResponse>>> GetSpeaker(Guid id)
    {
        var result = await _cmsService.GetSpeakerByIdAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Create a new CMS speaker (Admin only)
    /// </summary>
    [HttpPost("speakers")]
    [ProducesResponseType(typeof(ApiResponse<CMSSpeakerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CMSSpeakerResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<CMSSpeakerResponse>>> CreateSpeaker([FromBody] CMSSpeakerRequest request)
    {
        var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(adminUserIdHeader) || !Guid.TryParse(adminUserIdHeader, out var adminUserId))
        {
            return Unauthorized(ApiResponse<CMSSpeakerResponse>.ErrorResponse("Admin user ID is required"));
        }

        var result = await _cmsService.CreateSpeakerAsync(request, adminUserId);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Update a CMS speaker (Admin only)
    /// </summary>
    [HttpPut("speakers/{id}")]
    [ProducesResponseType(typeof(ApiResponse<CMSSpeakerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CMSSpeakerResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<CMSSpeakerResponse>>> UpdateSpeaker(Guid id, [FromBody] CMSSpeakerRequest request)
    {
        var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(adminUserIdHeader) || !Guid.TryParse(adminUserIdHeader, out var adminUserId))
        {
            return Unauthorized(ApiResponse<CMSSpeakerResponse>.ErrorResponse("Admin user ID is required"));
        }

        var result = await _cmsService.UpdateSpeakerAsync(id, request, adminUserId);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    /// <summary>
    /// Delete a CMS speaker (Admin only)
    /// </summary>
    [HttpDelete("speakers/{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteSpeaker(Guid id)
    {
        var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(adminUserIdHeader) || !Guid.TryParse(adminUserIdHeader, out var adminUserId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Admin user ID is required"));
        }

        var result = await _cmsService.DeleteSpeakerAsync(id, adminUserId);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }
}
