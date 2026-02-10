/**
 * Forms Service - Business logic layer for form submissions
 * Handles validation, transformation, and error handling
 */

import { formsRepository } from '@/repositories/formsRepository';
import type { 
  AttendeeFormData, 
  SpeakerFormData, 
  PartnerFormData,
  ApiResponse 
} from '@/types';

class FormsService {
  /**
   * Submit attendee registration
   */
  async submitAttendee(
    data: Omit<AttendeeFormData, 'id' | 'dateSubmitted'>
  ): Promise<ApiResponse<AttendeeFormData>> {
    try {
      const newEntry: AttendeeFormData = {
        ...data,
        id: Date.now().toString(),
        dateSubmitted: new Date().toISOString(),
      };

      await formsRepository.saveAttendee(newEntry);

      return {
        success: true,
        data: newEntry,
        message: 'Attendee registration submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit attendee registration',
      };
    }
  }

  /**
   * Get all attendees
   */
  async getAttendees(): Promise<ApiResponse<AttendeeFormData[]>> {
    try {
      const data = await formsRepository.getAttendees();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendees',
      };
    }
  }

  /**
   * Submit speaker application
   */
  async submitSpeaker(
    data: Omit<SpeakerFormData, 'id' | 'dateSubmitted'>
  ): Promise<ApiResponse<SpeakerFormData>> {
    try {
      const newEntry: SpeakerFormData = {
        ...data,
        id: Date.now().toString(),
        dateSubmitted: new Date().toISOString(),
      };

      await formsRepository.saveSpeaker(newEntry);

      return {
        success: true,
        data: newEntry,
        message: 'Speaker application submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit speaker application',
      };
    }
  }

  /**
   * Get all speakers
   */
  async getSpeakers(): Promise<ApiResponse<SpeakerFormData[]>> {
    try {
      const data = await formsRepository.getSpeakers();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch speakers',
      };
    }
  }

  /**
   * Submit partnership request
   */
  async submitPartner(
    data: Omit<PartnerFormData, 'id' | 'dateSubmitted'>
  ): Promise<ApiResponse<PartnerFormData>> {
    try {
      const newEntry: PartnerFormData = {
        ...data,
        id: Date.now().toString(),
        dateSubmitted: new Date().toISOString(),
      };

      await formsRepository.savePartner(newEntry);

      return {
        success: true,
        data: newEntry,
        message: 'Partnership request submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit partnership request',
      };
    }
  }

  /**
   * Get all partners
   */
  async getPartners(): Promise<ApiResponse<PartnerFormData[]>> {
    try {
      const data = await formsRepository.getPartners();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch partners',
      };
    }
  }
}

export const formsService = new FormsService();

