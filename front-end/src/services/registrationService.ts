/**
 * Registration Service - ASP.NET Backend Integration
 * 
 * Uses the new ASP.NET backend API for all registration operations
 */

import { formsAPI } from '@/api/forms';
import type { AttendeeFormData, SpeakerFormData, PartnerFormData } from '@/types';

export interface RegistrationResult {
  success: boolean;
  data?: any;
  error?: string;
}

class RegistrationService {
  /**
   * Submit attendee registration to backend
   */
  async submitAttendee(formData: Partial<AttendeeFormData>): Promise<RegistrationResult> {
    try {
      console.log('[RegistrationService] Submitting attendee:', formData);
      
      const response = await formsAPI.submitAttendee({
        name: formData.name || '',
        age: formData.age || 0,
        occupation: formData.occupation || '',
        organization: formData.organization || formData.institution || '',
        email: formData.email || '',
        phone: formData.phone || '',
        motivation: formData.motivation || '',
        newsletter: formData.newsletter || false,
      });

      if (response.success && response.data) {
        console.log('[RegistrationService] Registration successful:', response.data);
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.message || 'Failed to submit registration',
      };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Submit speaker application to backend
   */
  async submitSpeaker(formData: Partial<SpeakerFormData>): Promise<RegistrationResult> {
    try {
      console.log('[RegistrationService] Submitting speaker:', formData);
      
      const response = await formsAPI.submitSpeaker({
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        occupation: formData.occupation || '',
        institution: formData.institution || formData.organization || '',
        skills: formData.skills || '',
        experience: formData.experience || '',
        topics: formData.topics || '',
        achievements: formData.achievements || '',
      });

      if (response.success && response.data) {
        console.log('[RegistrationService] Speaker submission successful:', response.data);
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.message || 'Failed to submit speaker application',
      };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Submit partner application to backend
   */
  async submitPartner(formData: Partial<PartnerFormData>): Promise<RegistrationResult> {
    try {
      console.log('[RegistrationService] Submitting partner:', formData);
      
      const response = await formsAPI.submitPartner({
        organization: formData.organization || '',
        email: formData.email || '',
        category: formData.category || '',
        requirements: formData.requirements || '',
      });

      if (response.success && response.data) {
        console.log('[RegistrationService] Partner submission successful:', response.data);
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.message || 'Failed to submit partnership request',
      };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get all attendee registrations
   */
  async getAllAttendees(): Promise<RegistrationResult> {
    try {
      const response = await formsAPI.getAttendees(1, 1000);
      
      if (response.success && response.data) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.message || 'Failed to fetch attendees',
      };
    } catch (error) {
      console.error('[RegistrationService] Error fetching attendees:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendees',
      };
    }
  }

  /**
   * Get all speaker applications
   */
  async getAllSpeakers(): Promise<RegistrationResult> {
    try {
      const response = await formsAPI.getSpeakers(1, 1000);
      
      if (response.success && response.data) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.message || 'Failed to fetch speakers',
      };
    } catch (error) {
      console.error('[RegistrationService] Error fetching speakers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch speakers',
      };
    }
  }

  /**
   * Get all partner requests
   */
  async getAllPartners(): Promise<RegistrationResult> {
    try {
      const response = await formsAPI.getPartners(1, 1000);
      
      if (response.success && response.data) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.message || 'Failed to fetch partners',
      };
    } catch (error) {
      console.error('[RegistrationService] Error fetching partners:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch partners',
      };
    }
  }

  /**
   * Get total attendee count
   */
  async getTotalAttendeeCount(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const response = await formsAPI.getAttendees(1, 1);
      
      if (response.success && response.data) {
        // Get total count from paginated response if available
        const count = Array.isArray(response.data) ? response.data.length : 0;
        return { success: true, count };
      }

      return { success: false, error: 'Failed to get count' };
    } catch (error) {
      console.error('[RegistrationService] Error getting count:', error);
      return { success: false, error: 'Failed to get count' };
    }
  }

  /**
   * Find attendee by email
   */
  async findAttendeeByEmail(email: string): Promise<RegistrationResult> {
    try {
      const response = await formsAPI.getAttendees(1, 1000);
      
      if (response.success && response.data) {
        const attendees = Array.isArray(response.data) ? response.data : [];
        const attendee = attendees.find((a: any) => 
          a.email?.toLowerCase().trim() === email.toLowerCase().trim()
        );

        if (attendee) {
          return { success: true, data: attendee };
        }

        return { success: false, error: 'No registration found with this email' };
      }

      return { success: false, error: 'Failed to search for attendee' };
    } catch (error) {
      console.error('[RegistrationService] Error finding attendee:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find registration',
      };
    }
  }

  /**
   * Update attendee status (approve/reject/pending)
   */
  async updateAttendeeStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<RegistrationResult> {
    try {
      console.log('[RegistrationService] Updating attendee status:', { id, status });
      
      const response = await formsAPI.updateAttendeeStatus(id, status);
      
      if (response.success && response.data) {
        console.log('[RegistrationService] Status update successful:', response.data);
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.error || response.message || 'Failed to update attendee status',
      };
    } catch (error) {
      console.error('[RegistrationService] Error updating status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update attendee status',
      };
    }
  }
}

export const registrationService = new RegistrationService();
