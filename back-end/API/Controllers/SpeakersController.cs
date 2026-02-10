using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for speaker application operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SpeakersController : ControllerBase
{
    private readonly ISpeakerService _speakerService;

    public SpeakersController(ISpeakerService speakerService)
    {
        _speakerService = speakerService;
    }

    /// <summary>
    /// Submit a new speaker application (requires authentication)
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<SpeakerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<SpeakerResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<SpeakerResponse>>> SubmitSpeaker([FromBody] SubmitSpeakerRequest request)
    {
        // Get user ID from header (from current logged-in user)
        var userIdHeader = Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userIdHeader) || !Guid.TryParse(userIdHeader, out var userId))
        {
            return Unauthorized(ApiResponse<SpeakerResponse>.ErrorResponse("User ID is required. Please sign in first."));
        }

        var result = await _speakerService.SubmitSpeakerAsync(request, userId);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get speaker by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<SpeakerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<SpeakerResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<SpeakerResponse>>> GetSpeaker(Guid id)
    {
        var result = await _speakerService.GetSpeakerByIdAsync(id);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get all speakers with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResponse<SpeakerResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<SpeakerResponse>>>> GetAllSpeakers(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _speakerService.GetAllSpeakersAsync(page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Update speaker status
    /// </summary>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(typeof(ApiResponse<SpeakerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<SpeakerResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<SpeakerResponse>>> UpdateStatus(
        Guid id, 
        [FromBody] SubmissionStatus status)
    {
        var result = await _speakerService.UpdateSpeakerStatusAsync(id, status);
        
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
}
