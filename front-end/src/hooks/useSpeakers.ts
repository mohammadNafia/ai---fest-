import { useState, useEffect } from 'react';
import { SPEAKERS } from '@/data/speakers';
import { cmsService } from '@/services/cmsService';

/**
 * Speaker interface matching the Supabase `speakers` table schema
 * Includes localized fields for Arabic content
 */
export interface Speaker {
  id: string;
  name: string;
  name_ar?: string | null;
  role: string;
  role_ar?: string | null;
  company: string;
  company_ar?: string | null;
  image: string;
  topic?: string | null;
  topic_ar?: string | null;
  bio?: string | null;
  bio_ar?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  website?: string | null;
  is_featured: boolean;
  display_order: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Hook return type
 */
interface UseSpeakersReturn {
  speakers: Speaker[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getLocalizedSpeaker: (speaker: Speaker, lang: 'en' | 'ar') => {
    name: string;
    role: string;
    company: string;
    topic: string | null;
    bio: string | null;
  };
}

/**
 * Custom hook to fetch speakers from Supabase
 * Falls back to static data if Supabase is not configured or fetch fails
 * 
 * @param featuredOnly - If true, only fetch featured speakers
 * @returns Object containing speakers array, loading state, error, refetch function, and localization helper
 */
export const useSpeakers = (featuredOnly: boolean = false): UseSpeakersReturn => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get localized speaker fields based on language
   */
  const getLocalizedSpeaker = (speaker: Speaker, lang: 'en' | 'ar') => ({
    name: (lang === 'ar' && speaker.name_ar) ? speaker.name_ar : speaker.name,
    role: (lang === 'ar' && speaker.role_ar) ? speaker.role_ar : speaker.role,
    company: (lang === 'ar' && speaker.company_ar) ? speaker.company_ar : speaker.company,
    topic: (lang === 'ar' && speaker.topic_ar) ? speaker.topic_ar : speaker.topic ?? null,
    bio: (lang === 'ar' && speaker.bio_ar) ? speaker.bio_ar : speaker.bio ?? null,
  });

  const fetchSpeakers = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from CMS service (backend API) first
      const cmsResult = await cmsService.getSpeakers();
      
      if (cmsResult.success && cmsResult.data && cmsResult.data.length > 0) {
        // Use CMS speakers from backend
        const cmsSpeakers = cmsResult.data.map((s) => ({
          id: s.id || '',
          name: s.name,
          name_ar: s.name_ar || null,
          role: s.role,
          role_ar: s.role_ar || null,
          company: s.company,
          company_ar: s.company_ar || null,
          image: s.image,
          topic: s.topic || null,
          topic_ar: s.topic_ar || null,
          bio: s.bio || null,
          bio_ar: s.bio_ar || null,
          linkedin: s.linkedin || null,
          twitter: s.twitter || null,
          website: s.website || null,
          is_featured: s.is_featured ?? true,
          display_order: s.order_index ?? 0,
          order_index: s.order_index ?? 0,
          created_at: s.created_at,
          updated_at: s.updated_at,
        }));

        // Filter by featured if requested
        const filteredSpeakers = featuredOnly 
          ? cmsSpeakers.filter(s => s.is_featured)
          : cmsSpeakers;

        setSpeakers(filteredSpeakers);
      } else {
        // Fallback to static data if CMS is empty or fails
        console.log('No CMS speakers found, using static data');
        const staticSpeakers = SPEAKERS.map((s, index) => ({
          id: s.id.toString(),
          name: s.name,
          role: s.role,
          company: s.company,
          image: s.image,
          topic: s.topic || null,
          bio: s.bio || null,
          linkedin: s.socialLinks?.linkedin || null,
          twitter: s.socialLinks?.twitter || null,
          website: s.socialLinks?.website || null,
          is_featured: true,
          display_order: index + 1,
        }));

        const filteredSpeakers = featuredOnly 
          ? staticSpeakers.filter(s => s.is_featured)
          : staticSpeakers;

        setSpeakers(filteredSpeakers);
      }
    } catch (err) {
      console.error('Error fetching speakers:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch speakers'));
      // Fallback to static data on error
      const staticSpeakers = SPEAKERS.map((s, index) => ({
        id: s.id.toString(),
        name: s.name,
        role: s.role,
        company: s.company,
        image: s.image,
        topic: s.topic || null,
        bio: s.bio || null,
        linkedin: s.socialLinks?.linkedin || null,
        twitter: s.socialLinks?.twitter || null,
        website: s.socialLinks?.website || null,
        is_featured: true,
        display_order: index + 1,
      }));
      setSpeakers(featuredOnly ? staticSpeakers.filter(s => s.is_featured) : staticSpeakers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, [featuredOnly]);

  return {
    speakers,
    loading,
    error,
    refetch: fetchSpeakers,
    getLocalizedSpeaker,
  };
};

