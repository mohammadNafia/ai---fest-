/**
 * CheckTicket Component Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CheckTicket from '../CheckTicket';
import { registrationService } from '@/services/registrationService';
import QRCode from 'qrcode';

// Mock dependencies
vi.mock('@/services/registrationService');
vi.mock('qrcode');
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: () => 'data:image/png;base64,mock',
    width: 800,
    height: 600,
  })),
}));
vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
  })),
}));

// Mock contexts
const mockLanguageContext = {
  lang: 'en',
  t: {
    forms: {
      general_title: 'Registration',
    },
  },
};

const mockThemeContext = {
  theme: 'light',
};

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => mockLanguageContext,
}));

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockThemeContext,
}));

const renderCheckTicket = () => {
  return render(
    <BrowserRouter>
      <CheckTicket />
    </BrowserRouter>
  );
};

describe('CheckTicket Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Search Functionality', () => {
    it('should render search form', () => {
      renderCheckTicket();
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('should search for attendee by email', async () => {
      const mockAttendee = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        status: 'approved',
      };

      vi.mocked(registrationService.findAttendeeByEmail).mockResolvedValue({
        success: true,
        data: mockAttendee,
      });

      vi.mocked(QRCode.toDataURL).mockResolvedValue('data:image/png;base64,qrcode');

      renderCheckTicket();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(registrationService.findAttendeeByEmail).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('should show pending status message', async () => {
      const mockAttendee = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        status: 'pending',
      };

      vi.mocked(registrationService.findAttendeeByEmail).mockResolvedValue({
        success: true,
        data: mockAttendee,
      });

      renderCheckTicket();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/your application is under review/i)).toBeInTheDocument();
      });
    });

    it('should show rejected status message', async () => {
      const mockAttendee = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        status: 'rejected',
      };

      vi.mocked(registrationService.findAttendeeByEmail).mockResolvedValue({
        success: true,
        data: mockAttendee,
      });

      renderCheckTicket();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        // Check for the heading - it's an h3 element
        const heading = screen.getByRole('heading', { name: /application not accepted/i });
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H3');
      }, { timeout: 5000 });
    });

    it('should show ticket for approved status', async () => {
      const mockAttendee = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        status: 'approved',
      };

      vi.mocked(registrationService.findAttendeeByEmail).mockResolvedValue({
        success: true,
        data: mockAttendee,
      });

      vi.mocked(QRCode.toDataURL).mockResolvedValue('data:image/png;base64,qrcode');

      renderCheckTicket();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/approved/i)).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
      });
    });

    it('should show not found message when attendee does not exist', async () => {
      vi.mocked(registrationService.findAttendeeByEmail).mockResolvedValue({
        success: false,
        error: 'No registration found with this email',
      });

      renderCheckTicket();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/no application found/i)).toBeInTheDocument();
      });
    });
  });

  describe('QR Code Generation', () => {
    it('should generate QR code for approved attendees', async () => {
      const mockAttendee = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        status: 'approved',
      };

      vi.mocked(registrationService.findAttendeeByEmail).mockResolvedValue({
        success: true,
        data: mockAttendee,
      });

      vi.mocked(QRCode.toDataURL).mockResolvedValue('data:image/png;base64,qrcode');

      renderCheckTicket();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(QRCode.toDataURL).toHaveBeenCalled();
      });
    });

    it('should use attendee ID for QR code when available', async () => {
      const mockAttendee = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        status: 'approved',
      };

      vi.mocked(registrationService.findAttendeeByEmail).mockResolvedValue({
        success: true,
        data: mockAttendee,
      });

      vi.mocked(QRCode.toDataURL).mockResolvedValue('data:image/png;base64,qrcode');

      renderCheckTicket();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(QRCode.toDataURL).toHaveBeenCalledWith('123', expect.any(Object));
      });
    });
  });

  describe('PDF Download', () => {
    it('should have download PDF button for approved tickets', async () => {
      const mockAttendee = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        status: 'approved',
      };

      vi.mocked(registrationService.findAttendeeByEmail).mockResolvedValue({
        success: true,
        data: mockAttendee,
      });

      vi.mocked(QRCode.toDataURL).mockResolvedValue('data:image/png;base64,qrcode');

      renderCheckTicket();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/download ticket/i)).toBeInTheDocument();
      });
    });
  });
});
