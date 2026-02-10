/**
 * Sentry Error Tracking Configuration
 * 
 * This module initializes Sentry for error tracking and monitoring.
 * Sentry helps track errors, performance issues, and user sessions.
 * 
 * @module sentry
 */

import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry with configuration
 * 
 * @param {Object} options - Sentry initialization options
 * @param {string} options.dsn - Sentry DSN (Data Source Name) - optional, can be set via env var
 * @param {string} options.environment - Environment name (development, production, etc.)
 * @param {boolean} options.enabled - Whether Sentry is enabled
 * @param {number} options.tracesSampleRate - Sample rate for performance monitoring (0.0 to 1.0)
 * @param {number} options.replaysSessionSampleRate - Sample rate for session replay (0.0 to 1.0)
 * @param {number} options.replaysOnErrorSampleRate - Sample rate for error replay (0.0 to 1.0)
 */
export const initSentry = (options?: {
  dsn?: string;
  environment?: string;
  enabled?: boolean;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
}) => {
  const {
    dsn = import.meta.env.VITE_SENTRY_DSN || '',
    environment = import.meta.env.MODE || 'development',
    enabled = import.meta.env.PROD, // Only enable in production by default
    tracesSampleRate = 0.1, // 10% of transactions
    replaysSessionSampleRate = 0.1, // 10% of sessions
    replaysOnErrorSampleRate = 1.0, // 100% of sessions with errors
  } = options || {};

  if (!enabled || !dsn) {
    console.log('Sentry is disabled or DSN not provided');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate,
    // Session Replay
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    // Filter out known non-critical errors
    beforeSend(event, hint) {
      // Filter out network errors that are expected
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error) {
          // Filter out specific errors if needed
          if (error.message.includes('ResizeObserver loop')) {
            return null; // Don't send this error
          }
        }
      }
      return event;
    },
  });
};

/**
 * Capture an exception manually
 * 
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context about the error
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Capture a message (non-error event)
 * 
 * @param {string} message - The message to capture
 * @param {string} level - Severity level (info, warning, error, fatal)
 * @param {Object} context - Additional context
 */
export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' | 'fatal' = 'info',
  context?: Record<string, any>
) => {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
};

/**
 * Set user context for error tracking
 * 
 * @param {Object} user - User information
 * @param {string} user.id - User ID
 * @param {string} user.email - User email
 * @param {string} user.username - Username
 */
export const setUser = (user: { id?: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

/**
 * Clear user context
 */
export const clearUser = () => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb for debugging
 * 
 * @param {string} message - Breadcrumb message
 * @param {string} category - Breadcrumb category
 * @param {string} level - Severity level
 * @param {Object} data - Additional data
 */
export const addBreadcrumb = (
  message: string,
  category: string = 'default',
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info',
  data?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
};

