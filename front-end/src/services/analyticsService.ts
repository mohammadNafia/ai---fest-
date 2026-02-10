/**
 * Analytics Service - Business logic for analytics and metrics
 * Computes daily, weekly, monthly summaries and top values
 */

import { formsRepository } from '@/repositories/formsRepository';
import type {
  AttendeeFormData,
  SpeakerFormData,
  PartnerFormData,
  DailySubmissionData,
  WeeklySummary,
  MonthlySummary,
  TopValue,
  SubmissionHeatmapData,
  ApiResponse,
  ActivityLogItem,
} from '@/types';

class AnalyticsService {
  /**
   * Get daily submission counts
   */
  async getDailySubmissions(): Promise<ApiResponse<DailySubmissionData[]>> {
    try {
      const { attendees, speakers, partners } = await formsRepository.getAllSubmissions();

      const allSubmissions = [
        ...attendees.map(a => ({ date: a.dateSubmitted, type: 'attendees' as const })),
        ...speakers.map(s => ({ date: s.dateSubmitted, type: 'speakers' as const })),
        ...partners.map(p => ({ date: p.dateSubmitted, type: 'partners' as const })),
      ];

      const groupedByDate: Record<string, { count: number; attendees: number; speakers: number; partners: number }> = {};

      allSubmissions.forEach(sub => {
        const date = new Date(sub.date).toISOString().split('T')[0];
        if (!groupedByDate[date]) {
          groupedByDate[date] = { count: 0, attendees: 0, speakers: 0, partners: 0 };
        }
        groupedByDate[date].count++;
        if (sub.type === 'attendees') groupedByDate[date].attendees++;
        if (sub.type === 'speakers') groupedByDate[date].speakers++;
        if (sub.type === 'partners') groupedByDate[date].partners++;
      });

      const data = Object.entries(groupedByDate)
        .map(([date, counts]) => ({
          date,
          ...counts,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compute daily submissions',
      };
    }
  }

  /**
   * Get weekly summaries
   */
  async getWeeklySummaries(): Promise<ApiResponse<WeeklySummary[]>> {
    try {
      const dailyData = await this.getDailySubmissions();
      if (!dailyData.success || !dailyData.data) {
        return { success: false, error: 'Failed to get daily data' };
      }

      const weeklyMap: Record<string, WeeklySummary> = {};

      dailyData.data.forEach(day => {
        const date = new Date(day.date);
        const weekStart = this.getWeekStart(date);
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeklyMap[weekKey]) {
          weeklyMap[weekKey] = {
            week: weekKey,
            totalSubmissions: 0,
            attendees: 0,
            speakers: 0,
            partners: 0,
            averagePerDay: 0,
          };
        }

        weeklyMap[weekKey].totalSubmissions += day.count;
        weeklyMap[weekKey].attendees += day.attendees;
        weeklyMap[weekKey].speakers += day.speakers;
        weeklyMap[weekKey].partners += day.partners;
      });

      const data = Object.values(weeklyMap).map(week => ({
        ...week,
        averagePerDay: week.totalSubmissions / 7,
      }));

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compute weekly summaries',
      };
    }
  }

  /**
   * Get monthly summaries
   */
  async getMonthlySummaries(): Promise<ApiResponse<MonthlySummary[]>> {
    try {
      const dailyData = await this.getDailySubmissions();
      if (!dailyData.success || !dailyData.data) {
        return { success: false, error: 'Failed to get daily data' };
      }

      const monthlyMap: Record<string, MonthlySummary> = {};

      dailyData.data.forEach(day => {
        const date = new Date(day.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {
            month: monthKey,
            totalSubmissions: 0,
            attendees: 0,
            speakers: 0,
            partners: 0,
          };
        }

        monthlyMap[monthKey].totalSubmissions += day.count;
        monthlyMap[monthKey].attendees += day.attendees;
        monthlyMap[monthKey].speakers += day.speakers;
        monthlyMap[monthKey].partners += day.partners;
      });

      const data = Object.values(monthlyMap);
      const sortedData = data.sort((a, b) => a.month.localeCompare(b.month));

      // Calculate growth rates
      for (let i = 1; i < sortedData.length; i++) {
        const prev = sortedData[i - 1].totalSubmissions;
        const curr = sortedData[i].totalSubmissions;
        sortedData[i].growthRate = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
      }

      return { success: true, data: sortedData };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compute monthly summaries',
      };
    }
  }

  /**
   * Get top occupations
   */
  async getTopOccupations(limit: number = 10): Promise<ApiResponse<TopValue[]>> {
    try {
      const attendees = await formsRepository.getAttendees();
      const occupationCounts: Record<string, number> = {};

      attendees.forEach(a => {
        const occupation = a.occupation || 'Other';
        occupationCounts[occupation] = (occupationCounts[occupation] || 0) + 1;
      });

      const total = attendees.length;
      const data = Object.entries(occupationCounts)
        .map(([value, count]) => ({
          value,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compute top occupations',
      };
    }
  }

  /**
   * Get top categories
   */
  async getTopCategories(limit: number = 10): Promise<ApiResponse<TopValue[]>> {
    try {
      const partners = await formsRepository.getPartners();
      const categoryCounts: Record<string, number> = {};

      partners.forEach(p => {
        const category = p.category || 'Other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      const total = partners.length;
      const data = Object.entries(categoryCounts)
        .map(([value, count]) => ({
          value,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compute top categories',
      };
    }
  }

  /**
   * Get submission heatmap data
   */
  async getSubmissionHeatmap(): Promise<ApiResponse<SubmissionHeatmapData[]>> {
    try {
      const { attendees, speakers, partners } = await formsRepository.getAllSubmissions();
      const allSubmissions = [...attendees, ...speakers, ...partners];

      const heatmapMap: Record<string, number> = {};

      allSubmissions.forEach(sub => {
        const date = new Date(sub.dateSubmitted);
        const dateKey = date.toISOString().split('T')[0];
        const hour = date.getHours();
        const key = `${dateKey}-${hour}`;

        heatmapMap[key] = (heatmapMap[key] || 0) + 1;
      });

      const data = Object.entries(heatmapMap).map(([key, count]) => {
        const [date, hourStr] = key.split('-');
        return {
          date,
          hour: parseInt(hourStr, 10),
          count,
        };
      });

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compute heatmap',
      };
    }
  }

  /**
   * Get average processing time (simulated)
   */
  async getAverageProcessingTime(): Promise<ApiResponse<number>> {
    try {
      // Simulated: In real app, this would calculate time from submission to review
      const averageTime = 2.5; // hours
      return { success: true, data: averageTime };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compute average time',
      };
    }
  }

  /**
   * Helper: Get week start (Monday)
   */
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }
}

export const analyticsService = new AnalyticsService();

