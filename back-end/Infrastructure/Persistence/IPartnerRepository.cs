using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository interface for PartnerRequest entity
/// </summary>
public interface IPartnerRepository : IRepository<PartnerRequest>
{
    /// <summary>
    /// Get partner by email
    /// </summary>
    Task<PartnerRequest?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get partners by category
    /// </summary>
    Task<IEnumerable<PartnerRequest>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get partners by status
    /// </summary>
    Task<IEnumerable<PartnerRequest>> GetByStatusAsync(SubmissionStatus status, CancellationToken cancellationToken = default);
}
