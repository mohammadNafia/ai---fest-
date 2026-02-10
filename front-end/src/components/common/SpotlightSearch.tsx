/**
 * SpotlightSearch - Advanced global search with Fuse.js fuzzy matching
 * Features: Fuzzy search, recent searches, keyboard navigation, highlights
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Info, Calendar, Users, Mic, Store, ArrowRight, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { searchService } from '@/services/searchService';
import type { SearchResult, RecentSearch } from '@/services/types';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchCategory {
  name: string;
  results: SearchResult[];
  count: number;
}

const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { lang, t } = useLanguage();
  const { adminLoggedIn } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize search service on mount
  useEffect(() => {
    searchService.indexData().catch(console.error);
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    const recent = await searchService.getRecentSearches();
    setRecentSearches(recent);
  };

  // Perform search with debounce
  useEffect(() => {
    if (!isOpen) return;

    const performSearch = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchService.search(query, {
          limit: 20,
          threshold: 0.4,
          includeScore: true,
        });
        setSearchResults(results);
        
        // Save to recent searches
        if (results.length > 0) {
          await searchService.saveRecentSearch(query, results.length);
          await loadRecentSearches();
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query, isOpen]);

  // Group results by category
  const groupedResults = useMemo<SearchCategory[]>(() => {
    if (searchResults.length === 0) return [];

    const groups: Record<string, SearchResult[]> = {
      pages: [],
      speakers: [],
      agenda: [],
      partners: [],
    };

    searchResults.forEach(result => {
      if (groups[result.type]) {
        groups[result.type].push(result);
      }
    });

    const categories: SearchCategory[] = [];
    
    if (groups.pages.length > 0) {
      categories.push({
        name: t.spotlight?.pages || 'Pages',
        results: groups.pages.slice(0, 5),
        count: groups.pages.length,
      });
    }
    if (groups.speakers.length > 0) {
      categories.push({
        name: t.spotlight?.speakers || 'Speakers',
        results: groups.speakers.slice(0, 5),
        count: groups.speakers.length,
      });
    }
    if (groups.agenda.length > 0) {
      categories.push({
        name: t.spotlight?.agenda || 'Agenda',
        results: groups.agenda.slice(0, 5),
        count: groups.agenda.length,
      });
    }
    if (groups.partners.length > 0) {
      categories.push({
        name: t.spotlight?.partners || 'Partners',
        results: groups.partners.slice(0, 5),
        count: groups.partners.length,
      });
    }

    return categories;
  }, [searchResults, t]);

  // Flatten results for keyboard navigation
  const allResults = useMemo(() => {
    const results: (SearchResult | { type: 'section'; label: string })[] = [];
    groupedResults.forEach(category => {
      results.push({ type: 'section', label: category.name });
      results.push(...category.results);
    });
    return results;
  }, [groupedResults]);

  const selectableItems = allResults.filter(r => r.type !== 'section') as SearchResult[];

  const handleSelect = useCallback((item: SearchResult) => {
    navigate(item.url);
    onClose();
    
    // Scroll to section if needed
    if (item.url.includes('#')) {
      setTimeout(() => {
        const hash = item.url.split('#')[1];
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [navigate, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const nextIndex = prev + 1;
          return nextIndex >= selectableItems.length ? prev : nextIndex;
        });
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const selected = selectableItems[selectedIndex];
        if (selected) {
          handleSelect(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, selectableItems, handleSelect, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && isOpen && selectableItems.length > 0) {
      const buttons = resultsRef.current.querySelectorAll('button[data-result-index]');
      const button = buttons[selectedIndex] as HTMLElement;
      if (button) {
        button.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, selectableItems.length, isOpen]);

  // Highlight matched text
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className={`bg-yellow-200 dark:bg-yellow-900/50 rounded px-1`}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'page':
        return Home;
      case 'speaker':
        return Mic;
      case 'agenda':
        return Calendar;
      case 'partner':
        return Store;
      default:
        return Search;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.spotlight?.title || 'Search'}
    >
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
          theme === 'light' ? 'bg-black/40' : 'bg-black/60'
        }`}
        onClick={onClose}
      />

      {/* Search Panel */}
      <div
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl transition-all duration-300 ${
          theme === 'light'
            ? 'bg-white/90 border border-gray-200 shadow-xl'
            : 'bg-slate-950/90 border border-white/10'
        }`}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 md:p-6 border-b border-white/10">
          <div className="relative flex items-center gap-3">
            <Search
              size={20}
              className={`flex-shrink-0 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              } ${lang === 'ar' ? 'order-2' : ''}`}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={t.spotlight?.placeholder || 'Search pages, speakers, agenda...'}
              className={`flex-1 bg-transparent outline-none text-lg ${
                theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
              }`}
              aria-label="Search input"
            />
            {isSearching && (
              <div className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                Searching...
              </div>
            )}
            <div className={`flex items-center gap-1 text-xs ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            } ${lang === 'ar' ? 'order-1' : ''}`}>
              <kbd className={`px-2 py-1 rounded ${
                theme === 'light' ? 'bg-gray-100 border border-gray-300' : 'bg-white/10 border border-white/20'
              }`}>
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
              </kbd>
              <span>+</span>
              <kbd className={`px-2 py-1 rounded ${
                theme === 'light' ? 'bg-gray-100 border border-gray-300' : 'bg-white/10 border border-white/20'
              }`}>K</kbd>
            </div>
          </div>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          className="max-h-[60vh] overflow-y-auto p-2"
        >
          {!query.trim() && recentSearches.length > 0 && (
            <div className="mb-4">
              <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Recent Searches
              </div>
              {recentSearches.slice(0, 3).map((recent, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(recent.query)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-left ${
                    theme === 'light'
                      ? 'hover:bg-gray-50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Clock size={16} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    {recent.query}
                  </span>
                </button>
              ))}
            </div>
          )}

          {query.trim() && searchResults.length === 0 && !isSearching && (
            <div className={`p-8 text-center ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {t.spotlight?.noResults || 'No results found'}
            </div>
          )}

          {groupedResults.length > 0 && (
            <div className="space-y-1">
              {allResults.map((item, index) => {
                if (item.type === 'section') {
                  return (
                    <div
                      key={`section-${index}`}
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {item.label}
                    </div>
                  );
                }

                const result = item as SearchResult;
                const itemIndex = selectableItems.findIndex(i => i.id === result.id);
                const isSelected = itemIndex === selectedIndex;
                const Icon = getIcon(result.type);

                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    data-result-index={itemIndex}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      isSelected
                        ? theme === 'light'
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-white/10 border border-blue-500/30'
                        : theme === 'light'
                        ? 'hover:bg-gray-50 border border-transparent'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                    aria-label={`Select ${result.title}`}
                  >
                    <Icon
                      size={18}
                      className={`flex-shrink-0 ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {highlightText(result.title, query)}
                      </div>
                      {result.description && (
                        <div className={`text-sm truncate ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {result.description}
                        </div>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      className={`flex-shrink-0 ${
                        theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                      } ${lang === 'ar' ? 'rotate-180' : ''}`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotlightSearch;

