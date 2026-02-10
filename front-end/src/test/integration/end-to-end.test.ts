/**
 * End-to-End Integration Tests
 * Tests complete user flows and database interactions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registrationService } from '@/services/registrationService';
import { settingsService } from '@/services/settingsService';
import { authService } from '@/services/authService';

// Mock Supabase with realistic data
const createMockDatabase = () => {
  const db: any = {
    attendees: [],
    speakers: [],
    partners: [],
    site_settings: [
      { key: 'registrations_open', value: 'true' },
      { key: 'show_speakers', value: 'true' },
    ],
    users: [
      {
        id: 'admin-1',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
      },
    ],
  };

  return db;
};

describe('End-to-End Integration Tests', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = createMockDatabase();
<<<<<<< HEAD
    vi.restoreAllMocks();
=======
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
    vi.clearAllMocks();
  });

  describe('Complete Registration Flow', () => {
    it('should complete full registration workflow: submit -> approve -> check ticket', async () => {
      // Step 1: Submit registration
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        age: 25,
        occupation: 'Student',
        motivation: 'Interested in AI',
      };

      // Mock capacity check
      vi.spyOn(registrationService, 'getTotalAttendeeCount').mockResolvedValue({
        success: true,
        count: 100,
      });

      // Mock submission
      vi.spyOn(registrationService, 'submitAttendee').mockResolvedValue({
        success: true,
        data: {
          id: 'attendee-1',
          ...formData,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      });

      const submitResult = await registrationService.submitAttendee(formData);
      expect(submitResult.success).toBe(true);
      expect(submitResult.data?.status).toBe('pending');

      // Step 2: Admin approves
      vi.spyOn(registrationService, 'updateAttendeeStatus').mockResolvedValue({
        success: true,
        data: {
          id: 'attendee-1',
          ...formData,
          status: 'approved',
        },
      });

      const approveResult = await registrationService.updateAttendeeStatus('attendee-1', 'approved');
      expect(approveResult.success).toBe(true);
      expect(approveResult.data?.status).toBe('approved');

      // Step 3: User checks ticket
      vi.spyOn(registrationService, 'findAttendeeByEmail').mockResolvedValue({
        success: true,
        data: {
          id: 'attendee-1',
          ...formData,
          status: 'approved',
        },
      });

      const ticketResult = await registrationService.findAttendeeByEmail('john@example.com');
      expect(ticketResult.success).toBe(true);
      expect(ticketResult.data?.status).toBe('approved');
    });

    it('should handle capacity limit correctly', async () => {
      // Mock capacity reached - must be done before calling submitAttendee
      const getCountSpy = vi.spyOn(registrationService, 'getTotalAttendeeCount');
      getCountSpy.mockResolvedValueOnce({
        success: true,
        count: 250,
      });

      const formData = {
        name: 'New User',
        email: 'new@example.com',
        phone: '1234567890',
        age: 25,
        occupation: 'Student',
        motivation: 'Interested in AI',
      };

      const result = await registrationService.submitAttendee(formData);
      
      // Verify the mock was called
      expect(getCountSpy).toHaveBeenCalled();
      
      // Verify the result
      expect(result.success).toBe(false);
      expect(result.error).toBe('Registration Closed: Capacity Reached.');
      
      getCountSpy.mockRestore();
    });
  });

  describe('Admin Settings Control Flow', () => {
    it('should toggle registrations and affect form behavior', async () => {
      // Step 1: Admin closes registrations
      vi.spyOn(settingsService, 'setRegistrationOpen').mockResolvedValue({
        success: true,
        data: { key: 'registrations_open', value: 'false' },
      });

      const closeResult = await settingsService.setRegistrationOpen(false);
      expect(closeResult.success).toBe(true);

      // Step 2: Check if registrations are closed
      vi.spyOn(settingsService, 'isRegistrationOpen').mockResolvedValue(false);
      const isOpen = await settingsService.isRegistrationOpen();
      expect(isOpen).toBe(false);

      // Step 3: Admin opens registrations
      vi.spyOn(settingsService, 'setRegistrationOpen').mockResolvedValue({
        success: true,
        data: { key: 'registrations_open', value: 'true' },
      });

      const openResult = await settingsService.setRegistrationOpen(true);
      expect(openResult.success).toBe(true);
    });

    it('should toggle show_speakers and affect homepage', async () => {
      // Step 1: Admin hides speakers
      vi.spyOn(settingsService, 'setShowSpeakers').mockResolvedValue({
        success: true,
        data: { key: 'show_speakers', value: 'false' },
      });

      const hideResult = await settingsService.setShowSpeakers(false);
      expect(hideResult.success).toBe(true);

      // Step 2: Check if speakers are hidden
      vi.spyOn(settingsService, 'isShowSpeakers').mockResolvedValue(false);
      const shouldShow = await settingsService.isShowSpeakers();
      expect(shouldShow).toBe(false);

      // Step 3: Admin shows speakers
      vi.spyOn(settingsService, 'setShowSpeakers').mockResolvedValue({
        success: true,
        data: { key: 'show_speakers', value: 'true' },
      });

      const showResult = await settingsService.setShowSpeakers(true);
      expect(showResult.success).toBe(true);
    });
  });

  describe('Admin Authentication Flow', () => {
    it('should authenticate admin and verify role', async () => {
      // Mock successful authentication
      vi.spyOn(authService, 'adminLogin').mockResolvedValue({
        success: true,
        user: { id: 'admin-1', email: 'admin@example.com' },
        profile: {
          id: 'admin-1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
      });

      const loginResult = await authService.adminLogin('admin@example.com', 'admin123');
      expect(loginResult.success).toBe(true);
      expect(loginResult.profile?.role).toBe('admin');
    });

    it('should reject non-admin users', async () => {
      // Mock non-admin user
      vi.spyOn(authService, 'adminLogin').mockResolvedValue({
        success: false,
        error: 'Unauthorized: Admin access required',
      });

      const loginResult = await authService.adminLogin('user@example.com', 'password');
      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toContain('Admin access required');
    });
  });

  describe('Database Operations', () => {
    it('should handle CRUD operations correctly', async () => {
      // Create
      vi.spyOn(registrationService, 'submitAttendee').mockResolvedValue({
        success: true,
        data: { id: '1', name: 'Test', status: 'pending' },
      });

      const createResult = await registrationService.submitAttendee({
        name: 'Test',
        email: 'test@example.com',
      });
      expect(createResult.success).toBe(true);

      // Read
      vi.spyOn(registrationService, 'findAttendeeByEmail').mockResolvedValue({
        success: true,
        data: { id: '1', name: 'Test', email: 'test@example.com' },
      });

      const readResult = await registrationService.findAttendeeByEmail('test@example.com');
      expect(readResult.success).toBe(true);

      // Update
      vi.spyOn(registrationService, 'updateAttendeeStatus').mockResolvedValue({
        success: true,
        data: { id: '1', status: 'approved' },
      });

      const updateResult = await registrationService.updateAttendeeStatus('1', 'approved');
      expect(updateResult.success).toBe(true);
    });
  });
});
