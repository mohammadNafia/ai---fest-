using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for authentication operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Sign up new user (creates User with User role)
    /// </summary>
    [HttpPost("signup")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> SignUp([FromBody] SignUpRequest request)
    {
        var result = await _authService.SignUpAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    // Login endpoint removed - only signup is allowed for authentication

    /// <summary>
    /// Update user role (Admin only)
    /// Only admin can upgrade users to admin/staff/user roles
    /// </summary>
    [HttpPost("users/update-role")]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> UpdateUserRole([FromBody] UpdateUserRoleRequest? request)
    {
        try
        {
            // Check if request is null (deserialization failed)
            if (request == null)
            {
                _logger.LogWarning("UpdateUserRole: Request body is null or could not be deserialized");
                return BadRequest(ApiResponse<UserResponse>.ErrorResponse("Invalid request body. Expected: { userId: string, role: string }"));
            }

            // Get admin user ID from header
            var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
            if (string.IsNullOrEmpty(adminUserIdHeader) || !Guid.TryParse(adminUserIdHeader, out var adminUserId))
            {
                return Unauthorized(ApiResponse<UserResponse>.ErrorResponse("Admin user ID is required"));
            }

            // Validate UserId is provided
            if (request.UserId == Guid.Empty)
            {
                _logger.LogWarning("UpdateUserRole: UserId is empty");
                return BadRequest(ApiResponse<UserResponse>.ErrorResponse("User ID is required"));
            }

            // Validate role string is provided
            if (string.IsNullOrWhiteSpace(request.RoleString))
            {
                _logger.LogWarning("UpdateUserRole: RoleString is empty. Request: UserId={UserId}", request.UserId);
                return BadRequest(ApiResponse<UserResponse>.ErrorResponse("Role is required"));
            }

            // Validate role is valid (not default/Guest)
            if (request.Role == UserRole.Guest)
            {
                _logger.LogWarning("UpdateUserRole: Invalid role '{RoleString}' for user {UserId}", request.RoleString, request.UserId);
                return BadRequest(ApiResponse<UserResponse>.ErrorResponse($"Invalid role: '{request.RoleString}'. Role must be User, Admin, Staff, Speaker, Partner, or Reviewer."));
            }

            _logger.LogInformation("Updating user {UserId} role to {Role} (from string: {RoleString})", request.UserId, request.Role, request.RoleString);

            var result = await _authService.UpdateUserRoleAsync(request, adminUserId);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception in UpdateUserRole endpoint: {ExceptionType} - {Message} - {StackTrace}", 
                ex.GetType().Name, ex.Message, ex.StackTrace);
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse($"An error occurred: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get current user information
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetCurrentUser()
    {
        // Get user ID from token (simplified - in production, extract from JWT)
        var userIdHeader = Request.Headers["X-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(userIdHeader) || !Guid.TryParse(userIdHeader, out var userId))
        {
            return Unauthorized(ApiResponse<UserResponse>.ErrorResponse("User ID is required"));
        }

        var result = await _authService.GetCurrentUserAsync(userId);

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get all users (Admin only)
    /// </summary>
    [HttpGet("users")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserResponse>>>> GetAllUsers()
    {
        // Verify admin access via header (simplified - in production, use JWT)
        var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
        if (!string.IsNullOrEmpty(adminUserIdHeader) && Guid.TryParse(adminUserIdHeader, out var adminUserId))
        {
            // Verify user is admin
            var adminUser = await _authService.GetCurrentUserAsync(adminUserId);
            if (!adminUser.Success || adminUser.Data?.Role != UserRole.Admin)
            {
                return Unauthorized(ApiResponse<IEnumerable<UserResponse>>.ErrorResponse("Admin access required"));
            }
        }
        // If no header, allow for now (can be restricted later)

        var result = await _authService.GetAllUsersAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get users by role (Admin only)
    /// </summary>
    [HttpGet("users/role/{role}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserResponse>>>> GetUsersByRole(string role)
    {
        // Verify admin access via header (simplified - in production, use JWT)
        var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
        if (!string.IsNullOrEmpty(adminUserIdHeader) && Guid.TryParse(adminUserIdHeader, out var adminUserId))
        {
            // Verify user is admin
            var adminUser = await _authService.GetCurrentUserAsync(adminUserId);
            if (!adminUser.Success || adminUser.Data?.Role != UserRole.Admin)
            {
                return Unauthorized(ApiResponse<IEnumerable<UserResponse>>.ErrorResponse("Admin access required"));
            }
        }
        // If no header, allow for now (can be restricted later)

        if (!Enum.TryParse<UserRole>(role, true, out var userRole))
        {
            return BadRequest(ApiResponse<IEnumerable<UserResponse>>.ErrorResponse($"Invalid role: {role}"));
        }

        var result = await _authService.GetUsersByRoleAsync(userRole);
        return Ok(result);
    }

    /// <summary>
    /// Promote user by email to Speaker, Partner, or Staff (Admin only)
    /// </summary>
    [HttpPost("users/promote")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status415UnsupportedMediaType)]
    public async Task<ActionResult<ApiResponse<object>>> PromoteUser([FromBody] PromoteUserRequest request)
    {
        // Validate model state (FluentValidation)
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors.Select(e => e.ErrorMessage))
                .ToList();
            var errorMessage = string.Join(", ", errors);
            _logger.LogWarning("PromoteUser ModelState invalid: {Errors}", errorMessage);
            return BadRequest(ApiResponse<object>.ErrorResponse(errorMessage));
        }

        // Get admin user ID from header
        var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(adminUserIdHeader))
        {
            _logger.LogWarning("PromoteUser: Admin user ID header is missing");
            return Unauthorized(ApiResponse<object>.ErrorResponse("Admin user ID is required in X-Admin-User-Id header"));
        }

        if (!Guid.TryParse(adminUserIdHeader, out var adminUserId))
        {
            _logger.LogWarning("PromoteUser: Admin user ID is not a valid GUID: {HeaderValue}", adminUserIdHeader);
            return Unauthorized(ApiResponse<object>.ErrorResponse($"Invalid admin user ID format: {adminUserIdHeader}. Expected a valid GUID."));
        }

        _logger.LogInformation("PromoteUser: Admin {AdminId} promoting user {Email} to {Type}", adminUserId, request.Email, request.PromotionType);

        var result = await _authService.PromoteUserAsync(request, adminUserId);

        if (!result.Success)
        {
            _logger.LogWarning("PromoteUser failed: {Error}", result.Error);
            return BadRequest(result);
        }

        _logger.LogInformation("PromoteUser: Successfully promoted user {Email} to {Type}", request.Email, request.PromotionType);
        return Ok(result);
    }

    /// <summary>
    /// Delete user (Admin only)
    /// </summary>
    [HttpDelete("users/{userId}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUser(Guid userId)
    {
        // Get admin user ID from header
        var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
        if (string.IsNullOrEmpty(adminUserIdHeader) || !Guid.TryParse(adminUserIdHeader, out var adminUserId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Admin user ID is required"));
        }

        var result = await _authService.DeleteUserAsync(userId, adminUserId);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get all staff members with their permissions (Admin only)
    /// </summary>
    [HttpGet("staff")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<StaffMemberResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<StaffMemberResponse>>>> GetStaffMembers()
    {
        // Verify admin access via header (simplified - in production, use JWT)
        var adminUserIdHeader = Request.Headers["X-Admin-User-Id"].FirstOrDefault();
        if (!string.IsNullOrEmpty(adminUserIdHeader) && Guid.TryParse(adminUserIdHeader, out var adminUserId))
        {
            // Verify user is admin
            var adminUser = await _authService.GetCurrentUserAsync(adminUserId);
            if (!adminUser.Success || adminUser.Data?.Role != UserRole.Admin)
            {
                return Unauthorized(ApiResponse<IEnumerable<StaffMemberResponse>>.ErrorResponse("Admin access required"));
            }
        }
        // If no header, allow for now (can be restricted later)

        var result = await _authService.GetStaffMembersAsync();
        return Ok(result);
    }

}
