/**
 * Analytics Worker - Offloads heavy analytics computations to a Web Worker
 * Handles daily, weekly, monthly summaries and aggregations
 */

interface WorkerMessage {
  type: 'computeDaily' | 'computeWeekly' | 'computeMonthly' | 'computeTopValues';
  data: any;
}

interface DailySubmission {
  date: string;
  type: 'attendees' | 'speakers' | 'partners';
}

interface WeeklySummary {
  week: string;
  totalSubmissions: number;
  attendees: number;
  speakers: number;
  partners: number;
  averagePerDay: number;
}

interface MonthlySummary {
  month: string;
  totalSubmissions: number;
  attendees: number;
  speakers: number;
  partners: number;
  growthRate?: number;
}

self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { type, data } = e.data;

  try {
    switch (type) {
      case 'computeDaily': {
        const dailyData = computeDailySubmissions(data);
        self.postMessage({ success: true, data: dailyData });
        break;
      }
      case 'computeWeekly': {
        const weeklyData = computeWeeklySummaries(data);
        self.postMessage({ success: true, data: weeklyData });
        break;
      }
      case 'computeMonthly': {
        const monthlyData = computeMonthlySummaries(data);
        self.postMessage({ success: true, data: monthlyData });
        break;
      }
      case 'computeTopValues': {
        const topValues = computeTopValues(data);
        self.postMessage({ success: true, data: topValues });
        break;
      }
      default:
        self.postMessage({ success: false, error: 'Unknown message type' });
    }
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

function computeDailySubmissions(submissions: DailySubmission[]) {
  const groupedByDate: Record<string, { count: number; attendees: number; speakers: number; partners: number }> = {};

  submissions.forEach(sub => {
    const date = new Date(sub.date).toISOString().split('T')[0];
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
      ...counts,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function computeWeeklySummaries(dailyData: any[]) {
  const weeklyMap: Record<string, WeeklySummary> = {};

  dailyData.forEach(day => {
    const date = new Date(day.date);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeklyMap[weekKey]) {
      weeklyMap[weekKey] = {
        week: weekKey,
        totalSubmissions: 0,
        attendees: 0,
        speakers: 0,
        partners: 0,
        averagePerDay: 0,
      };
    }

    weeklyMap[weekKey].totalSubmissions += day.count;
    weeklyMap[weekKey].attendees += day.attendees;
    weeklyMap[weekKey].speakers += day.speakers;
    weeklyMap[weekKey].partners += day.partners;
  });

  return Object.values(weeklyMap).map(week => ({
    ...week,
    averagePerDay: week.totalSubmissions / 7,
  }));
}

function computeMonthlySummaries(dailyData: any[]) {
  const monthlyMap: Record<string, MonthlySummary> = {};

  dailyData.forEach(day => {
    const date = new Date(day.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        month: monthKey,
        totalSubmissions: 0,
        attendees: 0,
        speakers: 0,
        partners: 0,
      };
    }

    monthlyMap[monthKey].totalSubmissions += day.count;
    monthlyMap[monthKey].attendees += day.attendees;
    monthlyMap[monthKey].speakers += day.speakers;
    monthlyMap[monthKey].partners += day.partners;
  });

  const data = Object.values(monthlyMap);
  const sortedData = data.sort((a, b) => a.month.localeCompare(b.month));

  // Calculate growth rates
  for (let i = 1; i < sortedData.length; i++) {
    const prev = sortedData[i - 1].totalSubmissions;
    const curr = sortedData[i].totalSubmissions;
    sortedData[i].growthRate = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
  }

  return sortedData;
}

function computeTopValues(data: { items: any[]; field: string; limit: number }) {
  const counts: Record<string, number> = {};
  const total = data.items.length;

  data.items.forEach(item => {
    const value = item[data.field] || 'Other';
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([value, count]) => ({
      value,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, data.limit);
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

