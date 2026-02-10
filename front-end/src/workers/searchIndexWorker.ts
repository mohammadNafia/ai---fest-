/**
 * Search Index Worker - Builds search index in background
 * Processes large datasets for Fuse.js indexing
 */

interface IndexItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  url: string;
  [key: string]: any;
}

interface WorkerMessage {
  type: 'index' | 'search';
  data: any;
}

let searchIndex: IndexItem[] = [];

self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { type, data } = e.data;

  try {
    switch (type) {
      case 'index': {
        searchIndex = buildIndex(data);
        self.postMessage({ success: true, message: 'Index built', count: searchIndex.length });
        break;
      }
      case 'search': {
        const results = performSearch(data.query, data.options);
        self.postMessage({ success: true, data: results });
        break;
      }
      default:
        self.postMessage({ success: false, error: 'Unknown message type' });
    }
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

function buildIndex(data: {
  pages?: any[];
  speakers?: any[];
  agenda?: any[];
  partners?: any[];
}) {
  const index: IndexItem[] = [];

  // Index pages
  if (data.pages) {
    data.pages.forEach(page => {
      index.push({
        id: `page-${page.id || page.path}`,
        title: page.title || page.name || '',
        description: page.description || '',
        type: 'page',
        url: page.path || page.url || '#',
        ...page
      });
    });
  }

  // Index speakers
  if (data.speakers) {
    data.speakers.forEach(speaker => {
      index.push({
        id: `speaker-${speaker.id || speaker.name}`,
        title: speaker.name || '',
        description: speaker.bio || speaker.description || '',
        type: 'speaker',
        url: `/speakers#${speaker.id || speaker.name}`,
        ...speaker
      });
    });
  }

  // Index agenda items
  if (data.agenda) {
    data.agenda.forEach(item => {
      index.push({
        id: `agenda-${item.id || item.title}`,
        title: item.title || '',
        description: item.description || '',
        type: 'agenda',
        url: `/agenda#${item.id || item.title}`,
        ...item
      });
    });
  }

  // Index partners
  if (data.partners) {
    data.partners.forEach(partner => {
      index.push({
        id: `partner-${partner.id || partner.name}`,
        title: partner.name || '',
        description: partner.description || '',
        type: 'partner',
        url: `/ecosystem#${partner.id || partner.name}`,
        ...partner
      });
    });
  }

  return index;
}

function performSearch(query: string, options: { threshold?: number; limit?: number } = {}) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const threshold = options.threshold || 0.4;
  const limit = options.limit || 20;
  const queryLower = query.toLowerCase().trim();

  // Simple fuzzy search implementation
  const results = searchIndex
    .map(item => {
      const titleMatch = fuzzyMatch(item.title, queryLower);
      const descMatch = item.description ? fuzzyMatch(item.description, queryLower) : 0;
      const score = Math.max(titleMatch, descMatch * 0.7);

      return {
        ...item,
        score
      };
    })
    .filter(item => item.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => {
      const { score, ...result } = item;
      return result;
    });

  return results;
}

function fuzzyMatch(text: string, query: string): number {
  if (!text || !query) return 0;

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match
  if (textLower === queryLower) return 1.0;

  // Starts with
  if (textLower.startsWith(queryLower)) return 0.9;

  // Contains
  if (textLower.includes(queryLower)) return 0.7;

  // Character matching
  let matches = 0;
  let queryIndex = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      matches++;
      queryIndex++;
    }
  }

  if (queryIndex === queryLower.length) {
    return 0.5 * (matches / queryLower.length);
  }

  return 0;
}

