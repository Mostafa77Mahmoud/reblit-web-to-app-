
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Home Screen
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
    'home.yourAnalytics': 'Your Analytics',

    // Camera Screen
    'camera.scanDocument': 'Scan Document',
    'camera.position': 'Position the document within the frame',
    'camera.gallery': 'Gallery',
    'camera.files': 'Files',
    'camera.tips': 'Scanning Tips',
    'camera.lighting': '• Ensure good lighting',
    'camera.flat': '• Keep document flat and straight',
    'camera.shadows': '• Avoid shadows and glare',
    'camera.analyzing': 'Analyzing document...',
    'camera.processing': 'This may take a few moments',

    // Results Screen
    'results.title': 'Analysis Results',
    'results.excellent': 'Excellent',
    'results.good': 'Good',
    'results.needsReview': 'Needs Review',
    'results.totalTerms': 'Total Terms',
    'results.compliant': 'Compliant',
    'results.issues': 'Issues',
    'results.generateCompliant': 'Generate Compliant Version',
    'results.download': 'Download',
    'results.share': 'Share',
    'results.detailedAnalysis': 'Detailed Analysis',
    'results.compliantTerm': 'Compliant',
    'results.nonCompliant': 'Non-Compliant',
    'results.issue': 'Issue:',
    'results.reference': 'Reference:',
    'results.suggestion': 'Suggested Alternative:',
    'results.expertReview': 'Need Expert Review?',
    'results.expertDescription': 'Get professional Islamic finance expert review for complex terms',
    'results.requestExpert': 'Request Expert Review',

    // History Screen
    'history.title': 'Analysis History',
    'history.empty': 'No analyses yet',
    'history.emptyDesc': 'Your analysis history will appear here',
    'history.startAnalysis': 'Start Analysis',
    'history.searchPlaceholder': 'Search analyses...',
    'history.sortBy': 'Sort by:',
    'history.newest': 'Newest',
    'history.oldest': 'Oldest',
    'history.compliance': 'Compliance',

    // Profile Screen
    'profile.title': 'Profile',
    'profile.temporaryAccount': 'Temporary Account',
    'profile.settings': 'Settings',
    'profile.language': 'Language',
    'profile.theme': 'Theme',
    'profile.light': 'Light',
    'profile.dark': 'Dark',
    'profile.about': 'About',
    'profile.version': 'Version',
    'profile.help': 'Help & Support',
    'profile.privacy': 'Privacy Policy',
    'profile.terms': 'Terms of Service',

    // Authentication
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.username': 'Username',
    'auth.guestMode': 'Continue as Guest',

    // Terms and Analysis
    'term.compliant': 'Sharia Compliant',
    'term.nonCompliant': 'Non-Compliant',
    'term.askQuestion': 'Ask Question',
    'term.questionPlaceholder': 'Ask about this term...',
    'term.send': 'Send',
    'term.processing': 'Processing...',
    'term.confirm': 'Confirm Changes',
    'term.use': 'Use This Suggestion',

    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.history': 'History',
    'nav.profile': 'Profile',

    // Onboarding
    'onboarding.welcome': 'Welcome to Shariaa Analyzer',
    'onboarding.subtitle': 'AI-powered Islamic compliance analysis',
    'onboarding.getStarted': 'Get Started',
    'onboarding.next': 'Next',
    'onboarding.skip': 'Skip',
    'onboarding.done': 'Done',
    'onboarding.step1.title': 'Scan Documents',
    'onboarding.step1.desc': 'Use your camera to scan contracts or upload files',
    'onboarding.step2.title': 'AI Analysis',
    'onboarding.step2.desc': 'Get instant compliance scores and recommendations',
    'onboarding.step3.title': 'Expert Review',
    'onboarding.step3.desc': 'Request expert review for complex terms',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.retry': 'Retry',
  },
  ar: {
    // Home Screen
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
    'home.yourAnalytics': 'تحليلاتك',

    // Camera Screen
    'camera.scanDocument': 'مسح المستند',
    'camera.position': 'ضع المستند داخل الإطار',
    'camera.gallery': 'المعرض',
    'camera.files': 'الملفات',
    'camera.tips': 'نصائح المسح',
    'camera.lighting': '• تأكد من الإضاءة الجيدة',
    'camera.flat': '• احتفظ بالمستند مسطحاً ومستقيماً',
    'camera.shadows': '• تجنب الظلال والوهج',
    'camera.analyzing': 'تحليل المستند...',
    'camera.processing': 'قد يستغرق هذا بضع لحظات',

    // Results Screen
    'results.title': 'نتائج التحليل',
    'results.excellent': 'ممتاز',
    'results.good': 'جيد',
    'results.needsReview': 'يحتاج مراجعة',
    'results.totalTerms': 'إجمالي البنود',
    'results.compliant': 'متوافق',
    'results.issues': 'مشاكل',
    'results.generateCompliant': 'إنشاء نسخة متوافقة',
    'results.download': 'تحميل',
    'results.share': 'مشاركة',
    'results.detailedAnalysis': 'تحليل مفصل',
    'results.compliantTerm': 'متوافق',
    'results.nonCompliant': 'غير متوافق',
    'results.issue': 'المشكلة:',
    'results.reference': 'المرجع:',
    'results.suggestion': 'البديل المقترح:',
    'results.expertReview': 'تحتاج مراجعة خبير؟',
    'results.expertDescription': 'احصل على مراجعة خبير في التمويل الإسلامي للبنود المعقدة',
    'results.requestExpert': 'طلب مراجعة خبير',

    // History Screen
    'history.title': 'تاريخ التحليلات',
    'history.empty': 'لا توجد تحليلات بعد',
    'history.emptyDesc': 'ستظهر تحليلاتك هنا',
    'history.startAnalysis': 'ابدأ التحليل',
    'history.searchPlaceholder': 'البحث في التحليلات...',
    'history.sortBy': 'ترتيب حسب:',
    'history.newest': 'الأحدث',
    'history.oldest': 'الأقدم',
    'history.compliance': 'الامتثال',

    // Profile Screen
    'profile.title': 'الملف الشخصي',
    'profile.temporaryAccount': 'حساب مؤقت',
    'profile.settings': 'الإعدادات',
    'profile.language': 'اللغة',
    'profile.theme': 'المظهر',
    'profile.light': 'فاتح',
    'profile.dark': 'داكن',
    'profile.about': 'حول',
    'profile.version': 'الإصدار',
    'profile.help': 'المساعدة والدعم',
    'profile.privacy': 'سياسة الخصوصية',
    'profile.terms': 'شروط الخدمة',

    // Authentication
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.username': 'اسم المستخدم',
    'auth.guestMode': 'المتابعة كضيف',

    // Terms and Analysis
    'term.compliant': 'متوافق مع الشريعة',
    'term.nonCompliant': 'غير متوافق',
    'term.askQuestion': 'اسأل سؤال',
    'term.questionPlaceholder': 'اسأل عن هذا البند...',
    'term.send': 'إرسال',
    'term.processing': 'معالجة...',
    'term.confirm': 'تأكيد التغييرات',
    'term.use': 'استخدم هذا الاقتراح',

    // Navigation
    'nav.home': 'الرئيسية',
    'nav.search': 'البحث',
    'nav.history': 'التاريخ',
    'nav.profile': 'الملف الشخصي',

    // Onboarding
    'onboarding.welcome': 'مرحباً بك في محلل الشريعة',
    'onboarding.subtitle': 'تحليل الامتثال الإسلامي بالذكاء الاصطناعي',
    'onboarding.getStarted': 'ابدأ الآن',
    'onboarding.next': 'التالي',
    'onboarding.skip': 'تخطي',
    'onboarding.done': 'تم',
    'onboarding.step1.title': 'مسح المستندات',
    'onboarding.step1.desc': 'استخدم الكاميرا لمسح العقود أو رفع الملفات',
    'onboarding.step2.title': 'تحليل الذكاء الاصطناعي',
    'onboarding.step2.desc': 'احصل على درجات الامتثال الفورية والتوصيات',
    'onboarding.step3.title': 'مراجعة الخبراء',
    'onboarding.step3.desc': 'اطلب مراجعة الخبراء للبنود المعقدة',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تحرير',
    'common.back': 'رجوع',
    'common.close': 'إغلاق',
    'common.retry': 'إعادة المحاولة',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('shariaa_language') as 'en' | 'ar';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    localStorage.setItem('shariaa_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{
      language,
      dir: isRTL ? 'rtl' : 'ltr',
      setLanguage: handleSetLanguage,
      t,
      isRTL,
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
