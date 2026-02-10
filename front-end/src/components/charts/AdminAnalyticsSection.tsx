import React from 'react';
import { AttendeeFormData, SpeakerFormData, PartnerFormData } from '@/types';
import { SubmissionsLineChart } from './SubmissionsLineChart';
import { PartnershipCategoryBarChart } from './PartnershipCategoryBarChart';
import { OccupationPieChart } from './OccupationPieChart';
import { getDailySubmissionCounts, getTopPartnershipCategories, getOccupationDistribution } from '@/utils/chartData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface AdminAnalyticsSectionProps {
  attendees: AttendeeFormData[];
  speakers: SpeakerFormData[];
  partners: PartnerFormData[];
}

export const AdminAnalyticsSection: React.FC<AdminAnalyticsSectionProps> = ({
  attendees,
  speakers,
  partners
}) => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const dailyData = getDailySubmissionCounts(attendees, speakers, partners);
  const categoryData = getTopPartnershipCategories(partners);
  const occupationData = getOccupationDistribution(attendees);

  const hasData = attendees.length > 0 || speakers.length > 0 || partners.length > 0;

  if (!hasData) {
    return (
      <div className={`p-8 text-center rounded-2xl ${isDark ? 'bg-slate-950/90 border border-white/10' : 'bg-white/90 border border-gray-200 shadow-md'}`}>
        <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          {lang === 'ar' ? 'لا توجد طلبات بعد. بمجرد أن يقدم الحضور والمتحدثون والشركاء النماذج، ستظهر بياناتهم هنا.' : 'No submissions yet. Once attendees, speakers, and partners submit forms, their data will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {lang === 'ar' ? 'نظرة عامة على التحليلات' : 'Analytics Overview'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SubmissionsLineChart data={dailyData} />
        </div>
        <div>
          <OccupationPieChart data={occupationData} />
        </div>
        <div className="lg:col-span-3">
          <PartnershipCategoryBarChart data={categoryData} />
        </div>
      </div>
    </div>
  );
};

