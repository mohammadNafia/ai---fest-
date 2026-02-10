// API Layer for Admin - Connected to Backend

import { apiClient } from '@/lib/apiClient';
import { formsAPI } from '@/api/forms';

export const adminAPI = {
  async getAllSubmissions() {
    // Use backend admin endpoint
    const response = await apiClient.get('/Admin/submissions');
    
    if (response.success && response.data) {
      const data = response.data;
      
      // Create activity log from all submissions
      const activityLog = [
        ...(data.attendees || []).map(item => ({
          type: 'attendee',
          name: item.name,
          email: item.email,
          timestamp: item.createdAt || item.dateSubmitted,
          id: item.id
        })),
        ...(data.speakers || []).map(item => ({
          type: 'speaker',
          name: item.name,
          email: item.email,
          timestamp: item.createdAt || item.dateSubmitted,
          id: item.id
        })),
        ...(data.partners || []).map(item => ({
          type: 'partner',
          name: item.organization || item.companyName,
          email: item.email,
          timestamp: item.createdAt || item.dateSubmitted,
          id: item.id
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        success: true,
        data: {
          attendees: data.attendees || [],
          speakers: data.speakers || [],
          partners: data.partners || [],
          activityLog
        }
      };
    }
    
    // Fallback to individual API calls if admin endpoint fails
    const [attendees, speakers, partners] = await Promise.all([
      formsAPI.getAttendees(),
      formsAPI.getSpeakers(),
      formsAPI.getPartners()
    ]);

    const activityLog = [
      ...(attendees.data || []).map(item => ({
        type: 'attendee',
        name: item.name,
        email: item.email,
        timestamp: item.dateSubmitted || item.createdAt,
        id: item.id
      })),
      ...(speakers.data || []).map(item => ({
        type: 'speaker',
        name: item.name,
        email: item.email,
        timestamp: item.dateSubmitted || item.createdAt,
        id: item.id
      })),
      ...(partners.data || []).map(item => ({
        type: 'partner',
        name: item.organization || item.companyName,
        email: item.email,
        timestamp: item.dateSubmitted || item.createdAt,
        id: item.id
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      success: true,
      data: {
        attendees: attendees.data || [],
        speakers: speakers.data || [],
        partners: partners.data || [],
        activityLog
      }
    };
  },

  async getAnalytics() {
    // Use backend dashboard endpoint
    const response = await apiClient.get('/Admin/dashboard');
    
    if (response.success && response.data) {
      const data = response.data;
      
      // Get all submissions for additional analytics
      const submissions = await this.getAllSubmissions();
      
      // Calculate most common occupation
      const occupations = (submissions.data?.attendees || []).map(a => a.occupation).filter(Boolean);
      const occupationCounts = {};
      occupations.forEach(occ => {
        occupationCounts[occ] = (occupationCounts[occ] || 0) + 1;
      });
      const mostCommonOccupation = Object.entries(occupationCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      // Calculate top partnership category
      const categories = (submissions.data?.partners || []).map(p => p.category || p.partnershipType).filter(Boolean);
      const categoryCounts = {};
      categories.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      const topCategory = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      return {
        success: true,
        data: {
          totalAttendees: data.totalAttendees || 0,
          totalSpeakers: data.totalSpeakers || 0,
          totalPartners: data.totalPartners || 0,
          pendingAttendees: data.pendingAttendees || 0,
          pendingSpeakers: data.pendingSpeakers || 0,
          pendingPartners: data.pendingPartners || 0,
          approvedAttendees: data.approvedAttendees || 0,
          approvedSpeakers: data.approvedSpeakers || 0,
          approvedPartners: data.approvedPartners || 0,
          mostCommonOccupation,
          topPartnershipCategory: topCategory
        }
      };
    }
    
    // Fallback calculation
    const submissions = await this.getAllSubmissions();
    const data = submissions.data;
    
    const occupations = (data.attendees || []).map(a => a.occupation).filter(Boolean);
    const occupationCounts = {};
    occupations.forEach(occ => {
      occupationCounts[occ] = (occupationCounts[occ] || 0) + 1;
    });
    const mostCommonOccupation = Object.entries(occupationCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const categories = (data.partners || []).map(p => p.category || p.partnershipType).filter(Boolean);
    const categoryCounts = {};
    categories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      success: true,
      data: {
        totalAttendees: (data.attendees || []).length,
        totalSpeakers: (data.speakers || []).length,
        totalPartners: (data.partners || []).length,
        mostCommonOccupation,
        topPartnershipCategory: topCategory
      }
    };
  }
};

