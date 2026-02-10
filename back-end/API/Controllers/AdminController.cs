using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for admin operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    /// <summary>
    /// Get all submissions (attendees, speakers, partners)
    /// </summary>
    [HttpGet("submissions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllSubmissions()
    {
        var result = await _adminService.GetAllSubmissionsAsync();
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get dashboard statistics
    /// </summary>
    [HttpGet("dashboard")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> GetDashboardStats()
    {
        var result = await _adminService.GetDashboardStatsAsync();
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
