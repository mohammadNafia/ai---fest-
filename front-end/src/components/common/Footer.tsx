import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SummitLogo } from '@/components/SummitLogo';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t pt-20 pb-10 transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-gray-50 border-gray-200'
        : 'bg-[#000208] border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <SummitLogo />
              <span className={`font-bold text-2xl ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>BAGHDAD AI</span>
            </div>
            <p className={`max-w-sm mb-6 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {lang === 'ar' 
                ? 'أكبر تجمع لمحترفي وباحثي ومحبي الذكاء الاصطناعي في العراق.'
                : 'The largest gathering of AI professionals, researchers, and enthusiasts in Iraq.'}
            </p>
            <div className="flex gap-4">
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
                    : 'bg-white/5 text-white hover:bg-blue-600'
                }`}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </button>
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
                    : 'bg-white/5 text-white hover:bg-blue-600'
                }`}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </button>
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
                    : 'bg-white/5 text-white hover:bg-blue-600'
                }`}
                aria-label="Website"
              >
                <Globe size={18} />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className={`font-bold mb-6 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className={`space-y-4 text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'من نحن' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/#speakers" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'المتحدثون' : 'Speakers'}
                </Link>
              </li>
              <li>
                <Link to="/agenda" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'الجدول الزمني' : 'Agenda'}
                </Link>
              </li>
              <li>
                <Link to="/ecosystem" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'الرعاية' : 'Sponsorship'}
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'التسجيل' : 'Register'}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className={`font-bold mb-6 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {lang === 'ar' ? 'قانوني' : 'Legal'}
            </h4>
            <ul className={`space-y-4 text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <li>
                <a href="/privacy" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
                </a>
              </li>
              <li>
                <a href="/conduct" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'قواعد السلوك' : 'Code of Conduct'}
                </a>
              </li>
              <li>
                <Link to="/signin" className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t pt-8 text-center text-sm ${
          theme === 'light'
            ? 'border-gray-200 text-gray-500'
            : 'border-white/5 text-gray-600'
        }`}>
          <p>
            &copy; {currentYear} {lang === 'ar' ? 'قمة بغداد للذكاء الاصطناعي' : 'Baghdad AI Summit'}. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          </p>
          <p className="mt-2">
            {lang === 'ar' 
              ? `تم التطوير باستخدام React و TypeScript - ${currentYear}`
              : `Built with React & TypeScript - ${currentYear}`
            }
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

