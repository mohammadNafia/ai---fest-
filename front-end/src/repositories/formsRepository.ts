/**
 * Forms Repository - Data access layer for form submissions
 * Simulates backend database operations using localStorage
 */

import type { 
  AttendeeFormData, 
  SpeakerFormData, 
  PartnerFormData,
  ApiResponse 
} from '@/types';

const STORAGE_KEYS = {
  ATTENDEES: 'attendees',
  SPEAKERS: 'speakers',
  PARTNERS: 'partners',
} as const;

class FormsRepository {
  /**
   * Get all attendees from storage
   */
  async getAttendees(): Promise<AttendeeFormData[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDEES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading attendees:', error);
      return [];
    }
  }

  /**
   * Save attendee to storage
   */
  async saveAttendee(attendee: AttendeeFormData): Promise<void> {
    try {
      const existing = await this.getAttendees();
      const updated = [...existing, attendee];
      localStorage.setItem(STORAGE_KEYS.ATTENDEES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving attendee:', error);
      throw error;
    }
  }

  /**
   * Get all speakers from storage
   */
  async getSpeakers(): Promise<SpeakerFormData[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SPEAKERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading speakers:', error);
      return [];
    }
  }

  /**
   * Save speaker to storage
   */
  async saveSpeaker(speaker: SpeakerFormData): Promise<void> {
    try {
      const existing = await this.getSpeakers();
      const updated = [...existing, speaker];
      localStorage.setItem(STORAGE_KEYS.SPEAKERS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving speaker:', error);
      throw error;
    }
  }

  /**
   * Get all partners from storage
   */
  async getPartners(): Promise<PartnerFormData[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PARTNERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading partners:', error);
      return [];
    }
  }

  /**
   * Save partner to storage
   */
  async savePartner(partner: PartnerFormData): Promise<void> {
    try {
      const existing = await this.getPartners();
      const updated = [...existing, partner];
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving partner:', error);
      throw error;
    }
  }

  /**
   * Get all submissions (combined)
   */
  async getAllSubmissions(): Promise<{
    attendees: AttendeeFormData[];
    speakers: SpeakerFormData[];
    partners: PartnerFormData[];
  }> {
    const [attendees, speakers, partners] = await Promise.all([
      this.getAttendees(),
      this.getSpeakers(),
      this.getPartners(),
    ]);

    return { attendees, speakers, partners };
  }
}

export const formsRepository = new FormsRepository();

