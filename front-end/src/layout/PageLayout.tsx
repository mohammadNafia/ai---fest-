import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/Chatbot';
import ScrollTopButton from '@/components/ScrollTopButton';

interface PageLayoutProps {
  children: React.ReactNode;
}

/**
 * PageLayout - Main layout wrapper for public pages
 * Includes Navbar, Footer, Chatbot, and ScrollTopButton
 */
export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-gray-50 text-gray-900'
        : 'bg-[#00040F] text-white'
    } selection:bg-blue-600 selection:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <Navbar />
      <main className="animate-fade-in">
        {children}
      </main>
      <Footer />
      <ScrollTopButton />
      <Chatbot />
    </div>
  );
};

