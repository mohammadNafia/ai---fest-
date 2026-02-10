/**
 * Search Service - Advanced search with Fuse.js fuzzy matching
 * Handles indexing, searching, and recent searches
 */

import Fuse from 'fuse.js';
import type { SearchResult, RecentSearch, SearchOptions } from '@/services/types';
import { SPEAKERS } from '@/data/speakers';
import { AGENDA_ITEMS } from '@/data/agenda';
import { PARTNERS } from '@/data/partners';
import { formsRepository } from '@/repositories/formsRepository';

interface SearchableItem {
  id: string;
  type: 'page' | 'speaker' | 'agenda' | 'partner';
  title: string;
  description?: string;
  url: string;
  searchableText: string;
}

class SearchService {
  private fuse: Fuse<SearchableItem> | null = null;
  private isIndexed = false;
  private readonly RECENT_SEARCHES_KEY = 'recentSearches';
  private readonly MAX_RECENT_SEARCHES = 10;

  /**
   * Index all searchable data
   */
  async indexData(): Promise<void> {
    try {
      const searchableItems: SearchableItem[] = [];

      // Index pages
      const pages = [
        { id: 'home', title: 'Home', url: '/', description: 'Baghdad AI Summit 2026 homepage' },
        { id: 'about', title: 'About', url: '/about', description: 'About the summit' },
        { id: 'agenda', title: 'Agenda', url: '/agenda', description: 'Event schedule and agenda' },
        { id: 'ecosystem', title: 'Ecosystem', url: '/ecosystem', description: 'Partnership opportunities' },
        { id: 'signin', title: 'Sign In', url: '/signin', description: 'Sign in to your account' },
        { id: 'register', title: 'Register', url: '/register', description: 'Register for the summit' },
      ];

      pages.forEach(page => {
        searchableItems.push({
          id: page.id,
          type: 'page',
          title: page.title,
          description: page.description,
          url: page.url,
          searchableText: `${page.title} ${page.description}`,
        });
      });

      // Index speakers
      SPEAKERS.forEach(speaker => {
        searchableItems.push({
          id: speaker.id.toString(),
          type: 'speaker',
          title: speaker.name,
          description: `${speaker.role} at ${speaker.company}${speaker.topic ? ` - ${speaker.topic}` : ''}`,
          url: `/#speakers`,
          searchableText: `${speaker.name} ${speaker.role} ${speaker.company} ${speaker.topic || ''}`,
        });
      });

      // Index agenda items
      AGENDA_ITEMS.forEach(item => {
        searchableItems.push({
          id: item.id?.toString() || item.time,
          type: 'agenda',
          title: item.title,
          description: item.desc,
          url: '/agenda',
          searchableText: `${item.title} ${item.desc} ${item.type} ${item.time}`,
        });
      });

      // Index partners
      PARTNERS.forEach(partner => {
        searchableItems.push({
          id: partner.id?.toString() || partner.name,
          type: 'partner',
          title: partner.name,
          description: partner.category,
          url: '/ecosystem',
          searchableText: `${partner.name} ${partner.category}`,
        });
      });

      // Index submitted data
      const { attendees, speakers, partners } = await formsRepository.getAllSubmissions();

      attendees.forEach(attendee => {
        searchableItems.push({
          id: `attendee-${attendee.id}`,
          type: 'page',
          title: attendee.name,
          description: `Attendee - ${attendee.occupation}`,
          url: '/admin/dashboard?tab=attendees',
          searchableText: `${attendee.name} ${attendee.occupation} ${attendee.institution}`,
        });
      });

      speakers.forEach(speaker => {
        searchableItems.push({
          id: `speaker-sub-${speaker.id}`,
          type: 'page',
          title: speaker.name,
          description: `Speaker Application - ${speaker.topics}`,
          url: '/admin/dashboard?tab=speakers',
          searchableText: `${speaker.name} ${speaker.topics} ${speaker.skills}`,
        });
      });

      partners.forEach(partner => {
        searchableItems.push({
          id: `partner-sub-${partner.id}`,
          type: 'partner',
          title: partner.organization,
          description: partner.category,
          url: '/admin/dashboard?tab=partners',
          searchableText: `${partner.organization} ${partner.category}`,
        });
      });

      // Configure Fuse.js
      this.fuse = new Fuse(searchableItems, {
        keys: ['title', 'description', 'searchableText'],
        threshold: 0.4, // 0.0 = exact match, 1.0 = match anything
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: true,
      });

      this.isIndexed = true;
    } catch (error) {
      console.error('Error indexing search data:', error);
      throw error;
    }
  }

  /**
   * Search with fuzzy matching
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    if (!this.isIndexed || !this.fuse) {
      await this.indexData();
    }

    if (!query.trim()) {
      return [];
    }

    const results = this.fuse!.search(query, {
      limit: options?.limit || 20,
      threshold: options?.threshold || 0.4,
    });

    return results.map(result => {
      const item = result.item;
      const score = options?.includeScore ? result.score : undefined;

      // Generate highlights
      const highlights: string[] = [];
      if (result.matches) {
        result.matches.forEach(match => {
          if (match.value) {
            highlights.push(match.value);
          }
        });
      }

      return {
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        url: item.url,
        score,
        highlights: highlights.length > 0 ? highlights : undefined,
      };
    });
  }

  /**
   * Get recent searches
   */
  async getRecentSearches(): Promise<RecentSearch[]> {
    try {
      const data = localStorage.getItem(this.RECENT_SEARCHES_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading recent searches:', error);
      return [];
    }
  }

  /**
   * Save recent search
   */
  async saveRecentSearch(query: string, resultsCount: number): Promise<void> {
    try {
      const recent = await this.getRecentSearches();
      const newSearch: RecentSearch = {
        query,
        timestamp: new Date().toISOString(),
        resultsCount,
      };

      // Remove duplicates and add to front
      const filtered = recent.filter(s => s.query !== query);
      const updated = [newSearch, ...filtered].slice(0, this.MAX_RECENT_SEARCHES);

      localStorage.setItem(this.RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }
}

export const searchService = new SearchService();

