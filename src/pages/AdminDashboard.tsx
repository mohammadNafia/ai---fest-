import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mic, Handshake, TrendingUp, Search, ChevronLeft, ChevronRight, LogOut, Printer, FileDown, Sun, Moon, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { adminAPI } from '@/api/admin';
import { analyticsService } from '@/services/analyticsService';
import { AdminAnalyticsSection } from '@/components/charts/AdminAnalyticsSection';
import { SubmissionHeatmap } from '@/components/charts/SubmissionHeatmap';
import { exportAttendeesCSV, exportSpeakersCSV, exportPartnersCSV, exportPartnersJSON } from '@/utils/export';
import StaffManagement from './StaffManagement';
import type { 
  AttendeeFormData, 
  SpeakerFormData, 
  PartnerFormData, 
  ActivityLogItem,
  DailySubmissionData,
  WeeklySummary,
  MonthlySummary,
  TopValue,
  SubmissionHeatmapData,
  Lang
} from '@/types';

type TabType = 'dashboard' | 'attendees' | 'speakers' | 'partners' | 'staff';
type ExportFormat = 'csv' | 'json';

interface AnalyticsData {
  totalAttendees?: number;
  totalSpeakers?: number;
  totalPartners?: number;
  mostCommonOccupation?: string;
  topPartnershipCategory?: string;
}

