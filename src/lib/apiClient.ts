/**
 * Mock API Client for Frontend-Only Site
 * This client intercepts calls that would normally go to the backend
 * and returns successful mock responses.
 */

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

const mockResponse = <T>(data: T = {} as T, message = 'Success'): ApiResponse<T> => ({
  success: true,
  data,
  message
});

export const apiClient = {
  get: async <T = any>(endpoint: string, _options?: any): Promise<ApiResponse<T>> => {
    console.log(`[MOCK API] GET: ${endpoint}`);
    // Handle specific mock data if needed
    if (endpoint === '/speakers') return mockResponse([] as any);
    return mockResponse({} as any);
  },

  post: async <T = any>(endpoint: string, data?: any, _options?: any): Promise<ApiResponse<T>> => {
    console.log(`[MOCK API] POST: ${endpoint}`, data);
    return mockResponse({} as any, 'Action completed successfully');
  },

  patch: async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    console.log(`[MOCK API] PATCH: ${endpoint}`, data);
    return mockResponse({} as any);
  },

  put: async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    console.log(`[MOCK API] PUT: ${endpoint}`, data);
    return mockResponse({} as any);
  },

  delete: async <T = any>(endpoint: string, _options?: any): Promise<ApiResponse<T>> => {
    console.log(`[MOCK API] DELETE: ${endpoint}`);
    return mockResponse({} as any);
  },
};

// Specialized API functions (empty implementations)
export const attendeeSignIn = async () => mockResponse({});
export const registerAttendee = async () => mockResponse({});

export default apiClient;
