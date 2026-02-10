// Service layer type definitions
import type { 
  ApiResponse, 
  AttendeeFormData, 
  SpeakerFormData, 
  PartnerFormData,
  DailySubmissionData,
  WeeklySummary,
  MonthlySummary,
  TopValue,
  ActivityLogItem,
  SubmissionHeatmapData
} from '@/types';

export interface FormsService {
  submitAttendee(data: Omit<AttendeeFormData, 'id' | 'dateSubmitted'>): Promise<ApiResponse<AttendeeFormData>>;
  getAttendees(): Promise<ApiResponse<AttendeeFormData[]>>;
  submitSpeaker(data: Omit<SpeakerFormData, 'id' | 'dateSubmitted'>): Promise<ApiResponse<SpeakerFormData>>;
  getSpeakers(): Promise<ApiResponse<SpeakerFormData[]>>;
  submitPartner(data: Omit<PartnerFormData, 'id' | 'dateSubmitted'>): Promise<ApiResponse<PartnerFormData>>;
  getPartners(): Promise<ApiResponse<PartnerFormData[]>>;
}

export interface AdminService {
  getAllSubmissions(): Promise<ApiResponse<{
    attendees: AttendeeFormData[];
    speakers: SpeakerFormData[];
    partners: PartnerFormData[];
    activityLog: ActivityLogItem[];
  }>>;
  getAnalytics(): Promise<ApiResponse<{
    totalAttendees: number;
    totalSpeakers: number;
    totalPartners: number;
    mostCommonOccupation: string;
    topPartnershipCategory: string;
  }>>;
}

export interface AnalyticsService {
  getDailySubmissions(): Promise<ApiResponse<DailySubmissionData[]>>;
  getWeeklySummaries(): Promise<ApiResponse<WeeklySummary[]>>;
  getMonthlySummaries(): Promise<ApiResponse<MonthlySummary[]>>;
  getTopOccupations(limit?: number): Promise<ApiResponse<TopValue[]>>;
  getTopCategories(limit?: number): Promise<ApiResponse<TopValue[]>>;
  getSubmissionHeatmap(): Promise<ApiResponse<SubmissionHeatmapData[]>>;
  getAverageProcessingTime(): Promise<ApiResponse<number>>;
}

export interface SearchService {
  indexData(): Promise<void>;
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  getRecentSearches(): Promise<RecentSearch[]>;
  saveRecentSearch(query: string, resultsCount: number): Promise<void>;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  includeScore?: boolean;
  keys?: string[];
}

export interface SearchResult {
  id: string;
  type: 'page' | 'speaker' | 'agenda' | 'partner';
  title: string;
  description?: string;
  url: string;
  score?: number;
  highlights?: string[];
}

export interface RecentSearch {
  query: string;
  timestamp: string;
  resultsCount: number;
}

