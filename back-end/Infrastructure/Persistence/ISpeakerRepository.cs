using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository interface for SpeakerApplication entity
/// </summary>
public interface ISpeakerRepository : IRepository<SpeakerApplication>
{
    /// <summary>
    /// Get speaker by email
    /// </summary>
    Task<SpeakerApplication?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get speakers by status
    /// </summary>
    Task<IEnumerable<SpeakerApplication>> GetByStatusAsync(SubmissionStatus status, CancellationToken cancellationToken = default);
}
