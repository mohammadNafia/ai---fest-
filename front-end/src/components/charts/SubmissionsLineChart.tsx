import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailySubmissionData } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface SubmissionsLineChartProps {
  data: DailySubmissionData[];
}

export const SubmissionsLineChart: React.FC<SubmissionsLineChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartColors = {
    line: isDark ? '#38bdf8' : '#3b82f6',
    grid: isDark ? '#334155' : '#e2e8f0',
    text: isDark ? '#cbd5e1' : '#1e293b',
    background: isDark ? '#0f172a' : '#ffffff'
  };

  if (data.length === 0) {
    return (
      <div className={`p-8 text-center rounded-2xl ${isDark ? 'bg-slate-950/90 border border-white/10' : 'bg-white/90 border border-gray-200'}`}>
        <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
          No submission data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-950/90 border border-white/10' : 'bg-white/90 border border-gray-200 shadow-md'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Daily Submissions
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis 
            dataKey="date" 
            stroke={chartColors.text}
            tick={{ fill: chartColors.text }}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke={chartColors.text}
            tick={{ fill: chartColors.text }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: '8px',
              color: chartColors.text
            }}
          />
          <Legend 
            wrapperStyle={{ color: chartColors.text }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke={chartColors.line}
            strokeWidth={2}
            name="Total"
            dot={{ fill: chartColors.line, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="attendees" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Attendees"
            dot={{ fill: '#10b981', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="speakers" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Speakers"
            dot={{ fill: '#f59e0b', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="partners" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="Partners"
            dot={{ fill: '#8b5cf6', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

