import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { OccupationDistributionData } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface OccupationPieChartProps {
  data: OccupationDistributionData[];
}

const COLORS = [
  '#38bdf8', '#8b5cf6', '#10b981', '#f59e0b', 
  '#ef4444', '#ec4899', '#06b6d4', '#84cc16'
];

export const OccupationPieChart: React.FC<OccupationPieChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartColors = {
    text: isDark ? '#cbd5e1' : '#1e293b',
    background: isDark ? '#0f172a' : '#ffffff'
  };

  if (data.length === 0) {
    return (
      <div className={`p-8 text-center rounded-2xl ${isDark ? 'bg-slate-950/90 border border-white/10' : 'bg-white/90 border border-gray-200'}`}>
        <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
          No attendee data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-950/90 border border-white/10' : 'bg-white/90 border border-gray-200 shadow-md'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Occupation Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ occupation, percent }) => `${occupation}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

