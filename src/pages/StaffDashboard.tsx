import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Mic, Handshake, TrendingUp, Search, ChevronLeft, ChevronRight, 
  LogOut, Printer, FileDown, Sun, Moon, Lock, Home 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { adminAPI } from '@/api/admin';
import { analyticsService } from '@/services/analyticsService';
import { AdminAnalyticsSection } from '@/components/charts/AdminAnalyticsSection';
import { SubmissionHeatmap } from '@/components/charts/SubmissionHeatmap';
import { exportAttendeesCSV, exportSpeakersCSV, exportPartnersCSV, exportPartnersJSON } from '@/utils/export';
import type { 
  AttendeeFormData, 
  SpeakerFormData, 
  PartnerFormData, 
  SubmissionHeatmapData,
  StaffPermissions
} from '@/types';

type StaffTabType = 'dashboard' | 'attendees' | 'speakers' | 'partners';
type ExportFormat = 'csv' | 'json';

interface AnalyticsData {
  totalAttendees?: number;
  totalSpeakers?: number;
  totalPartners?: number;
  mostCommonOccupation?: string;
  topPartnershipCategory?: string;
}

type SubmissionItem = AttendeeFormData | SpeakerFormData | PartnerFormData;

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { lang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  // Safe access to permissions
  const permissions: StaffPermissions = user?.permissions || {
    viewAttendees: false,
    viewSpeakers: false,
    viewPartners: false,
    viewAnalytics: false,
    editAttendees: false,
    editSpeakers: false,
    editPartners: false,
    exportData: false,
  };

  const [activeTab, setActiveTab] = useState<StaffTabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [attendees, setAttendees] = useState<AttendeeFormData[]>([]);
  const [speakers, setSpeakers] = useState<SpeakerFormData[]>([]);
  const [partners, setPartners] = useState<PartnerFormData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [heatmapData, setHeatmapData] = useState<SubmissionHeatmapData[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load Data based on permissions
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [submissionsResult, analyticsResult] = await Promise.all([
          adminAPI.getAllSubmissions(),
          adminAPI.getAnalytics()
        ]);
        
        if (submissionsResult.success) {
          if (permissions.viewAttendees) setAttendees(submissionsResult.data?.attendees || []);
          if (permissions.viewSpeakers) setSpeakers(submissionsResult.data?.speakers || []);
          if (permissions.viewPartners) setPartners(submissionsResult.data?.partners || []);
        }
        
        if (analyticsResult.success && permissions.viewAnalytics) {
          setAnalytics(analyticsResult.data || null);
        }
      } catch (error) {
        console.error('Error loading staff data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [permissions]);

  // Load advanced analytics if authorized (Heatmap only for now)
  useEffect(() => {
    const loadAdvancedAnalytics = async () => {
      if (!permissions.viewAnalytics) return;
      
      try {
        const heatmapResult = await analyticsService.getSubmissionHeatmap();
        if (heatmapResult.success) setHeatmapData(heatmapResult.data || []);

      } catch (error) {
        console.error('Error loading advanced analytics:', error);
      }
    };

    if (permissions.viewAnalytics) {
      loadAdvancedAnalytics();
    }
  }, [permissions.viewAnalytics]);

  const filteredData = useMemo(() => {
    let data: SubmissionItem[] = [];
    if (activeTab === 'attendees' && permissions.viewAttendees) data = attendees;
    else if (activeTab === 'speakers' && permissions.viewSpeakers) data = speakers;
    else if (activeTab === 'partners' && permissions.viewPartners) data = partners;
    
    if (!searchQuery) return data;
    return data.filter(item => 
      ((item as AttendeeFormData | SpeakerFormData).name || item.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery, attendees, speakers, partners, permissions]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData.length]);

  const handleExport = useCallback(async (type: StaffTabType, format: ExportFormat) => {
    if (!permissions.exportData) return;

    if (format === 'csv') {
      const { exportAttendeesCSVAsync, exportSpeakersCSVAsync, exportPartnersCSVAsync } = await import('../utils/export');
      try {
        if (type === 'attendees' && permissions.viewAttendees) {
           await exportAttendeesCSVAsync(attendees, lang);
        } else if (type === 'speakers' && permissions.viewSpeakers) {
           await exportSpeakersCSVAsync(speakers, lang);
        } else if (type === 'partners' && permissions.viewPartners) {
           await exportPartnersCSVAsync(partners, lang);
        }
      } catch (error) {
        console.error('Export error:', error);
        // Fallback
        if (type === 'attendees') exportAttendeesCSV(attendees, lang);
        else if (type === 'speakers') exportSpeakersCSV(speakers, lang);
        else if (type === 'partners') exportPartnersCSV(partners, lang);
      }
    } else {
      if (type === 'partners' && permissions.viewPartners) exportPartnersJSON(partners);
    }
  }, [attendees, speakers, partners, lang, permissions]);

  const handlePrint = useCallback((type: StaffTabType) => {
    navigate(`/admin/print?type=${type}`);
  }, [navigate]);

  const handleTabChange = useCallback((tab: StaffTabType) => {
    // Prevent switching to forbidden tabs
    if (tab === 'attendees' && !permissions.viewAttendees) return;
    if (tab === 'speakers' && !permissions.viewSpeakers) return;
    if (tab === 'partners' && !permissions.viewPartners) return;
    
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  }, [permissions]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  // Available tabs based on permissions
  const tabs = useMemo(() => {
    const t: StaffTabType[] = ['dashboard'];
    if (permissions.viewAttendees) t.push('attendees');
    if (permissions.viewSpeakers) t.push('speakers');
    if (permissions.viewPartners) t.push('partners');
    return t;
  }, [permissions]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-[#00040F]'
    }`}>
      {/* Staff Navbar */}
      <nav className={`border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a1a] border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex flex-col">
              <h1 className={`text-xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {lang === 'ar' ? 'لوحة الموظفين' : 'Staff Dashboard'}
              </h1>
              <span className={`text-xs ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {user?.name}
              </span>
            </div>

            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`hidden md:block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? theme === 'light'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {t.staff?.[`view${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof t.staff] || (tab === 'dashboard' ? (lang === 'ar' ? 'الرئيسية' : 'Dashboard') : tab)}
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
                <span className="hidden sm:inline">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
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
                <span className="hidden sm:inline">{t.admin.logout}</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="md:hidden flex overflow-x-auto pb-3 gap-2 scrollbar-hide">
             {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? theme === 'light'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {t.staff?.[`view${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof t.staff] || (tab === 'dashboard' ? (lang === 'ar' ? 'الرئيسية' : 'Dashboard') : tab)}
                </button>
              ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
             {/* Skeleton Loading */}
             <div className={`h-32 rounded-xl w-full animate-pulse ${theme === 'light' ? 'bg-gray-200' : 'bg-white/5'}`}></div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className={`h-32 rounded-xl animate-pulse ${theme === 'light' ? 'bg-gray-200' : 'bg-white/5'}`}></div>
               ))}
             </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Welcome & Permission Summary */}
                  <motion.div variants={itemVariants} className={`p-6 rounded-xl border ${
                    theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
                  }`}>
                    <h2 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {t.staff?.welcome}, {user?.name}
                    </h2>
                    <p className={`mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {t.staff?.accessLevel}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {permissions.viewAttendees && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{t.staff?.viewAttendees}</span>
                      )}
                      {permissions.viewSpeakers && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">{t.staff?.viewSpeakers}</span>
                      )}
                      {permissions.viewPartners && (
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">{t.staff?.viewPartners}</span>
                      )}
                      {permissions.viewAnalytics && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{t.staff?.viewAnalytics}</span>
                      )}
                      {permissions.exportData && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">{t.staff?.exportData}</span>
                      )}
                    </div>
                  </motion.div>

                  {permissions.viewAnalytics ? (
                    <>
                      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {permissions.viewAttendees && (
                          <motion.div variants={itemVariants} className={`p-6 rounded-xl border transition-colors ${
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
                          </motion.div>
                        )}
                        
                        {/* Similar cards for Speakers and Partners if permitted */}
                        {permissions.viewSpeakers && (
                           <motion.div variants={itemVariants} className={`p-6 rounded-xl border transition-colors ${
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
                          </motion.div>
                        )}
                      </motion.div>
                      
                      {/* Charts */}
                      <motion.div variants={itemVariants}>
                          <AdminAnalyticsSection 
                            attendees={permissions.viewAttendees ? attendees : []}
                            speakers={permissions.viewSpeakers ? speakers : []}
                            partners={permissions.viewPartners ? partners : []}
                          />
                      </motion.div>

                      {heatmapData.length > 0 && (
                        <motion.div variants={itemVariants}>
                           <SubmissionHeatmap data={heatmapData} />
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <motion.div variants={itemVariants} className={`p-8 text-center rounded-xl border border-dashed ${
                       theme === 'light' ? 'border-gray-300' : 'border-white/20'
                    }`}>
                      <Lock size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {t.staff?.analyticsRestricted}
                      </h3>
                      <p className={`mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t.staff?.analyticsRestrictedMsg}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab !== 'dashboard' && (
                <div className="space-y-6">
                  {/* Search & Export Toolbar */}
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
                        placeholder={t.staff?.searchPlaceholder || t.admin.search}
                      />
                    </div>
                    
                    {permissions.exportData ? (
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
                          {t.admin.exportCSV}
                        </button>
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
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500 cursor-not-allowed" title={t.staff?.exportRestricted}>
                             <Lock size={14} />
                             {t.staff?.exportData}
                        </div>
                    )}
                  </div>

                  {/* Data Table */}
                  <div className={`rounded-lg border overflow-hidden ${
                    theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                         {/* Table Header Reuse */}
                         <thead className={theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}>
                          <tr>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>{t.admin.name}</th>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>{t.admin.email}</th>
                            {activeTab === 'attendees' && (
                               <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                               }`}>{t.admin.occupation}</th>
                            )}
                            {activeTab === 'speakers' && (
                               <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                               }`}>{t.admin.topics}</th>
                            )}
                            {activeTab === 'partners' && (
                               <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                               }`}>{t.admin.category}</th>
                            )}
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>{t.admin.dateSubmitted}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                          {paginatedData.length === 0 ? (
                            <tr>
                              <td colSpan={4} className={`px-4 py-16 text-center ${
                                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p className="text-lg font-medium">{t.staff?.noData || t.admin.noData}</p>
                              </td>
                            </tr>
                          ) : (
                            <AnimatePresence>
                                {paginatedData.map((item, idx) => (
                                   <motion.tr 
                                     key={idx} 
                                     initial={{ opacity: 0, y: 10 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     exit={{ opacity: 0 }}
                                     transition={{ delay: idx * 0.05 }}
                                     className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}
                                   >
                                     <td className={`px-4 py-3 whitespace-nowrap ${
                                       theme === 'light' ? 'text-gray-900' : 'text-white'
                                     }`}>{(item as any).name || (item as any).organization || '-'}</td>
                                     <td className={`px-4 py-3 whitespace-nowrap ${
                                       theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                     }`}>{item.email || '-'}</td>
                                     
                                     {activeTab === 'attendees' && (
                                       <td className={`px-4 py-3 whitespace-nowrap ${
                                         theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                       }`}>{(item as AttendeeFormData).occupation || '-'}</td>
                                     )}
                                     {activeTab === 'speakers' && (
                                       <td className={`px-4 py-3 ${
                                         theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                       }`}>{(item as SpeakerFormData).topics || '-'}</td>
                                     )}
                                     {activeTab === 'partners' && (
                                       <td className={`px-4 py-3 whitespace-nowrap ${
                                         theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                       }`}>{(item as PartnerFormData).category || '-'}</td>
                                     )}
                                     
                                     <td className={`px-4 py-3 whitespace-nowrap ${
                                       theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                     }`}>{item.dateSubmitted || new Date().toLocaleDateString()}</td>
                                   </motion.tr>
                                ))}
                            </AnimatePresence>
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
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
