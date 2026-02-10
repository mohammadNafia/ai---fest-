/**
 * GeneralRegistrationForm Component Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GeneralRegistrationForm from '../GeneralRegistrationForm';
import { registrationService } from '@/services/registrationService';
import { settingsService } from '@/services/settingsService';

// Mock dependencies
vi.mock('@/services/registrationService');
vi.mock('@/services/settingsService');

// Mock contexts
const mockLanguageContext = {
  lang: 'en',
  t: {
    forms: {
      general_title: 'Registration',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      age: 'Age',
      occupation: 'Occupation',
      institution: 'Institution',
      motivation: 'Motivation',
      submit: 'Submit',
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

const renderForm = (onClose = vi.fn()) => {
  return render(
    <BrowserRouter>
      <GeneralRegistrationForm onClose={onClose} />
    </BrowserRouter>
  );
};

describe('GeneralRegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(settingsService.isRegistrationOpen).mockResolvedValue(true);
    vi.mocked(registrationService.getTotalAttendeeCount).mockResolvedValue({
      success: true,
      count: 100,
    });
  });

  describe('Registration Status Check', () => {
    it('should show form when registrations are open', async () => {
      vi.mocked(settingsService.isRegistrationOpen).mockResolvedValue(true);
      renderForm();

      await waitFor(() => {
        expect(screen.getByText(/registration/i)).toBeInTheDocument();
      });
    });

    it('should show closed message when registrations are closed', async () => {
      vi.mocked(settingsService.isRegistrationOpen).mockResolvedValue(false);
      renderForm();

      await waitFor(() => {
        expect(screen.getByText(/registrations closed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should check capacity before submitting', async () => {
      vi.mocked(registrationService.getTotalAttendeeCount).mockResolvedValue({
        success: true,
        count: 100,
      });

      vi.mocked(registrationService.submitAttendee).mockResolvedValue({
        success: true,
        data: { id: '123' },
      });

      renderForm();

      // Wait for form to load (not in loading state)
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      }, { timeout: 3000 });

      // Wait for form fields to be available (Input component uses labels)
      await waitFor(() => {
        const nameInput = screen.queryByLabelText(new RegExp(mockLanguageContext.t.forms.name, 'i'));
        expect(nameInput).toBeInTheDocument();
      }, { timeout: 5000 });

      // Fill form using label text (Input component uses labels, not placeholders)
      const nameInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.name, 'i'));
      const emailInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.email, 'i'));
      const phoneInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.phone, 'i'));
      const ageInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.age, 'i'));

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      fireEvent.change(ageInput, { target: { value: '25' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(registrationService.submitAttendee).toHaveBeenCalled();
      });
    });

    it('should show error when capacity is reached', async () => {
      vi.mocked(registrationService.getTotalAttendeeCount).mockResolvedValue({
        success: true,
        count: 250,
      });

      vi.mocked(registrationService.submitAttendee).mockResolvedValue({
        success: false,
        error: 'Registration Closed: Capacity Reached.',
      });

      renderForm();

      // Wait for form to load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      }, { timeout: 3000 });

      // Wait for form fields (Input component uses labels)
      await waitFor(() => {
        const nameInput = screen.queryByLabelText(new RegExp(mockLanguageContext.t.forms.name, 'i'));
        expect(nameInput).toBeInTheDocument();
      }, { timeout: 5000 });

      // Fill form using label text
      const nameInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.name, 'i'));
      const emailInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.email, 'i'));
      const phoneInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.phone, 'i'));
      const ageInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.age, 'i'));

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      fireEvent.change(ageInput, { target: { value: '25' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/capacity reached/i)).toBeInTheDocument();
      });
    });

    it('should clear form on successful submission', async () => {
      vi.mocked(registrationService.getTotalAttendeeCount).mockResolvedValue({
        success: true,
        count: 100,
      });

      vi.mocked(registrationService.submitAttendee).mockResolvedValue({
        success: true,
        data: { id: '123' },
      });

      renderForm();

      // Wait for form to load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      }, { timeout: 3000 });

      // Wait for form fields (Input component uses labels)
      await waitFor(() => {
        const nameInput = screen.queryByLabelText(new RegExp(mockLanguageContext.t.forms.name, 'i'));
        expect(nameInput).toBeInTheDocument();
      }, { timeout: 5000 });

      const nameInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.name, 'i'));
      const emailInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.email, 'i'));
      const phoneInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.phone, 'i'));
      const ageInput = screen.getByLabelText(new RegExp(mockLanguageContext.t.forms.age, 'i'));

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      fireEvent.change(ageInput, { target: { value: '25' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/application received/i)).toBeInTheDocument();
      });
    });
  });
});
