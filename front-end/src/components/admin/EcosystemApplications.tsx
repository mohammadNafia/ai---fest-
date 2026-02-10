import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, CheckCircle, XCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formsAPI } from '@/api/forms';
import { motion, AnimatePresence } from 'framer-motion';

interface EcosystemApplicationsProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface Application {
  id: string;
  organization?: string;
  name?: string;
  email: string;
  category?: string;
  status: string;
  dateSubmitted: string;
  requirements?: string;
  phone?: string;
  website?: string;
  type: 'partner' | 'speaker';
}

const EcosystemApplications: React.FC<EcosystemApplicationsProps> = ({ onSuccess, onError }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const [partnersResult, speakersResult] = await Promise.all([
        formsAPI.getPartners(1, 1000),
        formsAPI.getSpeakers(1, 1000)
      ]);

      const partnerApps: Application[] = (partnersResult.data?.data || partnersResult.data || []).map((p: any) => ({
        id: p.id || p.Id,
        organization: p.organization || p.Organization,
        email: p.email || p.Email,
        category: p.category || p.Category,
        status: p.status || p.Status || 'pending',
        dateSubmitted: p.dateSubmitted || p.createdAt || p.CreatedAt,
        requirements: p.requirements || p.Requirements,
        phone: p.phone || p.Phone,
        website: p.website || p.Website,
        type: 'partner' as const
      }));

      const speakerApps: Application[] = (speakersResult.data?.data || speakersResult.data || []).map((s: any) => ({
        id: s.id || s.Id,
        name: s.name || s.Name,
        email: s.email || s.Email,
        status: s.status || s.Status || 'pending',
        dateSubmitted: s.dateSubmitted || s.createdAt || s.CreatedAt,
        phone: s.phone || s.Phone,
        institution: s.institution || s.Institution,
        topics: s.topics || s.Topics,
        experience: s.experience || s.Experience,
        type: 'speaker' as const
      }));

      const allApps = [...partnerApps, ...speakerApps].sort((a, b) => {
        const dateA = new Date(a.dateSubmitted).getTime();
        const dateB = new Date(b.dateSubmitted).getTime();
        return dateB - dateA; // Newest first
      });

      setApplications(allApps);
    } catch (error) {
      console.error('Error loading applications:', error);
      onError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.organization?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (app.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.category?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || app.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') {
      return <CheckCircle size={16} className="text-green-500" />;
    } else if (statusLower === 'rejected') {
      return <XCircle size={16} className="text-red-500" />;
    }
    return <Clock size={16} className="text-yellow-500" />;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') {
      return theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400';
    } else if (statusLower === 'rejected') {
      return theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-400';
    }
    return theme === 'light' ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500/20 text-yellow-400';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {lang === 'ar' ? 'طلبات النظام البيئي' : 'Ecosystem Applications'}
          </h3>
          <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {lang === 'ar' 
              ? 'عرض وإدارة طلبات الشركاء والمتحدثين' 
              : 'View and manage partner and speaker applications'}
          </p>
        </div>
        <button
          onClick={loadApplications}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === 'light'
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {lang === 'ar' ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'البحث في الطلبات...' : 'Search applications...'}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2.5 rounded-lg border transition-colors ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900'
                : 'bg-white/5 border-white/10 text-white'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
          >
            <option value="all">{lang === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
            <option value="pending">{lang === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
            <option value="approved">{lang === 'ar' ? 'موافق عليه' : 'Approved'}</option>
            <option value="rejected">{lang === 'ar' ? 'مرفوض' : 'Rejected'}</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-4 py-2.5 rounded-lg border transition-colors ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900'
                : 'bg-white/5 border-white/10 text-white'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
          >
            <option value="all">{lang === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
            <option value="partner">{lang === 'ar' ? 'شركاء' : 'Partners'}</option>
            <option value="speaker">{lang === 'ar' ? 'متحدثون' : 'Speakers'}</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            {lang === 'ar' ? 'لا توجد طلبات' : 'No applications found'}
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className={`rounded-lg border overflow-hidden transition-all ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <div
                className={`p-4 cursor-pointer transition-colors ${
                  theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                }`}
                onClick={() => toggleExpand(app.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {app.organization || app.name || 'N/A'}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        app.type === 'partner'
                          ? theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-400'
                          : theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {app.type === 'partner' 
                          ? (lang === 'ar' ? 'شريك' : 'Partner')
                          : (lang === 'ar' ? 'متحدث' : 'Speaker')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                        {app.email}
                      </span>
                      {app.category && (
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          {app.category}
                        </span>
                      )}
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-500'}>
                        {formatDate(app.dateSubmitted)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(app.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                    }`}
                  >
                    {expandedItems.has(app.id) ? (
                      <EyeOff size={20} className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
                    ) : (
                      <Eye size={20} className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedItems.has(app.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-4 pb-4 pt-0 space-y-3 border-t ${
                      theme === 'light' ? 'border-gray-100' : 'border-white/5'
                    }`}>
                      {app.type === 'partner' && (
                        <>
                          {app.organization && (
                            <div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {lang === 'ar' ? 'المنظمة:' : 'Organization:'}
                              </span>
                              <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{app.organization}</p>
                            </div>
                          )}
                          {app.phone && (
                            <div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {lang === 'ar' ? 'الهاتف:' : 'Phone:'}
                              </span>
                              <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{app.phone}</p>
                            </div>
                          )}
                          {app.website && (
                            <div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {lang === 'ar' ? 'الموقع:' : 'Website:'}
                              </span>
                              <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{app.website}</p>
                            </div>
                          )}
                          {app.requirements && (
                            <div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {lang === 'ar' ? 'المتطلبات:' : 'Requirements:'}
                              </span>
                              <p className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{app.requirements}</p>
                            </div>
                          )}
                        </>
                      )}
                      {app.type === 'speaker' && (
                        <>
                          {app.name && (
                            <div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {lang === 'ar' ? 'الاسم:' : 'Name:'}
                              </span>
                              <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{app.name}</p>
                            </div>
                          )}
                          {(app as any).institution && (
                            <div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {lang === 'ar' ? 'المؤسسة:' : 'Institution:'}
                              </span>
                              <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{(app as any).institution}</p>
                            </div>
                          )}
                          {(app as any).topics && (
                            <div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {lang === 'ar' ? 'المواضيع:' : 'Topics:'}
                              </span>
                              <p className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{(app as any).topics}</p>
                            </div>
                          )}
                          {(app as any).experience && (
                            <div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {lang === 'ar' ? 'الخبرة:' : 'Experience:'}
                              </span>
                              <p className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{(app as any).experience}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
        {lang === 'ar' 
          ? `إجمالي الطلبات: ${filteredApplications.length} من ${applications.length}`
          : `Showing ${filteredApplications.length} of ${applications.length} applications`}
      </div>
    </div>
  );
};

export default EcosystemApplications;
