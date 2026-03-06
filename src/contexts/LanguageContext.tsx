import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { CONTENT } from '@/data/translations';

type Language = 'en' | 'ar';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof CONTENT.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  // Always start with English strictly
  const [lang, setLang] = useState<Language>('en');

  // Sync with localStorage only after mount
  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'ar') {
      setLang('ar');
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = CONTENT[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
