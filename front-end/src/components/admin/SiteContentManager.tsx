import React, { useState, useEffect, useMemo } from 'react';
import { Save, RefreshCw, Search, ChevronDown, ChevronRight, Globe, Languages, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cmsService, SiteSetting } from '@/services/cmsService';
import { motion, AnimatePresence } from 'framer-motion';
import EcosystemApplications from './EcosystemApplications';

interface SiteContentManagerProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const SiteContentManager: React.FC<SiteContentManagerProps> = ({ onSuccess, onError }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['hero', 'stats']));
  const [activeTab, setActiveTab] = useState<'content' | 'applications'>('content');

  // Load settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const result = await cmsService.getAllSettings();
    if (result.success && result.data) {
      setSettings(result.data);
      // Initialize edited settings with current values
      const initial: Record<string, string> = {};
      result.data.forEach(s => {
        initial[s.key] = s.value;
      });
      setEditedSettings(initial);
    } else {
      onError('Failed to load settings');
    }
    setLoading(false);
  };

  // Group settings by category
  const groupedSettings = useMemo(() => {
    const groups: Record<string, SiteSetting[]> = {};
    
    settings
      .filter(s => 
        s.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .forEach(setting => {
        const category = setting.category || 'general';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(setting);
      });

    // Sort and return as array
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, settings]) => ({ category, settings }));
  }, [settings, searchQuery]);

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return settings.some(s => editedSettings[s.key] !== s.value);
  }, [settings, editedSettings]);

  // Get changed settings count
  const changedCount = useMemo(() => {
    return settings.filter(s => editedSettings[s.key] !== s.value).length;
  }, [settings, editedSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const changedSettings = settings
        .filter(s => editedSettings[s.key] !== s.value)
        .map(s => ({ key: s.key, value: editedSettings[s.key] || '' }));

      if (changedSettings.length === 0) {
        onSuccess('No changes to save');
        setSaving(false);
        return;
      }

      const result = await cmsService.bulkUpdateSettings(changedSettings);
      if (result.success) {
        onSuccess(`${changedSettings.length} setting(s) saved successfully`);
        await loadSettings(); // Reload to sync
      } else {
        onError(result.error || 'Failed to save settings');
      }
    } catch (error) {
      onError('An error occurred while saving');
    }
    setSaving(false);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      hero: { en: 'Hero Section', ar: 'قسم البطل' },
      stats: { en: 'Statistics', ar: 'الإحصائيات' },
      speakers: { en: 'Speakers Section', ar: 'قسم المتحدثين' },
      cta: { en: 'Call to Action', ar: 'دعوة للعمل' },
      event: { en: 'Event Details', ar: 'تفاصيل الحدث' },
      general: { en: 'General', ar: 'عام' },
      contact: { en: 'Contact', ar: 'الاتصال' },
      social: { en: 'Social Media', ar: 'وسائل التواصل' },
    };
    return labels[category]?.[lang] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getSettingLabel = (key: string) => {
    // Convert snake_case to Title Case
    return key
      .replace(/_ar$/, ' (Arabic)')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const isArabicField = (key: string) => key.endsWith('_ar');

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
          <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {lang === 'ar' ? 'إدارة المحتوى' : 'Site Content Manager'}
          </h2>
          <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {lang === 'ar' ? 'تحرير محتوى الموقع وإدارة الطلبات' : 'Edit site content and manage applications'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className={`text-sm px-3 py-1 rounded-full ${
              theme === 'light' ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {changedCount} {lang === 'ar' ? 'تغييرات غير محفوظة' : 'unsaved changes'}
            </span>
          )}
          <button
            onClick={loadSettings}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-400 hover:bg-white/10'
            }`}
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              hasChanges
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
                : theme === 'light'
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={18} />
            {saving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'content'
              ? theme === 'light'
                ? 'border-blue-600 text-blue-600'
                : 'border-blue-500 text-blue-400'
              : theme === 'light'
              ? 'border-transparent text-gray-600 hover:text-gray-900'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe size={18} />
            {lang === 'ar' ? 'محتوى الموقع' : 'Site Content'}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'applications'
              ? theme === 'light'
                ? 'border-blue-600 text-blue-600'
                : 'border-blue-500 text-blue-400'
              : theme === 'light'
              ? 'border-transparent text-gray-600 hover:text-gray-900'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText size={18} />
            {lang === 'ar' ? 'طلبات النظام البيئي' : 'Ecosystem Applications'}
          </div>
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'applications' ? (
        <EcosystemApplications onSuccess={onSuccess} onError={onError} />
      ) : (
        <>
          {/* Search */}
          <div className="relative">
        <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
          theme === 'light' ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'ar' ? 'البحث في الإعدادات...' : 'Search settings...'}
          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${
            theme === 'light'
              ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              : 'bg-white/5 border-white/10 text-white placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
        />
      </div>

      {/* Settings Groups */}
      <div className="space-y-4">
        {groupedSettings.map(({ category, settings: categorySettings }) => (
          <div
            key={category}
            className={`rounded-xl border overflow-hidden ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
            }`}
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className={`w-full flex items-center justify-between p-4 transition-colors ${
                theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {expandedCategories.has(category) ? (
                  <ChevronDown size={20} className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
                ) : (
                  <ChevronRight size={20} className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
                )}
                <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {getCategoryLabel(category)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-gray-400'
                }`}>
                  {categorySettings.length}
                </span>
              </div>
            </button>

            {/* Category Content */}
            <AnimatePresence>
              {expandedCategories.has(category) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 pt-0 space-y-4 border-t ${
                    theme === 'light' ? 'border-gray-100' : 'border-white/5'
                  }`}>
                    {categorySettings.map((setting) => (
                      <div key={setting.key} className="space-y-2">
                        <label className={`flex items-center gap-2 text-sm font-medium ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {isArabicField(setting.key) ? (
                            <Languages size={14} className="text-amber-500" />
                          ) : (
                            <Globe size={14} className="text-blue-500" />
                          )}
                          {getSettingLabel(setting.key)}
                          {editedSettings[setting.key] !== setting.value && (
                            <span className="text-xs text-amber-500">•</span>
                          )}
                        </label>
                        {setting.description && (
                          <p className={`text-xs ${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {setting.description}
                          </p>
                        )}
                        {(setting.value?.length || 0) > 100 || setting.key.includes('subtitle') || setting.key.includes('description') || setting.key.includes('bio') ? (
                          <textarea
                            value={editedSettings[setting.key] || ''}
                            onChange={(e) => setEditedSettings(prev => ({
                              ...prev,
                              [setting.key]: e.target.value
                            }))}
                            rows={3}
                            dir={isArabicField(setting.key) ? 'rtl' : 'ltr'}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                              editedSettings[setting.key] !== setting.value
                                ? theme === 'light'
                                  ? 'border-amber-400 bg-amber-50'
                                  : 'border-amber-500/50 bg-amber-500/10'
                                : theme === 'light'
                                ? 'border-gray-300 bg-white'
                                : 'border-white/10 bg-white/5'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={editedSettings[setting.key] || ''}
                            onChange={(e) => setEditedSettings(prev => ({
                              ...prev,
                              [setting.key]: e.target.value
                            }))}
                            dir={isArabicField(setting.key) ? 'rtl' : 'ltr'}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                              editedSettings[setting.key] !== setting.value
                                ? theme === 'light'
                                  ? 'border-amber-400 bg-amber-50'
                                  : 'border-amber-500/50 bg-amber-500/10'
                                : theme === 'light'
                                ? 'border-gray-300 bg-white'
                                : 'border-white/10 bg-white/5'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {groupedSettings.length === 0 && !loading && (
        <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          {searchQuery 
            ? (lang === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found')
            : (lang === 'ar' ? 'لم يتم العثور على إعدادات. أضف إعدادات في قاعدة البيانات.' : 'No settings found. Add settings in the database.')
          }
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default SiteContentManager;
