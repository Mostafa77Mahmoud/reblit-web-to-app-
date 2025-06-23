
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import MainPageContent from './MainPageContent';

interface EnhancedMainAreaProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  dir: 'ltr' | 'rtl';
}

const EnhancedMainArea: React.FC<EnhancedMainAreaProps> = ({ 
  isSidebarOpen, 
  isMobile, 
  dir 
}) => {
  const marginValue = isSidebarOpen ? (isMobile ? '320px' : '280px') : '0px';
  
  return (
    <motion.div
      className="flex-1 flex flex-col min-w-0 relative"
      animate={{
        marginLeft: (isSidebarOpen && dir !== 'rtl') ? marginValue : '0px',
        marginRight: (isSidebarOpen && dir === 'rtl') ? marginValue : '0px',
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <MainPageContent />
      </div>
    </motion.div>
  );
};

export default EnhancedMainArea;
