
// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '../translations';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const detectInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('app-language');
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        return savedLanguage;
      }
      const browserLang = navigator.language.substring(0, 2);
      return browserLang === 'ar' ? 'ar' : 'en';
    }
    return 'en'; // Default for non-browser environments
  };
  
  const [language, setLanguage] = useState<Language>(detectInitialLanguage());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-language', language);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langTranslations = translations[language] as Record<string, string>;
    const fallbackTranslations = translations.en as Record<string, string>;
    let translation = langTranslations?.[key] || fallbackTranslations?.[key] || key;

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const value = params[paramKey];
        if (value !== undefined) {
          translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
        }
      });
    }
    return translation;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
