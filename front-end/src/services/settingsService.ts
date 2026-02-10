/**
 * Settings Service - Simplified for ASP.NET Backend
 * 
 * Note: Settings can be extended to use backend API when needed
 */

export interface SettingsResult {
  success: boolean;
  data?: any;
  error?: string;
}

class SettingsService {
  /**
   * Get a specific setting value
   */
  async getSetting(key: string): Promise<{ success: boolean; value?: string; error?: string }> {
    // Return default values for now
    const defaults: Record<string, string> = {
      registrations_open: 'true',
      show_speakers: 'true',
    };
    
    return { success: true, value: defaults[key] };
  }

  /**
   * Get all settings
   */
  async getAllSettings(): Promise<SettingsResult> {
    // Return default settings
    const defaults = [
      { key: 'registrations_open', value: 'true' },
      { key: 'show_speakers', value: 'true' },
    ];
    
    return { success: true, data: defaults };
  }

  /**
   * Update a setting
   */
  async updateSetting(key: string, value: string): Promise<SettingsResult> {
    // Placeholder for future backend integration
    return { success: true };
  }
}

export const settingsService = new SettingsService();
