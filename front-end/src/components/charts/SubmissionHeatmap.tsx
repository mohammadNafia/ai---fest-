import React, { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SubmissionHeatmapData } from '@/types';

interface SubmissionHeatmapProps {
  data: SubmissionHeatmapData[];
}

/**
 * SubmissionHeatmap - Heatmap visualization for submission patterns
 * Shows submission intensity by date and hour
 */
export const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({ data }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const isDark = theme === 'dark';

  // Group data by date and hour
  const heatmapData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const dateMap: Record<string, Record<number, number>> = {};
    
    data.forEach(item => {
      if (!dateMap[item.date]) {
        dateMap[item.date] = {};
      }
      dateMap[item.date][item.hour] = item.count;
    });

    // Get unique dates and sort them
    const dates = Object.keys(dateMap).sort();
    
    // Create grid: rows are dates, columns are hours (0-23)
    return dates.map(date => {
      const hourData: Record<number, number> = dateMap[date];
      const row: { date: string; hours: number[] } = {
        date,
        hours: Array.from({ length: 24 }, (_, hour) => hourData[hour] || 0)
      };
      return row;
    });
  }, [data]);

  // Calculate max count for color intensity
  const maxCount = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(d => d.count), 1);
  }, [data]);

  const getColorIntensity = (count: number): string => {
    if (count === 0) return isDark ? 'bg-white/5' : 'bg-gray-100';
    const intensity = count / maxCount;
    
    if (isDark) {
      if (intensity < 0.25) return 'bg-blue-500/20';
      if (intensity < 0.5) return 'bg-blue-500/40';
      if (intensity < 0.75) return 'bg-blue-500/60';
      return 'bg-blue-500/80';
    } else {
      if (intensity < 0.25) return 'bg-blue-100';
      if (intensity < 0.5) return 'bg-blue-300';
      if (intensity < 0.75) return 'bg-blue-500';
      return 'bg-blue-700';
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className={`p-8 text-center rounded-lg ${
        isDark ? 'bg-white/5' : 'bg-gray-50'
      }`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {lang === 'ar' ? 'لا توجد بيانات للعرض' : 'No data available'}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {lang === 'ar' ? 'خريطة حرارية للطلبات' : 'Submission Heatmap'}
      </h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-24 flex-shrink-0"></div>
            <div className="flex flex-1 gap-1">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  className={`text-xs text-center flex-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {heatmapData.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-24 flex-shrink-0 text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {new Date(row.date).toLocaleDateString(lang === 'ar' ? 'ar' : 'en', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex flex-1 gap-1">
                  {row.hours.map((count, hour) => (
                    <div
                      key={hour}
                      className={`flex-1 h-6 rounded transition-all hover:scale-110 ${
                        getColorIntensity(count)
                      } ${count > 0 ? 'cursor-pointer' : ''}`}
                      title={`${row.date} ${hour}:00 - ${count} submissions`}
                    >
                      {count > 0 && (
                        <span className={`text-[10px] flex items-center justify-center h-full ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4">
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {lang === 'ar' ? 'أقل' : 'Less'}
        </span>
        <div className="flex-1 flex gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
            <div
              key={intensity}
              className={`flex-1 h-4 rounded ${
                getColorIntensity(intensity * maxCount)
              }`}
            />
          ))}
        </div>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {lang === 'ar' ? 'أكثر' : 'More'}
        </span>
      </div>
    </div>
  );
};

