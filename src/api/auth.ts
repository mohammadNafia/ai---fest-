/**
 * Authentication API Service
 * Connects frontend to backend Auth endpoints
 */

import { apiClient } from '@/lib/apiClient';

interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      role: string;
      name?: string;
      email?: string;
    };
    expiresAt: string;
  };
  error?: string;
}

/**
 * Sign up new user
 * @param {any} signUpData - Sign up data
 * @returns {Promise<AuthResponse>}
 */
export const signUp = async (signUpData: any): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse['data']>('/Auth/signup', signUpData);
    
    if (response.success && response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('sessionExpiry', new Date(response.data.expiresAt).getTime().toString());
    }
    
    return response as any;
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message || 'Sign up failed',
    };
  }
};

/**
 * Login user
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse['data']>('/Auth/login', { email, password });
    
    if (response.success && response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('sessionExpiry', new Date(response.data.expiresAt).getTime().toString());
    }
    
    return response as any;
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Login failed',
    };
  }
};

/**
 * OAuth sign-in
 */
export const oauthSignIn = async (provider: string, accessToken: string, email: string, name: string, avatarUrl: string | null = null): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse['data']>('/Auth/oauth/signin', {
      provider,
      accessToken,
      email,
      name,
      avatarUrl,
    });

    if (response.success && response.data) {
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('sessionExpiry', new Date(response.data.expiresAt).getTime().toString());
      }
    }

    return response as any;
  } catch (error: any) {
    console.error('OAuth sign-in error:', error);
    return {
      success: false,
      error: error.message || 'OAuth sign-in failed',
    };
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (userId: string, role: string, adminUserId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.post('/Auth/users/update-role', {
      userId,
      role,
    }, {
      headers: {
        'X-Admin-User-Id': adminUserId,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    return response;
  } catch (error: any) {
    console.error('Update user role error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user role',
    };
  }
};

/**
 * Get current user information
 */
export const getCurrentUser = async (userId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.get('/Auth/me', {
      headers: {
        'X-User-Id': userId,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    return response;
  } catch (error: any) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user information',
    };
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-Admin-User-Id': userId }),
    };
    
    const response = await apiClient.get('/Auth/users', { headers });
    return response;
  } catch (error: any) {
    console.error('Get all users error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get users',
    };
  }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: string): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-Admin-User-Id': userId }),
    };
    
    const response = await apiClient.get(`/Auth/users/role/${role}`, { headers });
    return response;
  } catch (error: any) {
    console.error('Get users by role error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get users by role',
    };
  }
};

/**
 * Promote user by email
 */
export const promoteUser = async (email: string, promotionType: string, adminUserId: string, additionalData: any = {}): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken');
    const requestBody = {
      email,
      promotionType,
      ...additionalData,
    };
    
    const response = await apiClient.post('/Auth/users/promote', requestBody, {
      headers: {
        'X-Admin-User-Id': adminUserId,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    return response;
  } catch (error: any) {
    console.error('[promoteUser] Error caught:', error);
    return {
      success: false,
      error: error.message || 'Failed to promote user',
    };
  }
};

/**
 * Sign in as attendee
 */
export const attendeeSignIn = async (attendeeData: any): Promise<AuthResponse> => {
  try {
    const response = await signUp({
      name: attendeeData.name,
      age: attendeeData.age,
      occupation: attendeeData.occupation,
      organization: attendeeData.organization,
      email: attendeeData.email,
      password: attendeeData.password,
      phone: attendeeData.phone,
    });
    
    return response;
  } catch (error: any) {
    console.error('Attendee signup error:', error);
    return {
      success: false,
      error: error.message || 'Attendee signup failed',
    };
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId: string, adminUserId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.delete(`/Auth/users/${userId}`, {
      headers: {
        'X-Admin-User-Id': adminUserId,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    return response;
  } catch (error: any) {
    console.error('Delete user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete user',
    };
  }
};

/**
 * Get all staff members
 */
export const getStaffMembers = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-Admin-User-Id': userId }),
    };
    
    const response = await apiClient.get('/Auth/staff', { headers });
    return response;
  } catch (error: any) {
    console.error('Get staff members error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get staff members',
    };
  }
};
