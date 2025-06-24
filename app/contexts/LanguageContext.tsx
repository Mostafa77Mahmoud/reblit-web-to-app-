
import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'home.goodMorning': 'Good Morning',
    'home.goodAfternoon': 'Good Afternoon',
    'home.goodEvening': 'Good Evening',
    'home.guestUser': 'Guest User',
    'home.scanDocument': 'Scan Document',
    'home.uploadFile': 'Upload File',
    'home.recentAnalyses': 'Recent Analyses',
    'home.viewAll': 'View All',
    'home.noAnalyses': 'No analyses yet',
    'home.startFirst': 'Start your first analysis',
    'home.totalAnalyses': 'Total Analyses',
    'home.complianceRate': 'Compliance Rate',
    'home.thisMonth': 'This Month',
    'profile.profile': 'Profile',
    'profile.temporaryAccount': 'Temporary Account',
    'auth.logout': 'Logout',
    'onboarding.welcome': 'Welcome to Shariaa Analyzer',
    'onboarding.subtitle': 'AI-powered Islamic compliance analysis',
    'onboarding.getStarted': 'Get Started',
    'onboarding.next': 'Next',
    'onboarding.skip': 'Skip',
    'onboarding.done': 'Done',
  },
  ar: {
    'home.goodMorning': 'صباح الخير',
    'home.goodAfternoon': 'مساء الخير',
    'home.goodEvening': 'مساء الخير',
    'home.guestUser': 'مستخدم ضيف',
    'home.scanDocument': 'مسح المستند',
    'home.uploadFile': 'رفع ملف',
    'home.recentAnalyses': 'التحليلات الأخيرة',
    'home.viewAll': 'عرض الكل',
    'home.noAnalyses': 'لا توجد تحليلات بعد',
    'home.startFirst': 'ابدأ تحليلك الأول',
    'home.totalAnalyses': 'إجمالي التحليلات',
    'home.complianceRate': 'معدل الامتثال',
    'home.thisMonth': 'هذا الشهر',
    'profile.profile': 'الملف الشخصي',
    'profile.temporaryAccount': 'حساب مؤقت',
    'auth.logout': 'تسجيل الخروج',
    'onboarding.welcome': 'مرحباً بك في محلل الشريعة',
    'onboarding.subtitle': 'تحليل الامتثال الإسلامي بالذكاء الاصطناعي',
    'onboarding.getStarted': 'ابدأ الآن',
    'onboarding.next': 'التالي',
    'onboarding.skip': 'تخطي',
    'onboarding.done': 'تم',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      dir: language === 'ar' ? 'rtl' : 'ltr',
      setLanguage,
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
