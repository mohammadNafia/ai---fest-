using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository implementation for User entity
/// </summary>
public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        // Case-insensitive email comparison
        var emailLower = email.ToLowerInvariant();
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Email.ToLower() == emailLower, cancellationToken);
    }

    public async Task<User?> GetByPhoneAsync(string phone, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Phone == phone, cancellationToken);
    }

    public async Task<User?> GetByEmailOrPhoneAsync(string emailOrPhone, CancellationToken cancellationToken = default)
    {
        // Try email first
        var user = await _dbSet
            .FirstOrDefaultAsync(u => u.Email == emailOrPhone, cancellationToken);
        
        if (user != null)
            return user;
        
        // Try phone
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Phone == emailOrPhone, cancellationToken);
    }

    public async Task<bool> IsEmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AnyAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<IEnumerable<User>> GetByRoleAsync(UserRole role, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(u => u.Role == role)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<User>> GetActiveUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(u => u.IsActive)
            .ToListAsync(cancellationToken);
    }
}
