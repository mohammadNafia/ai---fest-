using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository implementation for ActivityLog entity
/// </summary>
public class ActivityLogRepository : Repository<ActivityLog>, IActivityLogRepository
{
    public ActivityLogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ActivityLog>> GetByEntityAsync(EntityType entityType, Guid entityId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(a => a.User)
            .Where(a => a.EntityType == entityType && a.EntityId == entityId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ActivityLog>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(a => a.User)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ActivityLog>> GetRecentAsync(int count = 50, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(a => a.User)
            .OrderByDescending(a => a.CreatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }
}
