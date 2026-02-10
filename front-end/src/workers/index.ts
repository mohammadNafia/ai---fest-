/**
 * Web Workers - Export utilities for creating and managing workers
 */

// Analytics Worker
export const createAnalyticsWorker = (): Worker => {
  const workerCode = `
    ${analyticsWorkerCode}
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// Search Index Worker
export const createSearchIndexWorker = (): Worker => {
  const workerCode = `
    ${searchIndexWorkerCode}
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// CSV Worker
export const createCSVWorker = (): Worker => {
  const workerCode = `
    ${csvWorkerCode}
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// For Vite, we need to use import.meta.url to load workers
// This is a better approach for production
export const loadAnalyticsWorker = (): Worker => {
  return new Worker(new URL('./analyticsWorker.ts', import.meta.url), { type: 'module' });
};

export const loadSearchIndexWorker = (): Worker => {
  return new Worker(new URL('./searchIndexWorker.ts', import.meta.url), { type: 'module' });
};

export const loadCSVWorker = (): Worker => {
  return new Worker(new URL('./csvWorker.ts', import.meta.url), { type: 'module' });
};

// Placeholder for worker code strings (not used in production)
const analyticsWorkerCode = '';
const searchIndexWorkerCode = '';
const csvWorkerCode = '';

