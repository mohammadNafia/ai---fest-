using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository implementation for AttendeeRegistration entity
/// </summary>
public class AttendeeRepository : Repository<AttendeeRegistration>, IAttendeeRepository
{
    public AttendeeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<AttendeeRegistration?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        // Case-insensitive email comparison
        var emailLower = email.ToLowerInvariant();
        return await _dbSet
            .Include(a => a.User)
            .Include(a => a.Reviewer)
            .FirstOrDefaultAsync(a => a.Email.ToLower() == emailLower, cancellationToken);
    }

    public async Task<IEnumerable<AttendeeRegistration>> GetByStatusAsync(SubmissionStatus status, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(a => a.User)
            .Include(a => a.Reviewer)
            .Where(a => a.Status == status)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetPendingCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .CountAsync(a => a.Status == SubmissionStatus.Pending, cancellationToken);
    }
}
