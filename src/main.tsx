import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Force production mode if we are in a build
if (import.meta.env.PROD) {
  (window as any).process = (window as any).process || {};
  (window as any).process.env = (window as any).process.env || {};
  (window as any).process.env.NODE_ENV = 'production';
}

import '@/index.css';
import { initSentry } from '@/utils/sentry';
import AppWithProviders from '@/router/AppRouter';

// Initialize Sentry error tracking
initSentry({
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD, // Only enable in production
  tracesSampleRate: 0.1, // 10% of transactions
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
);