type SubmissionItem = AttendeeFormData | SpeakerFormData | PartnerFormData;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogout } = useAuth();
  const { lang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [attendees, setAttendees] = useState<AttendeeFormData[]>([]);
  const [speakers, setSpeakers] = useState<SpeakerFormData[]>([]);
  const [partners, setPartners] = useState<PartnerFormData[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  // Advanced analytics from analyticsService
  const [dailySubmissions, setDailySubmissions] = useState<DailySubmissionData[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [topOccupations, setTopOccupations] = useState<TopValue[]>([]);
  const [topCategories, setTopCategories] = useState<TopValue[]>([]);
  const [heatmapData, setHeatmapData] = useState<SubmissionHeatmapData[]>([]);
  const [averageProcessingTime, setAverageProcessingTime] = useState<number>(0);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      const [submissionsResult, analyticsResult] = await Promise.all([
        adminAPI.getAllSubmissions(),
        adminAPI.getAnalytics()
      ]);
      
      if (submissionsResult.success) {
        setAttendees(submissionsResult.data?.attendees || []);
        setSpeakers(submissionsResult.data?.speakers || []);
        setPartners(submissionsResult.data?.partners || []);
        setActivityLog(submissionsResult.data?.activityLog || []);
      }
      
      if (analyticsResult.success) {
        setAnalytics(analyticsResult.data || null);
      }
    };
    loadData();
  }, []);

  // Load advanced analytics using service directly (worker disabled for stability)
  useEffect(() => {
    const loadAdvancedAnalytics = async () => {
      if (attendees.length === 0 && speakers.length === 0 && partners.length === 0) return;
      
      setIsLoadingAnalytics(true);
      try {
        // Use analyticsService directly (worker can be unreliable)
        const [
          dailyResult,
          weeklyResult,
          monthlyResult,
          occupationsResult,
          categoriesResult,
          heatmapResult,
          processingTimeResult
        ] = await Promise.all([
          analyticsService.getDailySubmissions(),
          analyticsService.getWeeklySummaries(),
          analyticsService.getMonthlySummaries(),
          analyticsService.getTopOccupations(10),
          analyticsService.getTopCategories(10),
          analyticsService.getSubmissionHeatmap(),
          analyticsService.getAverageProcessingTime()
        ]);

        if (dailyResult.success) setDailySubmissions(dailyResult.data || []);
        if (weeklyResult.success) setWeeklySummaries(weeklyResult.data || []);
        if (monthlyResult.success) setMonthlySummaries(monthlyResult.data || []);
        if (occupationsResult.success) setTopOccupations(occupationsResult.data || []);
        if (categoriesResult.success) setTopCategories(categoriesResult.data || []);

        if (heatmapResult.success) setHeatmapData(heatmapResult.data || []);
        if (processingTimeResult.success) setAverageProcessingTime(processingTimeResult.data || 0);
      } catch (error) {
        console.error('Error loading advanced analytics:', error);
        // Set empty arrays to prevent crashes - analytics are optional
        setDailySubmissions([]);
        setWeeklySummaries([]);
        setMonthlySummaries([]);
        setTopOccupations([]);
        setTopCategories([]);
        setHeatmapData([]);
        setAverageProcessingTime(0);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    loadAdvancedAnalytics();
  }, [attendees.length, speakers.length, partners.length]);

  const filteredData = useMemo(() => {
    const data: SubmissionItem[] = activeTab === 'attendees' ? attendees : activeTab === 'speakers' ? speakers : partners;
    if (!searchQuery) return data;
    return data.filter(item => 
      ((item as AttendeeFormData | SpeakerFormData).name || item.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery, attendees, speakers, partners]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData.length]);

  const handleExport = useCallback(async (type: TabType, format: ExportFormat) => {
    if (format === 'csv') {
      // Use async worker-based export for large datasets
      const { exportAttendeesCSVAsync, exportSpeakersCSVAsync, exportPartnersCSVAsync } = await import('../utils/export');
      try {
        if (type === 'attendees') {
          if (attendees.length > 100) {
            await exportAttendeesCSVAsync(attendees, lang);
          } else {
            exportAttendeesCSV(attendees, lang);
          }
        } else if (type === 'speakers') {
          if (speakers.length > 100) {
            await exportSpeakersCSVAsync(speakers, lang);
          } else {
            exportSpeakersCSV(speakers, lang);
          }
        } else if (type === 'partners') {
          if (partners.length > 100) {
            await exportPartnersCSVAsync(partners, lang);
          } else {
            exportPartnersCSV(partners, lang);
          }
        }
      } catch (error) {
        console.error('Export error:', error);
        // Fallback to sync export
        if (type === 'attendees') exportAttendeesCSV(attendees, lang);
        else if (type === 'speakers') exportSpeakersCSV(speakers, lang);
        else if (type === 'partners') exportPartnersCSV(partners, lang);
      }
    } else {
      if (type === 'partners') exportPartnersJSON(partners);
    }
  }, [attendees, speakers, partners, lang]);

  const handlePrint = useCallback((type: TabType) => {
    navigate(`/admin/print?type=${type}`);
  }, [navigate]);

  const getMostCommonOccupation = useMemo(() => {
    const occupations = attendees.map(a => a.occupation).filter(Boolean) as string[];
    const counts: Record<string, number> = {};
    occupations.forEach(occ => counts[occ] = (counts[occ] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [attendees]);

  const getTopPartnershipCategory = useMemo(() => {
    const categories = partners.map(p => p.category).filter(Boolean) as string[];
    const counts: Record<string, number> = {};
    categories.forEach(cat => counts[cat] = (counts[cat] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [partners]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  }, []);

  const handleLogout = useCallback(() => {
    adminLogout();
    navigate('/admin/login');
  }, [adminLogout, navigate]);

  const tabs = useMemo(() => ['dashboard', 'attendees', 'speakers', 'partners', 'staff'] as TabType[], []);

  // Safety check - ensure t is available and is an object, not a function
  if (!t || typeof t !== 'object' || !t.admin) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-[#00040F]'
      }`}>
        <div className="text-center">
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Loading translations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-[#00040F]'
    }`}>
      {/* Admin Navbar */}
      <nav className={`border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a1a] border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className={`text-xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {t.admin.dashboard}
            </h1>
            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? theme === 'light'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {(t?.admin?.[tab] || tab)}
                </button>
              ))}
              <button
                onClick={() => navigate('/')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  theme === 'light'
                    ? 'text-blue-600 hover:bg-blue-50'
                    : 'text-blue-400 hover:bg-blue-500/20'
                }`}
              >
                <Home size={16} />
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
              </button>
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-400 hover:bg-white/10'
                }`}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  theme === 'light'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-red-400 hover:bg-red-500/20'
                }`}
              >
                <LogOut size={16} />
                {t.admin.logout}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <Users size={24} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
                  <TrendingUp size={20} className={theme === 'light' ? 'text-green-600' : 'text-green-400'} />
                </div>
                <div className={`text-3xl font-bold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {analytics?.totalAttendees || attendees.length}
                </div>
                <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {t.admin.totalRegistrations}
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <Mic size={24} className={theme === 'light' ? 'text-purple-600' : 'text-purple-400'} />
                  <TrendingUp size={20} className={theme === 'light' ? 'text-green-600' : 'text-green-400'} />
                </div>
                <div className={`text-3xl font-bold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {analytics?.totalSpeakers || speakers.length}
                </div>
                <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {t.admin.totalSpeakers}
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <Handshake size={24} className={theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'} />
                  <TrendingUp size={20} className={theme === 'light' ? 'text-green-600' : 'text-green-400'} />
                </div>
                <div className={`text-3xl font-bold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {analytics?.totalPartners || partners.length}
                </div>
                <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {t.admin.totalPartners}
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp size={24} className={theme === 'light' ? 'text-orange-600' : 'text-orange-400'} />
                </div>
                <div className={`text-3xl font-bold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {attendees.length + speakers.length + partners.length}
                </div>
                <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {lang === 'ar' ? 'إجمالي الطلبات' : 'Total Submissions'}
                </div>
              </div>
            </div>

            {/* Activity Log */}
            {activityLog.length > 0 && (
              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {lang === 'ar' ? 'سجل النشاط' : 'Activity Log'}
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {activityLog.slice(0, 10).map((activity, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === 'light' ? 'bg-gray-50' : 'bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'attendee' ? 'bg-blue-500' :
                          activity.type === 'speaker' ? 'bg-purple-500' :
                          'bg-cyan-500'
                        }`}></div>
                        <div>
                          <p className={`text-sm font-medium ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                          }`}>
                            {activity.name}
                          </p>
                          <p className={`text-xs ${
                            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {activity.type} • {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts Section */}
            <AdminAnalyticsSection 
              attendees={attendees}
              speakers={speakers}
              partners={partners}
            />

            {/* Heatmap Chart */}
            {heatmapData.length > 0 && (
              <SubmissionHeatmap data={heatmapData} />
            )}

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {t.admin.mostCommonOccupation}
                </h3>
                <div className={`text-2xl font-bold ${
                  theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  {topOccupations.length > 0 ? topOccupations[0]?.value : (analytics?.mostCommonOccupation || getMostCommonOccupation)}
                </div>
                {topOccupations.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {topOccupations.slice(0, 5).map((occ, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          {occ.value}
                        </span>
                        <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                          {occ.count} ({occ.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {t.admin.topPartnershipCategory}
                </h3>
                <div className={`text-2xl font-bold ${
                  theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'
                }`}>
                  {topCategories.length > 0 ? topCategories[0]?.value : (analytics?.topPartnershipCategory || getTopPartnershipCategory)}
                </div>
                {topCategories.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {topCategories.slice(0, 5).map((cat, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          {cat.value}
                        </span>
                        <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                          {cat.count} ({cat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Metrics */}
            {monthlySummaries.length > 0 && (
              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {lang === 'ar' ? 'ملخص شهري' : 'Monthly Summary'}
                </h3>
                <div className="space-y-3">
                  {monthlySummaries.slice(-3).reverse().map((month, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                        {month.month}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                          {month.totalSubmissions} {lang === 'ar' ? 'طلب' : 'submissions'}
                        </span>
                        {month.growthRate !== undefined && (
                          <span className={`text-sm ${
                            month.growthRate >= 0 
                              ? theme === 'light' ? 'text-green-600' : 'text-green-400'
                              : theme === 'light' ? 'text-red-600' : 'text-red-400'
                          }`}>
                            {month.growthRate >= 0 ? '+' : ''}{month.growthRate.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Time */}
            {averageProcessingTime > 0 && (
              <div className={`p-6 rounded-xl border transition-colors ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {lang === 'ar' ? 'متوسط وقت المعالجة' : 'Average Processing Time'}
                </h3>
                <div className={`text-3xl font-bold ${
                  theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  {averageProcessingTime.toFixed(1)} {lang === 'ar' ? 'ساعة' : 'hours'}
                </div>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'attendees' || activeTab === 'speakers' || activeTab === 'partners') && (
          <div className="space-y-6">
            {/* Search and Export */}
            <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-lg ${
              theme === 'light' ? 'bg-white border border-gray-200' : 'bg-white/5 border border-white/10'
            }`}>
              <div className="relative flex-1 max-w-md">
                <Search size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-2 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900'
                      : 'bg-black/50 border-white/10 text-white'
                  } outline-none`}
                  placeholder={t.admin.search}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleExport(activeTab, 'csv')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  <FileDown size={16} />
                  {lang === 'ar' ? 'تصدير CSV' : 'Export CSV'}
                </button>
                {activeTab === 'partners' && (
                  <button
                    onClick={() => handleExport('partners', 'json')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                        : 'bg-cyan-600 text-white hover:bg-cyan-500'
                    }`}
                  >
                    <FileDown size={16} />
                    {lang === 'ar' ? 'تصدير JSON' : 'Export JSON'}
                  </button>
                )}
                <button
                  onClick={() => handlePrint(activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-600 text-white hover:bg-purple-500'
                  }`}
                >
                  <Printer size={16} />
                  {lang === 'ar' ? 'طباعة' : 'Print'}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className={`rounded-lg border overflow-hidden ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}>
                    <tr>
                      {activeTab === 'attendees' && (
                        <>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.name}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.email}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.phone}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.occupation}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.dateSubmitted}</th>
                        </>
                      )}
                      {activeTab === 'speakers' && (
                        <>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.name}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.email}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.topics}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.dateSubmitted}</th>
                        </>
                      )}
                      {activeTab === 'partners' && (
                        <>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.organization}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.email}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.category}</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>{t.admin.dateSubmitted}</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={`px-4 py-8 text-center ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {t.admin.noData}
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item, idx) => (
                        <tr key={idx} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}>
                          {activeTab === 'attendees' && (
                            <>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>{(item as AttendeeFormData).name || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{item.email || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{(item as AttendeeFormData).phone || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{(item as AttendeeFormData).occupation || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{item.dateSubmitted || new Date().toLocaleDateString()}</td>
                            </>
                          )}
                          {activeTab === 'speakers' && (
                            <>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>{(item as SpeakerFormData).name || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{item.email || '-'}</td>
                              <td className={`px-4 py-3 ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{(item as SpeakerFormData).topics || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{item.dateSubmitted || new Date().toLocaleDateString()}</td>
                            </>
                          )}
                          {activeTab === 'partners' && (
                            <>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>{(item as PartnerFormData).organization || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{item.email || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{(item as PartnerFormData).category || '-'}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>{item.dateSubmitted || new Date().toLocaleDateString()}</td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`flex items-center justify-between px-4 py-3 border-t ${
                  theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-white/5'
                }`}>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {t.admin.page} {currentPage} {t.admin.of} {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                        theme === 'light'
                          ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <ChevronLeft size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                        theme === 'light'
                          ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <ChevronRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (
          <StaffManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

