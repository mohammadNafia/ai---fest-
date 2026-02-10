/**
 * AdminDashboard Component Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';
import { registrationService } from '@/services/registrationService';
import { settingsService } from '@/services/settingsService';

// Mock dependencies
vi.mock('@/services/registrationService');
vi.mock('@/services/settingsService');
vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    getDailySubmissions: () => Promise.resolve({ success: true, data: [] }),
    getWeeklySummaries: () => Promise.resolve({ success: true, data: [] }),
    getMonthlySummaries: () => Promise.resolve({ success: true, data: [] }),
    getTopOccupations: () => Promise.resolve({ success: true, data: [] }),
    getTopCategories: () => Promise.resolve({ success: true, data: [] }),
    getSubmissionHeatmap: () => Promise.resolve({ success: true, data: [] }),
    getAverageProcessingTime: () => Promise.resolve({ success: true, data: 0 }),
  },
}));

// Mock contexts
const mockAuthContext = {
  isAdmin: true,
  adminLogout: vi.fn(),
};

const mockLanguageContext = {
  lang: 'en',
  t: {
    admin: {
      dashboard: 'Dashboard',
      totalRegistrations: 'Total Registrations',
      totalSpeakers: 'Total Speakers',
      totalPartners: 'Total Partners',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      search: 'Search',
      page: 'Page',
      of: 'of',
      noData: 'No data',
      logout: 'Logout',
    },
  },
};

const mockThemeContext = {
  theme: 'light',
  toggleTheme: vi.fn(),
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => mockLanguageContext,
}));

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockThemeContext,
}));

vi.mock('@/components/ui/Toast', () => ({
  ToastContainer: () => null,
  useToast: () => ({
    toasts: [],
    dismissToast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

const renderAdminDashboard = () => {
  return render(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage to prevent redirect
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'true'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
    
    vi.mocked(registrationService.getAllAttendees).mockResolvedValue({
      success: true,
      data: [
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          status: 'pending',
        },
      ],
    });
    vi.mocked(registrationService.getAllSpeakers).mockResolvedValue({
      success: true,
      data: [],
    });
    vi.mocked(registrationService.getAllPartners).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  describe('Seats Counter', () => {
    it('should display seats taken counter', async () => {
      renderAdminDashboard();

      // Wait for loading to complete (check for any loading indicators)
      await waitFor(() => {
        const loadingText = screen.queryByText(/loading/i);
        const spinner = screen.queryByRole('status');
        expect(loadingText).not.toBeInTheDocument();
        expect(spinner).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for seats counter to appear (case insensitive)
      await waitFor(() => {
        const seatsText = screen.getByText(/seats taken/i);
        expect(seatsText).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should show correct count format (X / 250)', async () => {
      renderAdminDashboard();

      // Wait for loading to complete
      await waitFor(() => {
        const loadingText = screen.queryByText(/loading/i);
        expect(loadingText).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for seats counter with format (look for the number pattern)
      await waitFor(() => {
        // Look for text containing numbers and "/ 250" or similar
        const seatsText = screen.getByText(/\d+\s*\/\s*250/i);
        expect(seatsText).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Attendee Approval Workflow', () => {
    it('should show Approve and Reject buttons for pending attendees', async () => {
      renderAdminDashboard();

      // Wait for loading to complete
      await waitFor(() => {
        const loadingText = screen.queryByText(/loading/i);
        expect(loadingText).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Navigate to attendees tab
      await waitFor(() => {
        const attendeesTab = screen.getByText(/attendees/i);
        expect(attendeesTab).toBeInTheDocument();
        fireEvent.click(attendeesTab);
      }, { timeout: 5000 });

      // Wait for approve/reject buttons to appear
      await waitFor(() => {
        expect(screen.getByText(/approve/i)).toBeInTheDocument();
        expect(screen.getByText(/reject/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should update attendee status when Approve is clicked', async () => {
      vi.mocked(registrationService.updateAttendeeStatus).mockResolvedValue({
        success: true,
        data: { id: '1', status: 'approved' },
      });

      vi.mocked(registrationService.getAllAttendees).mockResolvedValue({
        success: true,
        data: [
          {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
<<<<<<< HEAD
            status: 'pending',
=======
            status: 'approved',
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
          },
        ],
      });

      renderAdminDashboard();

      // Wait for loading to complete
      await waitFor(() => {
        const loadingText = screen.queryByText(/loading/i);
        expect(loadingText).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Navigate to attendees tab
      await waitFor(() => {
        const attendeesTab = screen.getByText(/attendees/i);
        fireEvent.click(attendeesTab);
      }, { timeout: 5000 });

      // Wait for approve button and click it
      await waitFor(() => {
        const approveButton = screen.getByText(/approve/i);
        expect(approveButton).toBeInTheDocument();
        fireEvent.click(approveButton);
      }, { timeout: 5000 });

      // Verify the service was called
      await waitFor(() => {
        expect(registrationService.updateAttendeeStatus).toHaveBeenCalledWith('1', 'approved');
      }, { timeout: 5000 });
    });

    it('should refresh attendees list after status update', async () => {
      vi.mocked(registrationService.updateAttendeeStatus).mockResolvedValue({
        success: true,
        data: { id: '1', status: 'approved' },
      });

      renderAdminDashboard();

      // Wait for loading to complete
      await waitFor(() => {
        const loadingText = screen.queryByText(/loading/i);
        expect(loadingText).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Navigate to attendees tab
      await waitFor(() => {
        const attendeesTab = screen.getByText(/attendees/i);
        fireEvent.click(attendeesTab);
      }, { timeout: 5000 });

      await waitFor(() => {
        const approveButton = screen.getByText(/approve/i);
        expect(approveButton).toBeInTheDocument();
        fireEvent.click(approveButton);
      });

      await waitFor(() => {
        expect(registrationService.getAllAttendees).toHaveBeenCalledTimes(2); // Initial + refresh
      }, { timeout: 3000 });
    });
  });

  describe('Settings Tab', () => {
    it('should display Settings tab', async () => {
      renderAdminDashboard();

      // Wait for loading to complete
      await waitFor(() => {
        const loadingText = screen.queryByText(/loading/i);
        expect(loadingText).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for settings tab to appear
      await waitFor(() => {
        expect(screen.getByText(/settings/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should show registrations toggle in Settings tab', async () => {
      vi.mocked(settingsService.isRegistrationOpen).mockResolvedValue(true);
      vi.mocked(settingsService.isShowSpeakers).mockResolvedValue(true);

      renderAdminDashboard();

      // Wait for loading to complete
      await waitFor(() => {
        const loadingText = screen.queryByText(/loading/i);
        expect(loadingText).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for settings tab to be available and click it
      await waitFor(() => {
        const settingsTab = screen.getByText(/settings/i);
        expect(settingsTab).toBeInTheDocument();
        fireEvent.click(settingsTab);
      }, { timeout: 5000 });

      // Wait for registrations toggle to appear
      await waitFor(() => {
        expect(screen.getByText(/registrations open/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should show show speakers toggle in Settings tab', async () => {
      vi.mocked(settingsService.isRegistrationOpen).mockResolvedValue(true);
      vi.mocked(settingsService.isShowSpeakers).mockResolvedValue(true);

      renderAdminDashboard();

      // Wait for loading to complete
      await waitFor(() => {
        const loadingText = screen.queryByText(/loading/i);
        expect(loadingText).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for settings tab to be available and click it
      await waitFor(() => {
        const settingsTab = screen.getByText(/settings/i);
        expect(settingsTab).toBeInTheDocument();
        fireEvent.click(settingsTab);
      }, { timeout: 5000 });

      // Wait for show speakers toggle to appear
      await waitFor(() => {
        expect(screen.getByText(/show speakers/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});
