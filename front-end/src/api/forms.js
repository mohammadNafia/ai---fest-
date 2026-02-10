// API Layer for Forms - Connected to Backend

import { apiClient } from '@/lib/apiClient';

export const formsAPI = {
  // Attendees
  async submitAttendee(data) {
    const response = await apiClient.post('/Attendees', data);
    if (response.success && response.data) {
      // Transform backend response to match frontend format
      return {
        success: true,
        data: {
          ...response.data,
          dateSubmitted: response.data.createdAt || new Date().toISOString()
        }
      };
    }
    return response;
  },

  async getAttendees(page = 1, pageSize = 100) {
    const response = await apiClient.get(`/Attendees?page=${page}&pageSize=${pageSize}`);
    if (response.success && response.data) {
      // Handle paginated response
      const attendees = response.data.data || response.data || [];
      return {
        success: true,
        data: attendees.map(item => ({
          ...item,
          dateSubmitted: item.createdAt || item.dateSubmitted
        }))
      };
    }
    return response;
  },

  async updateAttendeeStatus(id, status) {
    // Convert frontend status ('approved', 'rejected', 'pending') to backend enum string
    // Backend uses JsonStringEnumConverter with camelCase, so it expects: "pending", "approved", "rejected"
    const statusMap = {
      'pending': 'pending',
      'approved': 'approved',
      'rejected': 'rejected'
    };
    
    // Normalize status to lowercase
    const normalizedStatus = status.toLowerCase();
    const backendStatus = statusMap[normalizedStatus] || 'pending';
    
    const response = await apiClient.patch(`/Attendees/${id}/status`, backendStatus);
    return response;
  },

  // Speakers
  async submitSpeaker(data) {
    // Get current user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return {
        success: false,
        error: 'You must be logged in to submit a speaker application'
      };
    }

    const response = await apiClient.post('/Speakers', data, {
      headers: {
        'X-User-Id': userId
      }
    });
    if (response.success && response.data) {
      return {
        success: true,
        data: {
          ...response.data,
          dateSubmitted: response.data.createdAt || new Date().toISOString()
        }
      };
    }
    return response;
  },

  async getSpeakers(page = 1, pageSize = 100) {
    const response = await apiClient.get(`/Speakers?page=${page}&pageSize=${pageSize}`);
    if (response.success && response.data) {
      const speakers = response.data.data || response.data || [];
      return {
        success: true,
        data: speakers.map(item => ({
          ...item,
          dateSubmitted: item.createdAt || item.dateSubmitted
        }))
      };
    }
    return response;
  },

  // Partners
  async submitPartner(data) {
    // Get current user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return {
        success: false,
        error: 'You must be logged in to submit a partner application'
      };
    }

    const response = await apiClient.post('/Partners', data, {
      headers: {
        'X-User-Id': userId
      }
    });
    if (response.success && response.data) {
      return {
        success: true,
        data: {
          ...response.data,
          dateSubmitted: response.data.createdAt || new Date().toISOString()
        }
      };
    }
    return response;
  },

  async getPartners(page = 1, pageSize = 100) {
    const response = await apiClient.get(`/Partners?page=${page}&pageSize=${pageSize}`);
    if (response.success && response.data) {
      const partners = response.data.data || response.data || [];
      return {
        success: true,
        data: partners.map(item => ({
          ...item,
          dateSubmitted: item.createdAt || item.dateSubmitted
        }))
      };
    }
    return response;
  }
};

