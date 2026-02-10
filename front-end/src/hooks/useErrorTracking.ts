/**
 * Error Tracking Hook
 * 
 * Custom React hook for error tracking with Sentry integration.
 * Provides convenient methods for tracking errors, messages, and user actions.
 * 
 * @module useErrorTracking
 */

import { useCallback } from 'react';
import { captureException, captureMessage, addBreadcrumb, setUser, clearUser } from '@/utils/sentry';

/**
 * Hook return type for error tracking
 */
interface UseErrorTrackingReturn {
  /**
   * Track an error exception
   */
  trackError: (error: Error, context?: Record<string, any>) => void;
  
  /**
   * Track a message (non-error event)
   */
  trackMessage: (message: string, level?: 'info' | 'warning' | 'error' | 'fatal', context?: Record<string, any>) => void;
  
  /**
   * Add a breadcrumb for debugging
   */
  addBreadcrumb: (message: string, category?: string, level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal', data?: Record<string, any>) => void;
  
  /**
   * Set user context for error tracking
   */
  setUserContext: (user: { id?: string; email?: string; username?: string }) => void;
  
  /**
   * Clear user context
   */
  clearUserContext: () => void;
}

/**
 * Custom hook for error tracking
 * 
 * @returns {UseErrorTrackingReturn} Error tracking methods
 * 
 * @example
 * ```tsx
 * const { trackError, trackMessage } = useErrorTracking();
 * 
 * try {
 *   // some operation
 * } catch (error) {
 *   trackError(error, { component: 'MyComponent', action: 'submitForm' });
 * }
 * ```
 */
export const useErrorTracking = (): UseErrorTrackingReturn => {
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    captureException(error, context);
  }, []);

  const trackMessage = useCallback((
    message: string,
    level: 'info' | 'warning' | 'error' | 'fatal' = 'info',
    context?: Record<string, any>
  ) => {
    captureMessage(message, level, context);
  }, []);

  const addBreadcrumbCallback = useCallback((
    message: string,
    category: string = 'default',
    level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info',
    data?: Record<string, any>
  ) => {
    addBreadcrumb(message, category, level, data);
  }, []);

  const setUserContext = useCallback((user: { id?: string; email?: string; username?: string }) => {
    setUser(user);
  }, []);

  const clearUserContext = useCallback(() => {
    clearUser();
  }, []);

  return {
    trackError,
    trackMessage,
    addBreadcrumb: addBreadcrumbCallback,
    setUserContext,
    clearUserContext,
  };
};

