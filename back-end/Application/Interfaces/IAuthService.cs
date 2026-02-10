using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Domain.Enums;

namespace Application.Interfaces;

/// <summary>
/// Service interface for authentication operations
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Sign up new user (creates User with User role)
    /// </summary>
    Task<ApiResponse<AuthResponse>> SignUpAsync(SignUpRequest request, CancellationToken cancellationToken = default);

    // Login endpoint removed - only signup is allowed for authentication

    /// <summary>
    /// Update user role (Admin only)
    /// </summary>
    Task<ApiResponse<UserResponse>> UpdateUserRoleAsync(UpdateUserRoleRequest request, Guid adminUserId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get current user information
    /// </summary>
    Task<ApiResponse<UserResponse>> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all users (Admin only)
    /// </summary>
    Task<ApiResponse<IEnumerable<UserResponse>>> GetAllUsersAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get users by role (Admin only)
    /// </summary>
    Task<ApiResponse<IEnumerable<UserResponse>>> GetUsersByRoleAsync(UserRole role, CancellationToken cancellationToken = default);

    /// <summary>
    /// Promote user by email to Speaker, Partner, or Staff (Admin only)
    /// </summary>
    Task<ApiResponse<object>> PromoteUserAsync(PromoteUserRequest request, Guid adminUserId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete user (Admin only)
    /// </summary>
    Task<ApiResponse<object>> DeleteUserAsync(Guid userId, Guid adminUserId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all staff members with their permissions (Admin only)
    /// </summary>
    Task<ApiResponse<IEnumerable<StaffMemberResponse>>> GetStaffMembersAsync(CancellationToken cancellationToken = default);
}
