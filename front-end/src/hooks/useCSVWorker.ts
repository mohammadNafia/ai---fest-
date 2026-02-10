/**
 * Hook for using CSV Web Worker
 * Builds CSV files in background without blocking the main thread
 */

import { useRef, useState, useCallback } from 'react';

interface WorkerMessage {
  type: 'buildCSV';
  data: {
    items: any[];
    headers: string[];
    lang?: string;
  };
}

interface WorkerResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export const useCSVWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize worker lazily
  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      try {
        workerRef.current = new Worker(
          new URL('../workers/csvWorker.ts', import.meta.url),
          { type: 'module' }
        );

        workerRef.current.onerror = (err) => {
          console.error('CSV worker error:', err);
          setError('Worker initialization failed');
        };
      } catch (err) {
        console.error('Failed to create CSV worker:', err);
        setError('Failed to initialize worker');
        return null;
      }
    }
    return workerRef.current;
  }, []);

  const buildCSV = useCallback((items: any[], headers: string[], lang: string = 'en'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const worker = getWorker();
      if (!worker) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsLoading(true);
      setError(null);

      const handleMessage = (e: MessageEvent<WorkerResponse>) => {
        worker.removeEventListener('message', handleMessage);
        setIsLoading(false);

        if (e.data.success && e.data.data) {
          resolve(e.data.data);
        } else {
          const errorMsg = e.data.error || 'CSV building failed';
          setError(errorMsg);
          reject(new Error(errorMsg));
        }
      };

      worker.addEventListener('message', handleMessage);
      worker.postMessage({
        type: 'buildCSV',
        data: { items, headers, lang },
      } as WorkerMessage);
    });
  }, [getWorker]);

  const downloadCSV = useCallback(async (
    filename: string,
    items: any[],
    headers: string[],
    lang: string = 'en'
  ): Promise<void> => {
    try {
      const csv = await buildCSV(items, headers, lang);
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}-${timestamp}.csv`;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fullFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      throw err;
    }
  }, [buildCSV]);

  return {
    buildCSV,
    downloadCSV,
    isLoading,
    error,
  };
};

