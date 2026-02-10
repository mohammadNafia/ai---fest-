# Backend Architecture Documentation - Baghdad AI Summit 2026

## Overview

The Baghdad AI Summit 2026 application currently uses a **client-side data persistence architecture** with no traditional backend server. All data operations are handled in the browser using **localStorage** as the storage mechanism. The application follows a **layered architecture pattern** that separates concerns into Repository, Service, and API layers, making it ready for backend migration.

---

## Architecture Layers

### 1. Repository Layer (`src/repositories/`)

**Purpose**: Data access abstraction layer that handles all storage operations.

**File**: `formsRepository.ts`

**Responsibilities**:
- Abstracting data storage operations
- Providing a consistent interface for data access
- Error handling for storage operations
- Ready for backend migration (can swap localStorage for HTTP calls)

**Key Methods**:
```typescript
- getAttendees(): Promise<AttendeeFormData[]>
- saveAttendee(attendee: AttendeeFormData): Promise<void>
- getSpeakers(): Promise<SpeakerFormData[]>
- saveSpeaker(speaker: SpeakerFormData): Promise<void>
- getPartners(): Promise<PartnerFormData[]>
- savePartner(partner: PartnerFormData): Promise<void>
- getAllSubmissions(): Promise<{attendees, speakers, partners}>
```

**Storage Keys**:
- `attendees` - Stores all attendee registrations
- `speakers` - Stores all speaker applications
- `partners` - Stores all partnership requests

**Current Implementation**:
- Uses `localStorage.getItem()` and `localStorage.setItem()`
- JSON serialization/deserialization
- Error handling with try-catch blocks
- Returns empty arrays on read errors

---

### 2. Service Layer (`src/services/`)

**Purpose**: Business logic layer that handles validation, transformation, and orchestration.

#### 2.1 Forms Service (`formsService.ts`)

**Responsibilities**:
- Form submission business logic
- Data transformation (adding IDs, timestamps)
- Error handling and response formatting
- Returns standardized `ApiResponse<T>` format

**Key Methods**:
```typescript
- submitAttendee(data): Promise<ApiResponse<AttendeeFormData>>
- getAttendees(): Promise<ApiResponse<AttendeeFormData[]>>
- submitSpeaker(data): Promise<ApiResponse<SpeakerFormData>>
- getSpeakers(): Promise<ApiResponse<SpeakerFormData[]>>
- submitPartner(data): Promise<ApiResponse<PartnerFormData>>
- getPartners(): Promise<ApiResponse<PartnerFormData[]>>
```

**Data Transformation**:
- Automatically adds `id` (timestamp-based)
- Adds `dateSubmitted` (ISO string)
- Validates data structure

#### 2.2 Admin Service (`adminService.ts`)

**Responsibilities**:
- Admin-specific operations
- Activity log generation
- Analytics computation
- Aggregating data from multiple sources

**Key Methods**:
```typescript
- getAllSubmissions(): Promise<ApiResponse<{attendees, speakers, partners, activityLog}>>
- getAnalytics(): Promise<ApiResponse<{totalAttendees, totalSpeakers, totalPartners, mostCommonOccupation, topPartnershipCategory}>>
```

**Activity Log**:
- Combines all submission types into a unified timeline
- Sorted by timestamp (newest first)
- Includes: id, type, name, email, timestamp, action

**Analytics Computations**:
- Total counts per submission type
- Most common occupation (from attendees)
- Top partnership category (from partners)

#### 2.3 Analytics Service (`analyticsService.ts`)

**Responsibilities**:
- Advanced analytics and metrics computation
- Time-based aggregations (daily, weekly, monthly)
- Top value calculations
- Heatmap data generation

**Key Methods**:
```typescript
- getDailySubmissions(): Promise<ApiResponse<DailySubmissionData[]>>
- getWeeklySummaries(): Promise<ApiResponse<WeeklySummary[]>>
- getMonthlySummaries(): Promise<ApiResponse<MonthlySummary[]>>
- getTopOccupations(limit): Promise<ApiResponse<TopValue[]>>
- getTopCategories(limit): Promise<ApiResponse<TopValue[]>>
- getSubmissionHeatmap(): Promise<ApiResponse<SubmissionHeatmapData[]>>
- getAverageProcessingTime(): Promise<ApiResponse<number>>
```

**Analytics Features**:
- **Daily Submissions**: Counts by date with breakdown by type
- **Weekly Summaries**: Aggregated weekly data with averages
- **Monthly Summaries**: Monthly aggregation with growth rate calculations
- **Top Values**: Most common occupations/categories with percentages
- **Heatmap**: Hourly submission patterns
- **Processing Time**: Simulated average processing time

#### 2.4 Search Service (`searchService.ts`)

**Responsibilities**:
- Full-text search using Fuse.js
- Search indexing
- Recent searches tracking
- Fuzzy matching

**Key Methods**:
```typescript
- indexData(): Promise<void>
- search(query, options): Promise<SearchResult[]>
- getRecentSearches(): Promise<RecentSearch[]>
- saveRecentSearch(query, resultsCount): Promise<void>
```

**Search Capabilities**:
- Indexes: pages, speakers, agenda items, partners, submissions
- Fuzzy matching with configurable threshold
- Score-based ranking
- Highlight generation
- Recent searches stored in localStorage

---

### 3. API Simulation Layer (`src/api/`)

**Purpose**: Provides API-like interface for components to interact with data.

#### 3.1 Forms API (`forms.js`)

**File**: `forms.js` (JavaScript, not TypeScript)

