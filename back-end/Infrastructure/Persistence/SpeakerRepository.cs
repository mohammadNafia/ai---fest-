using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository implementation for SpeakerApplication entity
/// </summary>
public class SpeakerRepository : Repository<SpeakerApplication>, ISpeakerRepository
{
    public SpeakerRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<SpeakerApplication?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.User)
            .Include(s => s.Reviewer)
            .FirstOrDefaultAsync(s => s.Email == email, cancellationToken);
    }

    public async Task<IEnumerable<SpeakerApplication>> GetByStatusAsync(SubmissionStatus status, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.User)
            .Include(s => s.Reviewer)
            .Where(s => s.Status == status)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
