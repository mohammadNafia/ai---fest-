import { useState, useEffect, useCallback } from 'react';
// Site content now uses static data or can be extended to use backend API

export interface SiteSettings {
  // Hero Section
  hero_title_prefix?: string;
  hero_title_highlight?: string;
  hero_subtitle?: string;
  hero_date?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;
  hero_countdown_label?: string;
  
  // Stats Section
  stats_attendees_count?: string;
  stats_speakers_count?: string;
  stats_exhibitors_count?: string;
  stats_startups_count?: string;
  stats_countries_count?: string;
  
  // Speakers Section
  speakers_title?: string;
  speakers_subtitle?: string;
  
  // CTA Section
  cta_title?: string;
  cta_subtitle?: string;
  cta_button_text?: string;
  
  // Event Details
  event_date?: string;
  event_location?: string;
  event_venue?: string;
  
  // Contact
  contact_email?: string;
  contact_phone?: string;
  
  // Social Links
  social_twitter?: string;
  social_linkedin?: string;
  social_instagram?: string;
  social_youtube?: string;
  
  // Misc
  max_attendees?: string;
  registration_open?: string;
  
  // Arabic translations
  hero_title_prefix_ar?: string;
  hero_title_highlight_ar?: string;
  hero_subtitle_ar?: string;
  hero_date_ar?: string;
  speakers_title_ar?: string;
  speakers_subtitle_ar?: string;
  cta_title_ar?: string;
  cta_subtitle_ar?: string;
  
  // Allow dynamic keys
  [key: string]: string | undefined;
}

interface UseSiteContentReturn {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getSetting: (key: string, fallback?: string) => string;
  getLocalizedSetting: (key: string, lang: 'en' | 'ar', fallback?: string) => string;
}

/**
 * useSiteContent - Fetches site settings from Supabase
 * 
 * Returns settings as a key-value object for easy access throughout the app.
 * Includes helper functions for getting localized content.
 */
export const useSiteContent = (): UseSiteContentReturn => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use default/static settings for now
      // Can be extended to fetch from backend API if needed
      const defaultSettings: SiteSettings = {
        site_name: 'Baghdad AI Summit 2026',
        site_description: 'Join us for the premier AI conference in Baghdad',
        // Add more default settings as needed
      };
      
      setSettings(defaultSettings);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /**
   * Get a setting value with optional fallback
   */
  const getSetting = useCallback((key: string, fallback: string = ''): string => {
    return settings[key] ?? fallback;
  }, [settings]);

  /**
   * Get a localized setting (checks for _ar suffix when lang is Arabic)
   */
  const getLocalizedSetting = useCallback((key: string, lang: 'en' | 'ar', fallback: string = ''): string => {
    if (lang === 'ar') {
      const arKey = `${key}_ar`;
      if (settings[arKey]) {
        return settings[arKey]!;
      }
    }
    return settings[key] ?? fallback;
  }, [settings]);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    getSetting,
    getLocalizedSetting,
  };
};

export default useSiteContent;
