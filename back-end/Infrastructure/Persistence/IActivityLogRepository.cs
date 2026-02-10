using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository interface for ActivityLog entity
/// </summary>
public interface IActivityLogRepository : IRepository<ActivityLog>
{
    /// <summary>
    /// Get activity logs by entity
    /// </summary>
    Task<IEnumerable<ActivityLog>> GetByEntityAsync(EntityType entityType, Guid entityId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get activity logs by user
    /// </summary>
    Task<IEnumerable<ActivityLog>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get recent activity logs
    /// </summary>
    Task<IEnumerable<ActivityLog>> GetRecentAsync(int count = 50, CancellationToken cancellationToken = default);
}
