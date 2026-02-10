import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CategoryCountData } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface PartnershipCategoryBarChartProps {
  data: CategoryCountData[];
}

export const PartnershipCategoryBarChart: React.FC<PartnershipCategoryBarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartColors = {
    bar: isDark ? '#8b5cf6' : '#6366f1',
    grid: isDark ? '#334155' : '#e2e8f0',
    text: isDark ? '#cbd5e1' : '#1e293b',
    background: isDark ? '#0f172a' : '#ffffff'
  };

  if (data.length === 0) {
    return (
      <div className={`p-8 text-center rounded-2xl ${isDark ? 'bg-slate-950/90 border border-white/10' : 'bg-white/90 border border-gray-200'}`}>
        <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
          No partnership data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-950/90 border border-white/10' : 'bg-white/90 border border-gray-200 shadow-md'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Partnership Categories
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis 
            dataKey="category" 
            stroke={chartColors.text}
            tick={{ fill: chartColors.text }}
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
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
          />
          <Bar 
            dataKey="count" 
            fill={chartColors.bar}
            radius={[8, 8, 0, 0]}
            name="Submissions"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

