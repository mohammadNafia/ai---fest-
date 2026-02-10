// ============================================================================
// CORE TYPE DEFINITIONS - Baghdad AI Summit 2026
// ============================================================================

// ============================================================================
// PRIMITIVE TYPES
// ============================================================================

export type Theme = "light" | "dark";
export type Lang = "en" | "ar";
export type UserRole = "guest" | "user" | "admin" | "staff" | "reviewer";

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// DOMAIN MODELS
// ============================================================================

export interface Speaker {
  id: number | string;
  name: string;
  name_ar?: string;
  role: string;
  role_ar?: string;
  company: string;
  company_ar?: string;
  image: string;
  topic?: string;
  topic_ar?: string;
  bio?: string;
  bio_ar?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  order_index?: number;
  [key: string]: any;
}

export interface AgendaItem {
  id?: number | string;
  time: string;
  title: string;
  desc: string;
  type: "Keynote" | "Panel" | "Workshop" | "Competition" | "Logistics" | string;
  speakerIds?: (number | string)[];
  location?: string;
  duration?: string;
}

export interface Partner {
  id?: number | string;
  name: string;
  category: string;
  icon?: any;
  color?: string;
  website?: string;
  description?: string;
}

export interface Testimonial {
  id: number | string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  avatar?: string;
  rating?: number;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface AttendeeFormData {
  id?: number | string;
  name: string;
  age: number | string;
  occupation: string;
  organization: string;
  institution?: string; // Deprecated, use organization
  email: string;
  phone: string;
  motivation: string;
  dateSubmitted: string;
  status?: 'pending' | 'approved' | 'rejected';
  newsletter?: boolean;
  [key: string]: any;
}

export interface SpeakerFormData {
  id?: number | string;
  name: string;
  occupation: string;
  institution: string;
  email: string;
  phone: string;
  skills: string;
  experience: string;
  topics: string;
  achievements: string;
  dateSubmitted: string;
  [key: string]: any;
}

export interface PartnerFormData {
  id?: number | string;
  organization: string;
  email: string;
  category: string;
  requirements?: string;
  dateSubmitted: string;
  [key: string]: any;
}

// ============================================================================
// ANALYTICS & CHART DATA TYPES
// ============================================================================

export interface DailySubmissionData {
  date: string;
  count: number;
  attendees: number;
  speakers: number;
  partners: number;
}

export interface CategoryCountData {
  category: string;
  count: number;
}

export interface OccupationDistributionData {
  occupation: string;
  count: number;
}

export interface WeeklySummary {
  week: string;
  totalSubmissions: number;
  attendees: number;
  speakers: number;
  partners: number;
  averagePerDay: number;
}

export interface MonthlySummary {
  month: string;
  totalSubmissions: number;
  attendees: number;
  speakers: number;
  partners: number;
  growthRate?: number;
}

export interface TopValue {
  value: string;
  count: number;
  percentage: number;
}

export interface ActivityLogItem {
  id: string;
  type: "attendee" | "speaker" | "partner";
  name: string;
  email: string;
  timestamp: string;
  action?: string;
}

export interface SubmissionHeatmapData {
  date: string;
  hour: number;
  count: number;
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResult {
  id: string;
  type: "page" | "speaker" | "agenda" | "partner";
  title: string;
  description?: string;
  url: string;
  score?: number;
  highlights?: string[];
}

export interface SearchCategory {
  name: string;
  results: SearchResult[];
  count: number;
}

export interface RecentSearch {
  query: string;
  timestamp: string;
  resultsCount: number;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  permissions?: StaffPermissions;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
  createdAt: string;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type ExportFormat = "csv" | "json" | "pdf";
export interface ExportOptions {
  format: ExportFormat;
  includeHeaders?: boolean;
  localized?: boolean;
  lang?: Lang;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// DISCRIMINATED UNIONS
// ============================================================================

export type FormSubmission = 
  | { type: "attendee"; data: AttendeeFormData }
  | { type: "speaker"; data: SpeakerFormData }
  | { type: "partner"; data: PartnerFormData };

export type ChartData = 
  | DailySubmissionData[]
  | CategoryCountData[]
  | OccupationDistributionData[];

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ThemeAwareProps {
  theme?: Theme;
}

export interface LanguageAwareProps {
  lang?: Lang;
}

export interface ResponsiveProps {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
}

// ============================================================================
// STAFF MANAGEMENT TYPES
// ============================================================================

// Re-export staff types from staffTypes.ts
export type * from './staffTypes';

// ============================================================================
// DATABASE MIGRATIONS
// ============================================================================

/*

-- Add status column to attendee_registrations table
ALTER TABLE attendee_registrations 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add unique constraint on email
ALTER TABLE attendee_registrations 
ADD CONSTRAINT unique_attendee_email UNIQUE (email);

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_attendee_status ON attendee_registrations(status);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_attendee_email ON attendee_registrations(email);

*/
