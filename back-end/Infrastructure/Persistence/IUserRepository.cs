using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository interface for User entity with specific queries
/// </summary>
public interface IUserRepository : IRepository<User>
{
    /// <summary>
    /// Get user by email address
    /// </summary>
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get user by phone number
    /// </summary>
    Task<User?> GetByPhoneAsync(string phone, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get user by email or phone
    /// </summary>
    Task<User?> GetByEmailOrPhoneAsync(string emailOrPhone, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if email already exists
    /// </summary>
    Task<bool> IsEmailExistsAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get users by role
    /// </summary>
    Task<IEnumerable<User>> GetByRoleAsync(UserRole role, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get active users only
    /// </summary>
    Task<IEnumerable<User>> GetActiveUsersAsync(CancellationToken cancellationToken = default);
}
