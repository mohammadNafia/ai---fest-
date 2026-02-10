using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Application.Services;

/// <summary>
/// Service implementation for authentication operations
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ISpeakerRepository _speakerRepository;
    private readonly IPartnerRepository _partnerRepository;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        ISpeakerRepository speakerRepository,
        IPartnerRepository partnerRepository,
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _speakerRepository = speakerRepository;
        _partnerRepository = partnerRepository;
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Sign up new user (creates User with User role)
    /// </summary>
    public async Task<ApiResponse<AuthResponse>> SignUpAsync(SignUpRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if email already exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (existingUser != null)
            {
                return ApiResponse<AuthResponse>.ErrorResponse("Email already registered. Please use a different email address.");
            }

            // Check if phone already exists
            if (!string.IsNullOrEmpty(request.Phone))
            {
                var existingPhoneUser = await _userRepository.GetByPhoneAsync(request.Phone, cancellationToken);
                if (existingPhoneUser != null)
                {
                    return ApiResponse<AuthResponse>.ErrorResponse("Phone number already registered. Please use a different phone number.");
                }
            }

            // Validate password
            if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            {
                return ApiResponse<AuthResponse>.ErrorResponse("Password must be at least 6 characters long");
            }

            // Create new user with User role (default)
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email.ToLowerInvariant(),
                Phone = request.Phone,
                Name = request.Name,
                PasswordHash = HashPassword(request.Password),
                Role = UserRole.User, // All new users start as User role
                IsActive = true,
                EmailVerified = false,
                LastLoginAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("New user signed up: {Email} with role {Role}", request.Email, user.Role);

            // Generate token
            var token = GenerateToken(user.Id, user.Email, user.Role);

            var authResponse = new AuthResponse
            {
                Token = token,
                User = _mapper.Map<UserResponse>(user),
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };

            return ApiResponse<AuthResponse>.SuccessResponse(authResponse, "Sign up successful");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign up for email: {Email}", request.Email);
            return ApiResponse<AuthResponse>.ErrorResponse("An error occurred during sign up");
        }
    }

    // Login endpoint removed - only signup is allowed for authentication


    /// <summary>
    /// Update user role (Admin only)
    /// Only admin can upgrade users to admin/staff/user roles
    /// </summary>
    public async Task<ApiResponse<UserResponse>> UpdateUserRoleAsync(UpdateUserRoleRequest request, Guid adminUserId, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("UpdateUserRoleAsync called: UserId={UserId}, RoleString={RoleString}, Role={Role}, AdminId={AdminId}",
                request.UserId, request.RoleString, request.Role, adminUserId);

            // Verify admin
            var admin = await _userRepository.GetByIdAsync(adminUserId, cancellationToken);
            if (admin == null || admin.Role != UserRole.Admin)
            {
                _logger.LogWarning("UpdateUserRoleAsync: User {AdminId} is not an admin", adminUserId);
                return ApiResponse<UserResponse>.ErrorResponse("Only administrators can update user roles");
            }

            // Get user to update
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("UpdateUserRoleAsync: User {UserId} not found", request.UserId);
                return ApiResponse<UserResponse>.ErrorResponse("User not found");
            }

            // Validate role is not Guest (default)
            if (request.Role == UserRole.Guest)
            {
                _logger.LogWarning("UpdateUserRoleAsync: Invalid role '{RoleString}' for user {UserId}", request.RoleString, request.UserId);
                return ApiResponse<UserResponse>.ErrorResponse($"Invalid role: '{request.RoleString}'. Role must be User, Admin, Staff, Speaker, Partner, or Reviewer.");
            }

            // Update role
            var oldRole = user.Role;
            user.Role = request.Role;
            user.UpdatedAt = DateTime.UtcNow;
            user.UpdatedBy = adminUserId;

            await _userRepository.UpdateAsync(user, cancellationToken);

            // Create/update entries in corresponding tables based on new role
            switch (request.Role)
            {
                case UserRole.Staff:
                    // Create or update StaffPermissions entry
                    var staffPermissions = await _context.StaffPermissions
                        .FirstOrDefaultAsync(sp => sp.StaffUserId == user.Id, cancellationToken);

                    if (staffPermissions == null)
                    {
                        staffPermissions = new StaffPermissions
                        {
                            Id = Guid.NewGuid(),
                            StaffUserId = user.Id,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            CreatedBy = adminUserId,
                            UpdatedBy = adminUserId
                        };
                        await _context.StaffPermissions.AddAsync(staffPermissions, cancellationToken);
                        _logger.LogInformation("Created StaffPermissions entry for user {UserId}", user.Id);
                    }
                    else
                    {
                        staffPermissions.UpdatedAt = DateTime.UtcNow;
                        staffPermissions.UpdatedBy = adminUserId;
                        _context.StaffPermissions.Update(staffPermissions);
                        _logger.LogInformation("Updated StaffPermissions entry for user {UserId}", user.Id);
                    }
                    break;

                case UserRole.Speaker:
                    // Create or update SpeakerApplication entry
                    var speakerApp = await _speakerRepository.GetByEmailAsync(user.Email.ToLowerInvariant(), cancellationToken);

                    if (speakerApp == null)
                    {
                        speakerApp = new SpeakerApplication
                        {
                            Id = Guid.NewGuid(),
                            UserId = user.Id,
                            Name = user.Name,
                            Email = user.Email,
                            Phone = user.Phone ?? "",
                            Occupation = "Not specified",
                            Institution = "Not specified",
                            Skills = "Role updated by admin",
                            Experience = "Role updated by admin",
                            Topics = "To be specified",
                            Achievements = "Role updated by admin",
                            Status = SubmissionStatus.Approved,
                            ReviewedBy = adminUserId,
                            ReviewedAt = DateTime.UtcNow,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        await _speakerRepository.AddAsync(speakerApp, cancellationToken);
                        _logger.LogInformation("Created SpeakerApplication entry for user {UserId}", user.Id);
                    }
                    else
                    {
                        speakerApp.Status = SubmissionStatus.Approved;
                        speakerApp.ReviewedBy = adminUserId;
                        speakerApp.ReviewedAt = DateTime.UtcNow;
                        speakerApp.UpdatedAt = DateTime.UtcNow;
                        await _speakerRepository.UpdateAsync(speakerApp, cancellationToken);
                        _logger.LogInformation("Updated SpeakerApplication entry for user {UserId}", user.Id);
                    }
                    await _speakerRepository.SaveChangesAsync(cancellationToken);
                    break;

                case UserRole.Partner:
                    // Create or update PartnerRequest entry
                    var partnerReq = await _partnerRepository.GetByEmailAsync(user.Email.ToLowerInvariant(), cancellationToken);

                    if (partnerReq == null)
                    {
                        partnerReq = new PartnerRequest
                        {
                            Id = Guid.NewGuid(),
                            UserId = user.Id,
                            Organization = user.Name,
                            Email = user.Email,
                            Category = "General",
                            Requirements = "Role updated by admin",
                            Status = SubmissionStatus.Approved,
                            ReviewedBy = adminUserId,
                            ReviewedAt = DateTime.UtcNow,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        await _partnerRepository.AddAsync(partnerReq, cancellationToken);
                        _logger.LogInformation("Created PartnerRequest entry for user {UserId}", user.Id);
                    }
                    else
                    {
                        partnerReq.Status = SubmissionStatus.Approved;
                        partnerReq.ReviewedBy = adminUserId;
                        partnerReq.ReviewedAt = DateTime.UtcNow;
                        partnerReq.UpdatedAt = DateTime.UtcNow;
                        await _partnerRepository.UpdateAsync(partnerReq, cancellationToken);
                        _logger.LogInformation("Updated PartnerRequest entry for user {UserId}", user.Id);
                    }
                    await _partnerRepository.SaveChangesAsync(cancellationToken);
                    break;
            }

            await _userRepository.SaveChangesAsync(cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Admin {AdminId} updated user {UserId} role from {OldRole} to {NewRole}",
                adminUserId, request.UserId, oldRole, request.Role);

            var response = _mapper.Map<UserResponse>(user);
            return ApiResponse<UserResponse>.SuccessResponse(response, "User role updated successfully");
        }
        catch (DbUpdateException dbEx)
        {
            // Check if it's a constraint violation
            var innerException = dbEx.InnerException;
            var errorMessage = "An error occurred while updating user role";

            if (innerException is Npgsql.PostgresException pgEx)
            {
                // PostgreSQL specific error
                if (pgEx.SqlState == "23514") // Check constraint violation
                {
                    errorMessage = $"Invalid role value. The role '{request.RoleString}' is not allowed. Please ensure the database constraint allows this role.";
                    _logger.LogError(dbEx, "Database constraint violation updating user role: UserId={UserId}, RoleString={RoleString}, SqlState={SqlState}, Message={Message}",
                        request.UserId, request.RoleString, pgEx.SqlState, pgEx.Message);
                }
                else
                {
                    errorMessage = $"Database error: {pgEx.Message}";
                    _logger.LogError(dbEx, "PostgreSQL error updating user role: UserId={UserId}, RoleString={RoleString}, SqlState={SqlState}",
                        request.UserId, request.RoleString, pgEx.SqlState);
                }
            }
            else
            {
                _logger.LogError(dbEx, "Database update error updating user role: UserId={UserId}, RoleString={RoleString}, Exception={Exception}",
                    request.UserId, request.RoleString, dbEx.ToString());
            }

            return ApiResponse<UserResponse>.ErrorResponse(errorMessage);
        }
        catch (NpgsqlException npgsqlEx)
        {
            _logger.LogError(npgsqlEx, "PostgreSQL connection error updating user role: UserId={UserId}, RoleString={RoleString}",
                request.UserId, request.RoleString);
            return ApiResponse<UserResponse>.ErrorResponse("Database connection error. Please ensure the database is available.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user role for user: {UserId}, RoleString: {RoleString}, Exception: {Exception}",
                request.UserId, request.RoleString, ex.ToString());
            return ApiResponse<UserResponse>.ErrorResponse($"An error occurred while updating user role: {ex.Message}");
        }
    }

    /// <summary>
    /// Get current user information
    /// </summary>
    public async Task<ApiResponse<UserResponse>> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                return ApiResponse<UserResponse>.ErrorResponse("User not found");
            }

            var response = _mapper.Map<UserResponse>(user);
            return ApiResponse<UserResponse>.SuccessResponse(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user: {UserId}", userId);
            return ApiResponse<UserResponse>.ErrorResponse("An error occurred while getting user information");
        }
    }


    /// <summary>
    /// Verify password against hash
    /// </summary>
    private bool VerifyPassword(string password, string hash)
    {
        // Simplified password verification (in production, use BCrypt or Argon2)
        // For now, simple comparison for development
        // TODO: Implement proper password hashing
        return password == hash || HashPassword(password) == hash;
    }

    /// <summary>
    /// Hash password
    /// </summary>
    private string HashPassword(string password)
    {
        // Simplified hashing (in production, use BCrypt or Argon2)
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    /// <summary>
    /// Get all users (Admin only)
    /// </summary>
    public async Task<ApiResponse<IEnumerable<UserResponse>>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var users = await _userRepository.GetAllAsync(cancellationToken);
            var responses = _mapper.Map<IEnumerable<UserResponse>>(users);
            return ApiResponse<IEnumerable<UserResponse>>.SuccessResponse(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all users");
            return ApiResponse<IEnumerable<UserResponse>>.ErrorResponse("An error occurred while getting users");
        }
    }

    /// <summary>
    /// Get users by role (Admin only)
    /// </summary>
    public async Task<ApiResponse<IEnumerable<UserResponse>>> GetUsersByRoleAsync(UserRole role, CancellationToken cancellationToken = default)
    {
        try
        {
            var users = await _userRepository.GetByRoleAsync(role, cancellationToken);
            var responses = _mapper.Map<IEnumerable<UserResponse>>(users);
            return ApiResponse<IEnumerable<UserResponse>>.SuccessResponse(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users by role: {Role}", role);
            return ApiResponse<IEnumerable<UserResponse>>.ErrorResponse("An error occurred while getting users by role");
        }
    }

    /// <summary>
    /// Promote user by email to Speaker, Partner, or Staff (Admin only)
    /// </summary>
    public async Task<ApiResponse<object>> PromoteUserAsync(PromoteUserRequest request, Guid adminUserId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Verify admin
            var admin = await _userRepository.GetByIdAsync(adminUserId, cancellationToken);
            if (admin == null || admin.Role != UserRole.Admin)
            {
                return ApiResponse<object>.ErrorResponse("Only administrators can promote users");
            }

            // Find user by email
            var user = await _userRepository.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken);

            if (user == null)
            {
                return ApiResponse<object>.ErrorResponse($"User with email {request.Email} not found. User must sign up first.");
            }

            var promotionType = request.PromotionType.ToLower();

            switch (promotionType)
            {
                case "staff":
                    // Update user role to Staff
                    user.Role = UserRole.Staff;
                    user.UpdatedAt = DateTime.UtcNow;
                    user.UpdatedBy = adminUserId;
                    await _userRepository.UpdateAsync(user, cancellationToken);

                    // Create or update StaffPermissions entry
                    var staffPermissions = await _context.StaffPermissions
                        .FirstOrDefaultAsync(sp => sp.StaffUserId == user.Id, cancellationToken);

                    if (staffPermissions == null)
                    {
                        staffPermissions = new StaffPermissions
                        {
                            Id = Guid.NewGuid(),
                            StaffUserId = user.Id,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            CreatedBy = adminUserId,
                            UpdatedBy = adminUserId
                        };
                        await _context.StaffPermissions.AddAsync(staffPermissions, cancellationToken);
                        _logger.LogInformation("Created StaffPermissions entry for promoted user {UserId}", user.Id);
                    }
                    else
                    {
                        staffPermissions.UpdatedAt = DateTime.UtcNow;
                        staffPermissions.UpdatedBy = adminUserId;
                        _context.StaffPermissions.Update(staffPermissions);
                        _logger.LogInformation("Updated StaffPermissions entry for promoted user {UserId}", user.Id);
                    }

                    await _userRepository.SaveChangesAsync(cancellationToken);
                    await _context.SaveChangesAsync(cancellationToken);

                    _logger.LogInformation("Admin {AdminId} promoted user {UserId} to Staff", adminUserId, user.Id);
                    return ApiResponse<object>.SuccessResponse(new { userId = user.Id, role = "Staff" }, "User promoted to Staff successfully");

                case "speaker":
                    // Update user role to Speaker
                    user.Role = UserRole.Speaker;
                    user.UpdatedAt = DateTime.UtcNow;
                    user.UpdatedBy = adminUserId;
                    await _userRepository.UpdateAsync(user, cancellationToken);

                    // Check if speaker application already exists
                    var speakerApp = await _speakerRepository.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken);

                    if (speakerApp != null)
                    {
                        // Update existing application to approved
                        speakerApp.Status = SubmissionStatus.Approved;
                        speakerApp.ReviewedBy = adminUserId;
                        speakerApp.ReviewedAt = DateTime.UtcNow;
                        speakerApp.UpdatedAt = DateTime.UtcNow;
                        await _speakerRepository.UpdateAsync(speakerApp, cancellationToken);
                    }
                    else
                    {
                        // Create new speaker application with approved status
                        speakerApp = new SpeakerApplication
                        {
                            Id = Guid.NewGuid(),
                            UserId = user.Id,
                            Name = user.Name,
                            Email = user.Email,
                            Phone = user.Phone ?? "",
                            Occupation = request.Occupation ?? "Not specified",
                            Institution = request.Institution ?? "Not specified",
                            Skills = "Promoted by admin",
                            Experience = "Promoted by admin",
                            Topics = "To be specified",
                            Achievements = "Promoted by admin",
                            Status = SubmissionStatus.Approved, // Auto-approved
                            ReviewedBy = adminUserId,
                            ReviewedAt = DateTime.UtcNow,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        await _speakerRepository.AddAsync(speakerApp, cancellationToken);
                    }

                    await _userRepository.SaveChangesAsync(cancellationToken);
                    await _speakerRepository.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("Admin {AdminId} promoted user {UserId} to Speaker", adminUserId, user.Id);
                    return ApiResponse<object>.SuccessResponse(new { speakerId = speakerApp.Id, userId = user.Id }, "User promoted to Speaker successfully");

                case "partner":
                    // Update user role to Partner
                    user.Role = UserRole.Partner;
                    user.UpdatedAt = DateTime.UtcNow;
                    user.UpdatedBy = adminUserId;
                    await _userRepository.UpdateAsync(user, cancellationToken);

                    // Check if partner request already exists
                    var partnerReq = await _partnerRepository.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken);

                    if (partnerReq != null)
                    {
                        // Update existing request to approved
                        partnerReq.Status = SubmissionStatus.Approved;
                        partnerReq.ReviewedBy = adminUserId;
                        partnerReq.ReviewedAt = DateTime.UtcNow;
                        partnerReq.UpdatedAt = DateTime.UtcNow;
                        await _partnerRepository.UpdateAsync(partnerReq, cancellationToken);
                    }
                    else
                    {
                        // Create new partner request with approved status
                        partnerReq = new PartnerRequest
                        {
                            Id = Guid.NewGuid(),
                            UserId = user.Id,
                            Organization = request.Organization ?? user.Name,
                            Email = user.Email,
                            Category = request.Category ?? "General",
                            Requirements = "Promoted by admin",
                            Status = SubmissionStatus.Approved, // Auto-approved
                            ReviewedBy = adminUserId,
                            ReviewedAt = DateTime.UtcNow,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        await _partnerRepository.AddAsync(partnerReq, cancellationToken);
                    }

                    await _userRepository.SaveChangesAsync(cancellationToken);
                    await _partnerRepository.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("Admin {AdminId} promoted user {UserId} to Partner", adminUserId, user.Id);
                    return ApiResponse<object>.SuccessResponse(new { partnerId = partnerReq.Id, userId = user.Id }, "User promoted to Partner successfully");

                default:
                    return ApiResponse<object>.ErrorResponse($"Invalid promotion type: {request.PromotionType}. Must be 'speaker', 'partner', or 'staff'");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error promoting user with email: {Email}", request.Email);
            return ApiResponse<object>.ErrorResponse($"An error occurred while promoting user: {ex.Message}");
        }
    }

    /// <summary>
    /// Delete user (Admin only)
    /// </summary>
    public async Task<ApiResponse<object>> DeleteUserAsync(Guid userId, Guid adminUserId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Verify admin
            var admin = await _userRepository.GetByIdAsync(adminUserId, cancellationToken);
            if (admin == null || admin.Role != UserRole.Admin)
            {
                return ApiResponse<object>.ErrorResponse("Only administrators can delete users");
            }

            // Prevent admin from deleting themselves
            if (userId == adminUserId)
            {
                return ApiResponse<object>.ErrorResponse("You cannot delete your own account");
            }

            // Get user to delete
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                return ApiResponse<object>.ErrorResponse("User not found");
            }

            // Delete user (cascade will handle related records)
            await _userRepository.DeleteAsync(user, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Admin {AdminId} deleted user {UserId}", adminUserId, userId);

            return ApiResponse<object>.SuccessResponse(new { userId = userId }, "User deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user: {UserId}", userId);
            return ApiResponse<object>.ErrorResponse($"An error occurred while deleting user: {ex.Message}");
        }
    }

    /// <summary>
    /// Get all staff members with their permissions (Admin only)
    /// </summary>
    public async Task<ApiResponse<IEnumerable<StaffMemberResponse>>> GetStaffMembersAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            // Get all users with Staff role
            var staffUsers = await _userRepository.GetByRoleAsync(UserRole.Staff, cancellationToken);

            var staffMembers = new List<StaffMemberResponse>();

            foreach (var user in staffUsers)
            {
                // Get staff permissions for this user
                var staffPermissions = await _context.StaffPermissions
                    .FirstOrDefaultAsync(sp => sp.StaffUserId == user.Id, cancellationToken);

                var staffMember = new StaffMemberResponse
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Phone = user.Phone,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    EmailVerified = user.EmailVerified,
                    LastLoginAt = user.LastLoginAt,
                    CreatedAt = user.CreatedAt,
                    Permissions = staffPermissions != null
                        ? _mapper.Map<StaffPermissionsResponse>(staffPermissions)
                        : null
                };

                staffMembers.Add(staffMember);
            }

            return ApiResponse<IEnumerable<StaffMemberResponse>>.SuccessResponse(staffMembers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting staff members");
            return ApiResponse<IEnumerable<StaffMemberResponse>>.ErrorResponse("An error occurred while getting staff members");
        }
    }

    /// <summary>
    /// Generate JWT token (simplified - in production, use proper JWT library)
    /// </summary>
    private string GenerateToken(Guid userId, string email, UserRole role)
    {
        // Simplified token generation (in production, use JWT library)
        var tokenData = $"{userId}:{email}:{role}:{DateTime.UtcNow:O}";
        var bytes = Encoding.UTF8.GetBytes(tokenData);
        return Convert.ToBase64String(bytes);
    }
}
