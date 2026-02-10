namespace Domain.Enums;

/// <summary>
/// Represents the status of a submission (attendee, speaker, or partner)
/// </summary>
public enum SubmissionStatus
{
    /// <summary>
    /// Submission is pending review
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Submission has been approved
    /// </summary>
    Approved = 1,

    /// <summary>
    /// Submission has been rejected
    /// </summary>
    Rejected = 2
}
