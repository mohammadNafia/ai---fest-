/**
 * Settings Service Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { settingsService } from '../settingsService';

// Mock Supabase
vi.mock('@/lib/SupabaseClient', () => {
  const mockData: any = {
    site_settings: [
      { key: 'registrations_open', value: 'true' },
      { key: 'show_speakers', value: 'true' },
    ],
  };

  return {
    supabase: {
      from: (table: string) => ({
        select: (columns?: string) => ({
          data: mockData[table] || [],
          error: null,
          eq: (column: string, value: any) => ({
            data: mockData[table].filter((item: any) => item[column] === value),
            error: null,
            single: () => {
              const found = mockData[table].find((item: any) => item[column] === value);
              if (!found) {
                return {
                  data: null,
                  error: { code: 'PGRST116', message: 'No rows found' },
                };
              }
              return { data: found, error: null };
            },
          }),
          order: () => ({
            data: mockData[table] || [],
            error: null,
          }),
        }),
        upsert: (values: any) => {
          const existingIndex = mockData[table].findIndex((item: any) => item.key === values.key);
          const newItem = {
            ...values,
            updated_at: new Date().toISOString(),
          };
          if (existingIndex !== -1) {
            mockData[table][existingIndex] = newItem;
          } else {
            mockData[table].push(newItem);
          }
          return {
            data: [newItem],
            error: null,
            select: () => ({
              data: [newItem],
              error: null,
              single: () => ({ data: newItem, error: null }),
            }),
          };
        },
      }),
    },
    isSupabaseConfigured: () => true,
  };
});

describe('SettingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSetting', () => {
    it('should get a setting value', async () => {
      const result = await settingsService.getSetting('registrations_open');
      expect(result.success).toBe(true);
    });

    it('should return undefined for non-existent setting', async () => {
      const result = await settingsService.getSetting('nonexistent');
      expect(result.success).toBe(true);
      expect(result.value).toBeUndefined();
    });
  });

  describe('isRegistrationOpen', () => {
    it('should return true when registrations are open', async () => {
      const result = await settingsService.isRegistrationOpen();
      expect(result).toBe(true);
    });

    it('should return false when registrations are closed', async () => {
      // Mock closed state
      vi.spyOn(settingsService, 'getSetting').mockResolvedValue({
        success: true,
        value: 'false',
      });
      const result = await settingsService.isRegistrationOpen();
      expect(result).toBe(false);
    });
  });

  describe('isShowSpeakers', () => {
    it('should return true when speakers should be shown', async () => {
      // Mock getSetting to return the correct value
      vi.spyOn(settingsService, 'getSetting').mockResolvedValue({
        success: true,
        value: 'true',
      });
      const result = await settingsService.isShowSpeakers();
      expect(result).toBe(true);
    });

    it('should return false when speakers should be hidden', async () => {
      vi.spyOn(settingsService, 'getSetting').mockResolvedValue({
        success: true,
        value: 'false',
      });
      const result = await settingsService.isShowSpeakers();
      expect(result).toBe(false);
    });
  });

  describe('setRegistrationOpen', () => {
    it('should set registrations_open to true', async () => {
      const result = await settingsService.setRegistrationOpen(true);
      expect(result.success).toBe(true);
    });

    it('should set registrations_open to false', async () => {
      const result = await settingsService.setRegistrationOpen(false);
      expect(result.success).toBe(true);
    });
  });

  describe('setShowSpeakers', () => {
    it('should set show_speakers to true', async () => {
      const result = await settingsService.setShowSpeakers(true);
      expect(result.success).toBe(true);
    });

    it('should set show_speakers to false', async () => {
      const result = await settingsService.setShowSpeakers(false);
      expect(result.success).toBe(true);
    });
  });
});
