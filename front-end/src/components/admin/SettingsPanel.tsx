import React, { useState, useEffect } from 'react';
import { Settings, ToggleLeft, ToggleRight, Loader2, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { settingsService } from '@/services/settingsService';

interface SettingsPanelProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSuccess, onError }) => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registrationsOpen, setRegistrationsOpen] = useState<boolean>(true);
  const [showSpeakers, setShowSpeakers] = useState<boolean>(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [regOpen, showSpeakersResult] = await Promise.all([
        settingsService.isRegistrationOpen(),
        settingsService.isShowSpeakers(),
      ]);
      setRegistrationsOpen(regOpen);
      setShowSpeakers(showSpeakersResult);
    } catch (err) {
      console.error('Error loading settings:', err);
      onError(lang === 'ar' ? 'فشل تحميل الإعدادات' : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegistrations = async (value: boolean) => {
    setSaving(true);
    try {
      const result = await settingsService.setRegistrationOpen(value);
      if (result.success) {
        setRegistrationsOpen(value);
        onSuccess(
          lang === 'ar'
            ? `التسجيلات ${value ? 'مفتوحة' : 'مغلقة'} بنجاح`
            : `Registrations ${value ? 'opened' : 'closed'} successfully`
        );
      } else {
        onError(result.error || (lang === 'ar' ? 'فشل تحديث الإعدادات' : 'Failed to update settings'));
      }
    } catch (err) {
      console.error('Error updating registrations setting:', err);
      onError(lang === 'ar' ? 'فشل تحديث الإعدادات' : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleShowSpeakers = async (value: boolean) => {
    setSaving(true);
    try {
      const result = await settingsService.setShowSpeakers(value);
      if (result.success) {
        setShowSpeakers(value);
        onSuccess(
          lang === 'ar'
            ? `المتحدثون ${value ? 'مُعرضون' : 'مخفيون'} بنجاح`
            : `Speakers ${value ? 'shown' : 'hidden'} successfully`
        );
      } else {
        onError(result.error || (lang === 'ar' ? 'فشل تحديث الإعدادات' : 'Failed to update settings'));
      }
    } catch (err) {
      console.error('Error updating show speakers setting:', err);
      onError(lang === 'ar' ? 'فشل تحديث الإعدادات' : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-20 ${
        theme === 'light' ? 'bg-white' : 'bg-white/5'
      } rounded-xl border ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
        <div className="text-center space-y-4">
          <Loader2 size={40} className={`animate-spin mx-auto ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            {lang === 'ar' ? 'جاري تحميل الإعدادات...' : 'Loading settings...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl border transition-colors ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            theme === 'light' ? 'bg-blue-100' : 'bg-blue-600/20'
          }`}>
            <Settings size={20} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {lang === 'ar' ? 'إعدادات الموقع' : 'Website Settings'}
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {lang === 'ar' ? 'التحكم في إعدادات الموقع العامة' : 'Control public website settings'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Registrations Open/Closed Toggle */}
          <div className={`p-5 rounded-lg border transition-colors ${
            theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {lang === 'ar' ? 'التسجيلات مفتوحة' : 'Registrations Open'}
                </h3>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {lang === 'ar' 
                    ? 'عند الإغلاق، لن يتمكن المستخدمون من التسجيل. سيتم إخفاء نماذج التسجيل.'
                    : 'When closed, users cannot register. Registration forms will be hidden.'}
                </p>
                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  registrationsOpen
                    ? theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'
                    : theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-400'
                }`}>
                  {registrationsOpen 
                    ? (lang === 'ar' ? '✅ مفتوحة' : '✅ Open')
                    : (lang === 'ar' ? '❌ مغلقة' : '❌ Closed')
                  }
                </div>
              </div>
              <button
                onClick={() => handleToggleRegistrations(!registrationsOpen)}
                disabled={saving}
                className={`ml-6 relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  registrationsOpen
                    ? theme === 'light' ? 'bg-green-600 focus:ring-green-500' : 'bg-green-600 focus:ring-green-400'
                    : theme === 'light' ? 'bg-gray-300 focus:ring-gray-400' : 'bg-gray-600 focus:ring-gray-500'
                } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    registrationsOpen ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Show Speakers Toggle */}
          <div className={`p-5 rounded-lg border transition-colors ${
            theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {lang === 'ar' ? 'عرض المتحدثين' : 'Show Speakers'}
                </h3>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {lang === 'ar' 
                    ? 'عند الإغلاق، سيتم إخفاء قسم المتحدثين من الصفحة الرئيسية.'
                    : 'When disabled, the speakers section will be hidden from the homepage.'}
                </p>
                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  showSpeakers
                    ? theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'
                    : theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-400'
                }`}>
                  {showSpeakers 
                    ? (lang === 'ar' ? '✅ معروض' : '✅ Visible')
                    : (lang === 'ar' ? '❌ مخفي' : '❌ Hidden')
                  }
                </div>
              </div>
              <button
                onClick={() => handleToggleShowSpeakers(!showSpeakers)}
                disabled={saving}
                className={`ml-6 relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  showSpeakers
                    ? theme === 'light' ? 'bg-green-600 focus:ring-green-500' : 'bg-green-600 focus:ring-green-400'
                    : theme === 'light' ? 'bg-gray-300 focus:ring-gray-400' : 'bg-gray-600 focus:ring-gray-500'
                } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    showSpeakers ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
