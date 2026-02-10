/**
 * Hook for using Analytics Web Worker
 * Offloads heavy analytics computations to a background thread
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface WorkerMessage {
  type: 'computeDaily' | 'computeWeekly' | 'computeMonthly' | 'computeTopValues';
  data: any;
}

interface WorkerResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const useAnalyticsWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize worker - with fallback if it fails
    try {
      // Try to create worker, but don't fail if it doesn't work
      if (typeof Worker !== 'undefined') {
        try {
          workerRef.current = new Worker(
            new URL('../workers/analyticsWorker.ts', import.meta.url),
            { type: 'module' }
          );

          workerRef.current.onerror = (err) => {
            console.warn('Analytics worker error (will use fallback):', err);
            setError('Worker initialization failed - using fallback');
            workerRef.current = null; // Clear worker reference
          };
        } catch (workerErr) {
          console.warn('Failed to create analytics worker (will use fallback):', workerErr);
          setError('Worker not available - using fallback');
          workerRef.current = null;
        }
      } else {
        console.warn('Web Workers not supported - using fallback');
        workerRef.current = null;
      }

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
        }
      };
    } catch (err) {
      console.warn('Failed to initialize worker (will use fallback):', err);
      setError('Failed to initialize worker - using fallback');
      workerRef.current = null;
    }
  }, []);

  const computeDaily = useCallback((submissions: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsLoading(true);
      setError(null);

      const handleMessage = (e: MessageEvent<WorkerResponse>) => {
        workerRef.current?.removeEventListener('message', handleMessage);
        setIsLoading(false);

        if (e.data.success) {
          resolve(e.data.data);
        } else {
          const errorMsg = e.data.error || 'Computation failed';
          setError(errorMsg);
          reject(new Error(errorMsg));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({
        type: 'computeDaily',
        data: submissions,
      } as WorkerMessage);
    });
  }, []);

  const computeWeekly = useCallback((dailyData: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsLoading(true);
      setError(null);

      const handleMessage = (e: MessageEvent<WorkerResponse>) => {
        workerRef.current?.removeEventListener('message', handleMessage);
        setIsLoading(false);

        if (e.data.success) {
          resolve(e.data.data);
        } else {
          const errorMsg = e.data.error || 'Computation failed';
          setError(errorMsg);
          reject(new Error(errorMsg));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({
        type: 'computeWeekly',
        data: dailyData,
      } as WorkerMessage);
    });
  }, []);

  const computeMonthly = useCallback((dailyData: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsLoading(true);
      setError(null);

      const handleMessage = (e: MessageEvent<WorkerResponse>) => {
        workerRef.current?.removeEventListener('message', handleMessage);
        setIsLoading(false);

        if (e.data.success) {
          resolve(e.data.data);
        } else {
          const errorMsg = e.data.error || 'Computation failed';
          setError(errorMsg);
          reject(new Error(errorMsg));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({
        type: 'computeMonthly',
        data: dailyData,
      } as WorkerMessage);
    });
  }, []);

  const computeTopValues = useCallback((items: any[], field: string, limit: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsLoading(true);
      setError(null);

      const handleMessage = (e: MessageEvent<WorkerResponse>) => {
        workerRef.current?.removeEventListener('message', handleMessage);
        setIsLoading(false);

        if (e.data.success) {
          resolve(e.data.data);
        } else {
          const errorMsg = e.data.error || 'Computation failed';
          setError(errorMsg);
          reject(new Error(errorMsg));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({
        type: 'computeTopValues',
        data: { items, field, limit },
      } as WorkerMessage);
    });
  }, []);

  return {
    computeDaily,
    computeWeekly,
    computeMonthly,
    computeTopValues,
    isLoading,
    error,
  };
};

