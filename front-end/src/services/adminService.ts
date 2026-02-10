/**
 * Admin Service - Business logic for admin operations
 */

import { formsRepository } from '@/repositories/formsRepository';
import type {
  AttendeeFormData,
  SpeakerFormData,
  PartnerFormData,
  ActivityLogItem,
  ApiResponse,
} from '@/types';

class AdminService {
  /**
   * Get all submissions with activity log
   */
  async getAllSubmissions(): Promise<ApiResponse<{
    attendees: AttendeeFormData[];
    speakers: SpeakerFormData[];
    partners: PartnerFormData[];
    activityLog: ActivityLogItem[];
  }>> {
    try {
      const { attendees, speakers, partners } = await formsRepository.getAllSubmissions();

      // Create activity log
      const activityLog: ActivityLogItem[] = [
        ...attendees.map(item => ({
          id: item.id?.toString() || '',
          type: 'attendee' as const,
          name: item.name,
          email: item.email,
          timestamp: item.dateSubmitted,
          action: 'submitted',
        })),
        ...speakers.map(item => ({
          id: item.id?.toString() || '',
          type: 'speaker' as const,
          name: item.name,
          email: item.email,
          timestamp: item.dateSubmitted,
          action: 'submitted',
        })),
        ...partners.map(item => ({
          id: item.id?.toString() || '',
          type: 'partner' as const,
          name: item.organization || '',
          email: item.email,
          timestamp: item.dateSubmitted,
          action: 'submitted',
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        success: true,
        data: {
          attendees,
          speakers,
          partners,
          activityLog,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch submissions',
      };
    }
  }

  /**
   * Get analytics summary
   */
  async getAnalytics(): Promise<ApiResponse<{
    totalAttendees: number;
    totalSpeakers: number;
    totalPartners: number;
    mostCommonOccupation: string;
    topPartnershipCategory: string;
  }>> {
    try {
      const { attendees, speakers, partners } = await formsRepository.getAllSubmissions();

      // Calculate most common occupation
      const occupations = attendees.map(a => a.occupation).filter(Boolean);
      const occupationCounts: Record<string, number> = {};
      occupations.forEach(occ => {
        occupationCounts[occ] = (occupationCounts[occ] || 0) + 1;
      });
      const mostCommonOccupation = Object.entries(occupationCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      // Calculate top partnership category
      const categories = partners.map(p => p.category).filter(Boolean);
      const categoryCounts: Record<string, number> = {};
      categories.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      const topPartnershipCategory = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      return {
        success: true,
        data: {
          totalAttendees: attendees.length,
          totalSpeakers: speakers.length,
          totalPartners: partners.length,
          mostCommonOccupation,
          topPartnershipCategory,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compute analytics',
      };
    }
  }
}

export const adminService = new AdminService();

