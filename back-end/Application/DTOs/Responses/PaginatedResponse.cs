namespace Application.DTOs.Responses;

/// <summary>
/// Paginated response wrapper
/// </summary>
/// <typeparam name="T">Type of items in the collection</typeparam>
public class PaginatedResponse<T>
{
    /// <summary>
    /// Collection of items for the current page
    /// </summary>
    public IEnumerable<T> Data { get; set; } = new List<T>();

    /// <summary>
    /// Total number of items across all pages
    /// </summary>
    public int Total { get; set; }

    /// <summary>
    /// Current page number (1-based)
    /// </summary>
    public int Page { get; set; }

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages => (int)Math.Ceiling(Total / (double)PageSize);

    /// <summary>
    /// Indicates if there is a previous page
    /// </summary>
    public bool HasPreviousPage => Page > 1;

    /// <summary>
    /// Indicates if there is a next page
    /// </summary>
    public bool HasNextPage => Page < TotalPages;
}
