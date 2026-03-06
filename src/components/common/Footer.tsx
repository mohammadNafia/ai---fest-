import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SummitLogo } from '@/components/SummitLogo';

// Custom Telegram SVG icon (lucide doesn't have one)
const TelegramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 1 0 24 12 12.014 12.014 0 0 0 11.944 0zm4.962 7.224-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.24-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.829.941z"/>
  </svg>
);

// Custom Instagram SVG icon
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/aidevfest/',
      icon: <Linkedin size={18} />,
      hoverColor: 'hover:bg-[#0077B5]',
    },
    {
      label: 'Telegram',
      href: 'https://t.me/AiDevFest',
      icon: <TelegramIcon size={18} />,
      hoverColor: 'hover:bg-[#229ED9]',
    },
    {
      label: 'Instagram',
      href: 'https://instagram.com/aidevfest',
      icon: <InstagramIcon size={18} />,
      hoverColor: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCB045]',
    },
  ];

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
              }`}>Ai Developers Festival</span>
            </div>
            <p className={`max-w-sm mb-6 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {lang === 'ar'
                ? 'أكبر تجمع لمحترفي وباحثي ومحبي الذكاء الاصطناعي في العراق.'
                : 'The largest gathering of AI professionals, researchers, and enthusiasts in Iraq.'}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:text-white hover:scale-110 ${
                    theme === 'light'
                      ? `bg-gray-200 text-gray-700 ${hoverColor}`
                      : `bg-white/5 text-white ${hoverColor}`
                  }`}
                >
                  {icon}
                </a>
              ))}
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
                  {lang === 'ar' ? 'البيئة التقنية' : 'Ecosystem'}
                </Link>
              </li>
              <li>
                <a
                  href="https://forms.gle/62zB4DukHodznX9K8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  {lang === 'ar' ? 'التسجيل' : 'Apply Here'}
                </a>
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
            </ul>
          </div>
        </div>
        
        <div className={`border-t pt-8 text-center text-sm ${
          theme === 'light'
            ? 'border-gray-200 text-gray-500'
            : 'border-white/5 text-gray-600'
        }`}>
          <p>
            &copy; {currentYear} {lang === 'ar' ? 'مهرجان مطوري الذكاء الاصطناعي' : 'Ai Developers Festival'}. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
