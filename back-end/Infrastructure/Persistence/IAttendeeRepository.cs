using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Persistence;

/// <summary>
/// Repository interface for AttendeeRegistration entity
/// </summary>
public interface IAttendeeRepository : IRepository<AttendeeRegistration>
{
    /// <summary>
    /// Get attendee by email
    /// </summary>
    Task<AttendeeRegistration?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get attendees by status
    /// </summary>
    Task<IEnumerable<AttendeeRegistration>> GetByStatusAsync(SubmissionStatus status, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get count of pending registrations
    /// </summary>
    Task<int> GetPendingCountAsync(CancellationToken cancellationToken = default);
}
