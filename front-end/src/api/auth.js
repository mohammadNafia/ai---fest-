/**
 * Authentication API Service
 * Connects frontend to backend Auth endpoints
 */

import { apiClient } from '@/lib/apiClient';

/**
 * Sign up new user
 * @param {object} signUpData - Sign up data {name, age, occupation, organization, email, password, phone}
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const signUp = async (signUpData) => {
  try {
    const response = await apiClient.post('/Auth/signup', signUpData);
    
    if (response.success && response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('sessionExpiry', new Date(response.data.expiresAt).getTime().toString());
    }
    
    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message || 'Sign up failed',
    };
  }
};

// Login endpoint removed - only signup is allowed for authentication
// Users must sign up to create an account and become an attendee

/**
 * OAuth sign-in (User role, auto-register)
 * @param {string} provider - OAuth provider (google, github, etc.)
 * @param {string} accessToken - OAuth access token
 * @param {string} email - User email from OAuth provider
 * @param {string} name - User name from OAuth provider
 * @param {string} [avatarUrl] - User avatar URL (optional)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const oauthSignIn = async (provider, accessToken, email, name, avatarUrl = null) => {
  try {
    const response = await apiClient.post('/Auth/oauth/signin', {
      provider,
      accessToken,
      email,
      name,
      avatarUrl,
    });

    if (response.success && response.data) {
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('sessionExpiry', new Date(response.data.expiresAt).getTime().toString());
      }
    }

    return response;
  } catch (error) {
    console.error('OAuth sign-in error:', error);
    return {
      success: false,
      error: error.message || 'OAuth sign-in failed',
    };
  }
};

/**
 * Update user role (Admin only)
 * @param {string} userId - User ID to update
 * @param {string} role - New role (admin, staff, user)
 * @param {string} adminUserId - Admin user ID (from token)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const updateUserRole = async (userId, role, adminUserId) => {
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
  } catch (error) {
    console.error('Update user role error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user role',
    };
  }
};

/**
 * Get current user information
 * @param {string} userId - User ID (from token)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getCurrentUser = async (userId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.get('/Auth/me', {
      headers: {
        'X-User-Id': userId,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user information',
    };
  }
};

/**
 * Get all users (Admin only)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-Admin-User-Id': userId }),
    };
    
    const response = await apiClient.get('/Auth/users', { headers });
    console.log('[getAllUsers] Response:', response);
    return response;
  } catch (error) {
    console.error('Get all users error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get users',
    };
  }
};

/**
 * Get users by role (Admin only)
 * @param {string} role - User role (User, Speaker, Partner, Staff, Admin)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getUsersByRole = async (role) => {
  try {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-Admin-User-Id': userId }),
    };
    
    const response = await apiClient.get(`/Auth/users/role/${role}`, { headers });
    return response;
  } catch (error) {
    console.error('Get users by role error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get users by role',
    };
  }
};

/**
 * Promote user by email to Speaker, Partner, or Staff (Admin only)
 * @param {string} email - User email
 * @param {string} promotionType - 'speaker', 'partner', or 'staff'
 * @param {string} adminUserId - Admin user ID
 * @param {object} additionalData - Optional: {organization, category, occupation, institution}
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const promoteUser = async (email, promotionType, adminUserId, additionalData = {}) => {
  try {
    console.log('[promoteUser] Starting promotion:', { email, promotionType, adminUserId, additionalData });
    const token = localStorage.getItem('authToken');
    
    const requestBody = {
      email,
      promotionType,
      ...additionalData,
    };
    
    console.log('[promoteUser] Request body:', requestBody);
    console.log('[promoteUser] Headers:', {
      'X-Admin-User-Id': adminUserId,
      'Authorization': token ? `Bearer ${token}` : 'none'
    });
    
    const response = await apiClient.post('/Auth/users/promote', requestBody, {
      headers: {
        'X-Admin-User-Id': adminUserId,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    console.log('[promoteUser] Response:', response);
    return response;
  } catch (error) {
    console.error('[promoteUser] Error caught:', error);
    console.error('[promoteUser] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      success: false,
      error: error.message || 'Failed to promote user',
    };
  }
};

/**
 * Sign in as attendee (creates User with role=User, which equals Attendee)
 * Uses the signup endpoint since all users must sign up first
 * @param {object} attendeeData - Attendee registration data {name, age, occupation, organization, email, password, phone, motivation, newsletter}
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const attendeeSignIn = async (attendeeData) => {
  try {
    console.log('Sending attendee signup request:', attendeeData);
    // Use signup endpoint - it automatically creates User with role=User (which equals Attendee)
    const response = await signUp({
      name: attendeeData.name,
      age: attendeeData.age,
      occupation: attendeeData.occupation,
      organization: attendeeData.organization,
      email: attendeeData.email,
      password: attendeeData.password,
      phone: attendeeData.phone,
    });
    console.log('Attendee signup response:', response);
    
    return response;
  } catch (error) {
    console.error('Attendee signup error:', error);
    return {
      success: false,
      error: error.message || 'Attendee signup failed',
    };
  }
};

/**
 * Delete user (Admin only)
 * @param {string} userId - User ID to delete
 * @param {string} adminUserId - Admin user ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const deleteUser = async (userId, adminUserId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.delete(`/Auth/users/${userId}`, {
      headers: {
        'X-Admin-User-Id': adminUserId,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    return response;
  } catch (error) {
    console.error('Delete user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete user',
    };
  }
};

/**
 * Get all staff members with their permissions (Admin only)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getStaffMembers = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-Admin-User-Id': userId }),
    };
    
    const response = await apiClient.get('/Auth/staff', { headers });
    return response;
  } catch (error) {
    console.error('Get staff members error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get staff members',
    };
  }
};
