import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * NotFound Component
 * 
 * 404 error page displayed when a route is not found.
 * 
 * @returns {JSX.Element} NotFound component
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-[#00040F]'
    }`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`max-w-2xl w-full text-center transition-colors ${
        theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>
        <div className={`text-9xl font-bold mb-4 ${
          theme === 'light' 
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400'
        }`}>
          404
        </div>
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {lang === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className={`text-xl mb-8 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {lang === 'ar' 
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.'
            : 'Sorry, the page you are looking for does not exist.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            <Home size={18} />
            {lang === 'ar' ? 'الصفحة الرئيسية' : 'Go Home'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors border ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
            }`}
          >
            <ArrowLeft size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
            {lang === 'ar' ? 'رجوع' : 'Go Back'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

