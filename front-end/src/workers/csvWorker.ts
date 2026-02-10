/**
 * CSV Worker - Builds CSV files in background
 * Handles large datasets without blocking the main thread
 */

interface WorkerMessage {
  type: 'buildCSV';
  data: {
    items: any[];
    headers: string[];
    lang?: string;
  };
}

self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { type, data } = e.data;

  try {
    switch (type) {
      case 'buildCSV': {
        const csv = buildCSV(data.items, data.headers, data.lang);
        self.postMessage({ success: true, data: csv });
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

function buildCSV(items: any[], headers: string[], lang: string = 'en'): string {
  if (!items || items.length === 0) {
    return '';
  }

  // Build CSV header
  const csvRows: string[] = [];
  csvRows.push(headers.map(escapeCSV).join(','));

  // Build CSV rows
  items.forEach(item => {
    const row = headers.map(header => {
      const value = getNestedValue(item, header);
      return escapeCSV(formatValue(value, lang));
    });
    csvRows.push(row.join(','));
  });

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  return BOM + csvRows.join('\n');
}

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If value contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    if (value === null || value === undefined) {
      return '';
    }
    value = value[key];
  }

  return value || '';
}

function formatValue(value: any, lang: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  // Format dates
  if (value instanceof Date) {
    return value.toLocaleDateString(lang === 'ar' ? 'ar' : 'en');
  }

  // Format arrays
  if (Array.isArray(value)) {
    return value.join('; ');
  }

  // Format objects
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

