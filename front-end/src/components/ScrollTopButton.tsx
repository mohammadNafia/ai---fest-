import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * ScrollTopButton Component
 * 
 * Floating button that appears when user scrolls down, allowing quick return to top.
 * 
 * @returns {JSX.Element|null} ScrollTopButton component or null if not visible
 */
const ScrollTopButton: React.FC = () => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${lang === 'ar' ? 'left-6' : 'right-6'} bottom-24 z-40 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ${
        theme === 'light'
          ? 'bg-white text-slate-900 shadow-lg border border-gray-300'
          : 'bg-white/10 text-white border border-white/20'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default ScrollTopButton;

