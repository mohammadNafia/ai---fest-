using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository implementation for PartnerRequest entity
/// </summary>
public class PartnerRepository : Repository<PartnerRequest>, IPartnerRepository
{
    public PartnerRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<PartnerRequest?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.User)
            .Include(p => p.Reviewer)
            .FirstOrDefaultAsync(p => p.Email == email, cancellationToken);
    }

    public async Task<IEnumerable<PartnerRequest>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.User)
            .Include(p => p.Reviewer)
            .Where(p => p.Category == category)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PartnerRequest>> GetByStatusAsync(SubmissionStatus status, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.User)
            .Include(p => p.Reviewer)
            .Where(p => p.Status == status)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