**Methods**:
```javascript
- submitAttendee(data)
- getAttendees()
- submitSpeaker(data)
- getSpeakers()
- submitPartner(data)
- getPartners()
```

**Note**: This layer directly uses localStorage and is being phased out in favor of the Service layer.

#### 3.2 Admin API (`admin.js`)

**File**: `admin.js` (JavaScript, not TypeScript)

**Methods**:
```javascript
- getAllSubmissions()
- getAnalytics()
```

**Note**: This layer aggregates data from Forms API and is being phased out.

---

## Data Models

### AttendeeFormData
```typescript
{
  id?: string | number;
  name: string;
  age: number | string;
  occupation: string;
  organization: string;
  email: string;
  phone: string;
  motivation: string;
  dateSubmitted: string;
  status?: 'pending' | 'approved' | 'rejected';
  newsletter?: boolean;
}
```

### SpeakerFormData
```typescript
{
  id?: string | number;
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
}
```

### PartnerFormData
```typescript
{
  id?: string | number;
  organization: string;
  email: string;
  category: string;
  requirements?: string;
  dateSubmitted: string;
}
```

---

## Authentication & State Management

### Auth Store (`src/state/authStore.ts`)

**Technology**: Zustand with persistence middleware

**Features**:
- User session management
- Token storage
- Session expiry tracking (24 hours)
- Auto-logout on expiry
- Persistent storage (localStorage)

**State**:
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpiry: number | null;
}
```

**Methods**:
- `login(user, token, expiresIn)`
- `logout()`
- `checkSession()` - Validates and auto-logouts if expired
- `refreshToken()` - Extends session

**User Roles**:
- `guest` - Unauthenticated users
- `user` - Regular authenticated users
- `admin` - Full admin access
- `staff` - Staff members
- `reviewer` - Content reviewers

---

## API Response Format

All service methods return a standardized `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**Success Example**:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

**Error Example**:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Current Limitations

### 1. **Data Persistence**
- ❌ Data stored only in browser localStorage
- ❌ Data lost when browser cache is cleared
- ❌ No data synchronization across devices
- ❌ No backup or recovery mechanism
- ❌ Limited storage capacity (~5-10MB)

### 2. **Scalability**
- ❌ Cannot handle large datasets efficiently
- ❌ No pagination support
- ❌ All data loaded into memory
- ❌ Performance degrades with data growth

### 3. **Security**
- ❌ No server-side validation
- ❌ No authentication/authorization on data access
- ❌ Data accessible via browser DevTools
- ❌ No encryption at rest
- ❌ No audit logging

### 4. **Multi-User Support**
- ❌ No concurrent user support
- ❌ No data conflict resolution
- ❌ No real-time updates
- ❌ No user-specific data isolation

### 5. **Analytics**
- ❌ Analytics computed client-side (performance impact)
- ❌ No historical data retention
- ❌ Limited query capabilities
- ❌ No advanced reporting

### 6. **Integration**
- ❌ No external API integration
- ❌ No email notifications
- ❌ No webhook support
- ❌ No third-party service integration

---

## Data Flow

```
Component
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
localStorage (Current Implementation)
```

**Example Flow - Submit Attendee**:
1. Component calls `formsService.submitAttendee(data)`
2. Service adds `id` and `dateSubmitted`
3. Service calls `formsRepository.saveAttendee(attendee)`
4. Repository reads existing data from localStorage
5. Repository appends new entry
6. Repository writes back to localStorage
7. Service returns `ApiResponse<AttendeeFormData>`

---

## Migration Readiness

The current architecture is **well-structured for backend migration**:

✅ **Separation of Concerns**: Clear separation between data access, business logic, and presentation
✅ **Abstraction**: Repository pattern allows swapping storage mechanism
✅ **Type Safety**: TypeScript types defined for all data models
✅ **Standardized Responses**: Consistent `ApiResponse<T>` format
✅ **Error Handling**: Comprehensive error handling at each layer

**Migration Path**:
1. Replace `localStorage` operations in Repository with HTTP calls
2. Update Service layer to handle async HTTP responses
3. Add authentication headers to API calls
4. Implement proper error handling for network failures
5. Add loading states and retry logic

---

## File Structure

```
src/
├── repositories/
│   └── formsRepository.ts      # Data access layer
├── services/
│   ├── formsService.ts          # Form submission logic
│   ├── adminService.ts          # Admin operations
│   ├── analyticsService.ts     # Analytics computation
│   └── searchService.ts         # Search functionality
├── api/
│   ├── forms.js                # Legacy API simulation
│   └── admin.js                # Legacy admin API
├── state/
│   └── authStore.ts            # Authentication state
└── types/
    └── index.d.ts              # TypeScript definitions
```

---

## Dependencies

**State Management**:
- `zustand` - Lightweight state management
- `zustand/middleware/persist` - Persistence middleware

**Search**:
- `fuse.js` - Fuzzy search library

**Validation**:
- `zod` - Schema validation (used in forms)

---

## Summary

The current backend architecture is a **well-designed client-side data layer** that:
- ✅ Follows best practices (Repository pattern, Service layer)
- ✅ Uses TypeScript for type safety
- ✅ Provides consistent API responses
- ✅ Is structured for easy migration to a real backend
- ❌ Limited by browser storage constraints
- ❌ No server-side security or validation
- ❌ Cannot scale beyond single-user scenarios

**Next Steps**: Migrate to ASP.NET Core backend with PostgreSQL database for production-ready scalability, security, and multi-user support.
