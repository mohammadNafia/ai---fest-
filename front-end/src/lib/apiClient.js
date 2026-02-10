// API Client for Backend Connection
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request function
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Merge headers properly - ensure Content-Type is always set
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Try to parse response as JSON (even for error responses)
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If response is not JSON, handle as text error
      if (!response.ok) {
        const text = await response.text().catch(() => 'Request failed');
        return {
          success: false,
          data: null,
          message: text || `HTTP error! status: ${response.status}`,
          error: text || `HTTP error! status: ${response.status}`
        };
      }
      throw jsonError;
    }
    
    // Handle ApiResponse<T> format from backend
    // Check for both camelCase (JSON) and PascalCase (if serialization preserves C# names)
    const isSuccess = data.success !== undefined ? data.success : data.Success;
    if (isSuccess !== undefined) {
      // If backend returned success: false, return it directly (don't throw)
      if (!isSuccess) {
        const errorMsg = data.error || data.Error || data.message || data.Message || 'Request failed';
        return {
          success: false,
          data: null,
          message: errorMsg,
          error: errorMsg
        };
      }
      // Normalize response to camelCase
      return {
        success: true,
        data: data.data || data.Data,
        message: data.message || data.Message
      };
    }
    
    // If response is not in ApiResponse format, wrap it
    if (response.ok) {
      return {
        success: true,
        data: data,
        message: data.message || 'Success'
      };
    } else {
      // Try to extract validation errors or error message
      let errorMessage = data.message || data.error || data.Error || `HTTP error! status: ${response.status}`;
      
      // Handle FluentValidation errors (usually in errors property)
      if (data.errors && typeof data.errors === 'object') {
        const validationErrors = Object.values(data.errors).flat();
        if (validationErrors.length > 0) {
          errorMessage = validationErrors.join(', ');
        }
      }
      
      // Handle ASP.NET ModelState errors
      if (data.title && data.errors) {
        errorMessage = `${data.title}: ${JSON.stringify(data.errors)}`;
      }
      
      return {
        success: false,
        data: null,
        message: errorMessage,
        error: errorMessage
      };
    }
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    
    // Handle network errors (Failed to fetch)
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      return {
        success: false,
        data: null,
        message: 'Cannot connect to backend. Make sure the backend is running on http://localhost:5000',
        error: 'Network error: Backend server is not reachable. Please check if the backend is running.'
      };
    }
    
    return {
      success: false,
      data: null,
      message: error.message || 'An error occurred',
      error: error.message || 'An error occurred'
    };
  }
}

export const apiClient = {
  // GET request
  get: (endpoint, options = {}) => apiRequest(endpoint, { method: 'GET', ...options }),

  // POST request
  post: (endpoint, data, options = {}) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  }),

  // PATCH request
  patch: (endpoint, data, options = {}) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  }),

  // PUT request
  put: (endpoint, data, options = {}) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  }),

  // DELETE request
  delete: (endpoint, options = {}) => apiRequest(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
