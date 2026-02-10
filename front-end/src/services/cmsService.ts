/**
 * CMS Service - Connected to ASP.NET Backend
 */

import { apiClient } from '@/lib/apiClient';

export interface SiteSetting {
  id?: string;
  key: string;
  value: string;
  description?: string;
  category?: string;
}

export interface CMSSpeaker {
  id?: string;
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
  linkedin?: string;
  twitter?: string;
  website?: string;
  is_featured?: boolean;
  display_order?: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

class CMSService {
  /**
   * Get all site settings
   */
  async getSettings(): Promise<{ success: boolean; data?: SiteSetting[]; error?: string }> {
    return { success: true, data: [] };
  }

  /**
   * Get all site settings (alias for SiteContentManager compatibility)
   */
  async getAllSettings(): Promise<{ success: boolean; data?: SiteSetting[]; error?: string }> {
    return this.getSettings();
  }

  /**
   * Update a setting
   */
  async updateSetting(key: string, value: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  /**
   * Get all speakers from CMS (for homepage display)
   */
  async getSpeakers(): Promise<{ success: boolean; data?: CMSSpeaker[]; error?: string }> {
    try {
      const response = await apiClient.get('/CMS/speakers');
      if (response.success && response.data) {
        // Map backend response to frontend format
        const speakers = Array.isArray(response.data) 
          ? response.data.map((s: any) => ({
              id: s.id || s.Id,
              name: s.name || s.Name,
              name_ar: s.nameAr || s.NameAr,
              role: s.role || s.Role,
              role_ar: s.roleAr || s.RoleAr,
              company: s.company || s.Company,
              company_ar: s.companyAr || s.CompanyAr,
              image: s.image || s.Image,
              topic: s.topic || s.Topic,
              topic_ar: s.topicAr || s.TopicAr,
              bio: s.bio || s.Bio,
              bio_ar: s.bioAr || s.BioAr,
              linkedin: s.linkedIn || s.LinkedIn,
              twitter: s.twitter || s.Twitter,
              website: s.website || s.Website,
              is_featured: s.isFeatured !== undefined ? s.isFeatured : s.IsFeatured,
              order_index: s.orderIndex !== undefined ? s.orderIndex : s.OrderIndex,
              is_active: s.isActive !== undefined ? s.isActive : s.IsActive,
              created_at: s.createdAt || s.CreatedAt,
              updated_at: s.updatedAt || s.UpdatedAt,
            }))
          : [];
        return { success: true, data: speakers };
      }
      return { success: false, error: response.error || 'Failed to fetch speakers' };
    } catch (error: any) {
      console.error('Error fetching CMS speakers:', error);
      return { success: false, error: error.message || 'Failed to fetch speakers' };
    }
  }

  /**
   * Get all speakers (alias for SpeakerManager compatibility)
   */
  async getAllSpeakers(): Promise<{ success: boolean; data?: CMSSpeaker[]; error?: string }> {
    return this.getSpeakers();
  }

  /**
   * Create a new speaker
   */
  async createSpeaker(speaker: Omit<CMSSpeaker, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: CMSSpeaker; error?: string }> {
    try {
      const userId = localStorage.getItem('userId');
      const headers = userId ? { 'X-Admin-User-Id': userId } : {};
      
      const requestBody = {
        name: speaker.name,
        nameAr: speaker.name_ar,
        role: speaker.role,
        roleAr: speaker.role_ar,
        company: speaker.company,
        companyAr: speaker.company_ar,
        image: speaker.image,
        topic: speaker.topic,
        topicAr: speaker.topic_ar,
        bio: speaker.bio,
        bioAr: speaker.bio_ar,
        linkedIn: speaker.linkedin,
        twitter: speaker.twitter,
        website: speaker.website,
        isFeatured: speaker.is_featured ?? true,
        orderIndex: speaker.order_index ?? 0,
        isActive: speaker.is_active ?? true,
      };

      const response = await apiClient.post('/CMS/speakers', requestBody, { headers });
      if (response.success && response.data) {
        const data = response.data;
        return {
          success: true,
          data: {
            id: data.id || data.Id,
            name: data.name || data.Name,
            name_ar: data.nameAr || data.NameAr,
            role: data.role || data.Role,
            role_ar: data.roleAr || data.RoleAr,
            company: data.company || data.Company,
            company_ar: data.companyAr || data.CompanyAr,
            image: data.image || data.Image,
            topic: data.topic || data.Topic,
            topic_ar: data.topicAr || data.TopicAr,
            bio: data.bio || data.Bio,
            bio_ar: data.bioAr || data.BioAr,
            linkedin: data.linkedIn || data.LinkedIn,
            twitter: data.twitter || data.Twitter,
            website: data.website || data.Website,
            is_featured: data.isFeatured !== undefined ? data.isFeatured : data.IsFeatured,
            order_index: data.orderIndex !== undefined ? data.orderIndex : data.OrderIndex,
            is_active: data.isActive !== undefined ? data.isActive : data.IsActive,
          },
        };
      }
      return { success: false, error: response.error || 'Failed to create speaker' };
    } catch (error: any) {
      console.error('Error creating CMS speaker:', error);
      return { success: false, error: error.message || 'Failed to create speaker' };
    }
  }

  /**
   * Update a speaker
   */
  async updateSpeaker(id: string, speaker: Partial<CMSSpeaker>): Promise<{ success: boolean; data?: CMSSpeaker; error?: string }> {
    try {
      const userId = localStorage.getItem('userId');
      const headers = userId ? { 'X-Admin-User-Id': userId } : {};
      
      const requestBody: any = {};
      if (speaker.name !== undefined) requestBody.name = speaker.name;
      if (speaker.name_ar !== undefined) requestBody.nameAr = speaker.name_ar;
      if (speaker.role !== undefined) requestBody.role = speaker.role;
      if (speaker.role_ar !== undefined) requestBody.roleAr = speaker.role_ar;
      if (speaker.company !== undefined) requestBody.company = speaker.company;
      if (speaker.company_ar !== undefined) requestBody.companyAr = speaker.company_ar;
      if (speaker.image !== undefined) requestBody.image = speaker.image;
      if (speaker.topic !== undefined) requestBody.topic = speaker.topic;
      if (speaker.topic_ar !== undefined) requestBody.topicAr = speaker.topic_ar;
      if (speaker.bio !== undefined) requestBody.bio = speaker.bio;
      if (speaker.bio_ar !== undefined) requestBody.bioAr = speaker.bio_ar;
      if (speaker.linkedin !== undefined) requestBody.linkedIn = speaker.linkedin;
      if (speaker.twitter !== undefined) requestBody.twitter = speaker.twitter;
      if (speaker.website !== undefined) requestBody.website = speaker.website;
      if (speaker.is_featured !== undefined) requestBody.isFeatured = speaker.is_featured;
      if (speaker.order_index !== undefined) requestBody.orderIndex = speaker.order_index;
      if (speaker.is_active !== undefined) requestBody.isActive = speaker.is_active;

      const response = await apiClient.put(`/CMS/speakers/${id}`, requestBody, { headers });
      if (response.success && response.data) {
        const data = response.data;
        return {
          success: true,
          data: {
            id: data.id || data.Id,
            name: data.name || data.Name,
            name_ar: data.nameAr || data.NameAr,
            role: data.role || data.Role,
            role_ar: data.roleAr || data.RoleAr,
            company: data.company || data.Company,
            company_ar: data.companyAr || data.CompanyAr,
            image: data.image || data.Image,
            topic: data.topic || data.Topic,
            topic_ar: data.topicAr || data.TopicAr,
            bio: data.bio || data.Bio,
            bio_ar: data.bioAr || data.BioAr,
            linkedin: data.linkedIn || data.LinkedIn,
            twitter: data.twitter || data.Twitter,
            website: data.website || data.Website,
            is_featured: data.isFeatured !== undefined ? data.isFeatured : data.IsFeatured,
            order_index: data.orderIndex !== undefined ? data.orderIndex : data.OrderIndex,
            is_active: data.isActive !== undefined ? data.isActive : data.IsActive,
          },
        };
      }
      return { success: false, error: response.error || 'Failed to update speaker' };
    } catch (error: any) {
      console.error('Error updating CMS speaker:', error);
      return { success: false, error: error.message || 'Failed to update speaker' };
    }
  }

  /**
   * Delete a speaker
   */
  async deleteSpeaker(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const userId = localStorage.getItem('userId');
      const headers = userId ? { 'X-Admin-User-Id': userId } : {};
      
      const response = await apiClient.delete(`/CMS/speakers/${id}`, { headers });
      return response;
    } catch (error: any) {
      console.error('Error deleting CMS speaker:', error);
      return { success: false, error: error.message || 'Failed to delete speaker' };
    }
  }

  /**
   * Create or update a speaker (for backward compatibility)
   */
  async upsertSpeaker(speaker: CMSSpeaker): Promise<{ success: boolean; data?: CMSSpeaker; error?: string }> {
    if (speaker.id) {
      return this.updateSpeaker(speaker.id, speaker);
    } else {
      return this.createSpeaker(speaker);
    }
  }
}

export const cmsService = new CMSService();
