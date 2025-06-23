
import React, { useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ContractProvider } from '@/contexts/ContractContext';
import { useAuth } from '@/contexts/AuthContext';
import MainContent from '@/components/MainContent';
import { motion } from 'framer-motion';

/**
 * Home Page Component
 * 
 * Main application page that provides the full Shariaa analysis experience
 * Features:
 * - Document upload and analysis
 * - Compliance checking
 * - Expert review mode
 * - Multi-language support (Arabic/English)
 * - Dark/Light theme
 * - Mobile responsive design
 */
const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Set page title and meta tags on component mount
  useEffect(() => {
    document.title = 'Shariaa Analyzer - AI-Powered Islamic Compliance Analysis';
    
    // Add meta tags for better SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze contract documents for Shariaa compliance with AI-powered insights. Get instant feedback on Islamic financial compliance.');
    }
    
    // Add RTL support meta tag
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no');
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="rtl-aware-root min-h-screen" // Add class for RTL awareness
    >
      <LanguageProvider>
        <ContractProvider>
          <MainContent />
        </ContractProvider>
      </LanguageProvider>
    </motion.div>
  );
};

export default HomePage;
