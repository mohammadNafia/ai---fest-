import { AttendeeFormData, SpeakerFormData, PartnerFormData, DailySubmissionData, CategoryCountData, OccupationDistributionData } from '@/types';

const normalizeDateString = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
};

export const getDailySubmissionCounts = (
  attendees: AttendeeFormData[],
  speakers: SpeakerFormData[],
  partners: PartnerFormData[]
): DailySubmissionData[] => {
  const allSubmissions = [
    ...attendees.map(a => ({ date: a.dateSubmitted || (a as any).created_at, type: 'attendees' as const })),
    ...speakers.map(s => ({ date: s.dateSubmitted || (s as any).created_at, type: 'speakers' as const })),
    ...partners.map(p => ({ date: p.dateSubmitted || (p as any).created_at, type: 'partners' as const }))
  ];

  const groupedByDate: Record<string, { count: number; attendees: number; speakers: number; partners: number }> = {};

  allSubmissions.forEach(sub => {
    const date = normalizeDateString(sub.date) || normalizeDateString(new Date().toISOString());
    if (!date) return;
    if (!groupedByDate[date]) {
      groupedByDate[date] = { count: 0, attendees: 0, speakers: 0, partners: 0 };
    }
    groupedByDate[date].count++;
    if (sub.type === 'attendees') groupedByDate[date].attendees++;
    if (sub.type === 'speakers') groupedByDate[date].speakers++;
    if (sub.type === 'partners') groupedByDate[date].partners++;
  });

  return Object.entries(groupedByDate)
    .map(([date, counts]) => ({
      date,
      ...counts
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getTopPartnershipCategories = (partners: PartnerFormData[]): CategoryCountData[] => {
  const categories: Record<string, number> = {};
  
  partners.forEach(p => {
    const category = p.category || 'Other';
    categories[category] = (categories[category] || 0) + 1;
  });

  return Object.entries(categories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
};

export const getOccupationDistribution = (attendees: AttendeeFormData[]): OccupationDistributionData[] => {
  const occupations: Record<string, number> = {};
  
  attendees.forEach(a => {
    const occupation = a.occupation || 'Other';
    occupations[occupation] = (occupations[occupation] || 0) + 1;
  });

  return Object.entries(occupations)
    .map(([occupation, count]) => ({ occupation, count }))
    .sort((a, b) => b.count - a.count);
};
