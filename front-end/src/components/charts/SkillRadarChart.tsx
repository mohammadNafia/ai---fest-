import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SkillData {
  skill: string;
  value: number;
  fullMark: number;
}

interface SkillRadarChartProps {
  data: SkillData[];
}

/**
 * SkillRadarChart - Radar chart for skill analysis
 * Displays multiple skills in a radar/spider chart format
 */
export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const isDark = theme === 'dark';

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
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
        <PolarAngleAxis 
          dataKey="skill" 
          tick={{ fill: isDark ? '#fff' : '#000', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 'dataMax']}
          tick={{ fill: isDark ? '#fff' : '#000', fontSize: 10 }}
        />
        <Radar
          name={lang === 'ar' ? 'المهارات' : 'Skills'}
          dataKey="value"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

