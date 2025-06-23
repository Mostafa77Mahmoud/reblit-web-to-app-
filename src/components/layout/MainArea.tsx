
import React from 'react';
import Header from '@/components/Header';
import MainPageContent from './MainPageContent';

interface MainAreaProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  dir: 'ltr' | 'rtl';
}

const MainArea: React.FC<MainAreaProps> = ({ isSidebarOpen, isMobile, dir }) => {
  return (
    <div
      className="flex-1 flex flex-col min-w-0"
      style={{
        transition: 'margin 0.3s ease-in-out',
        marginLeft: (isSidebarOpen && dir !== 'rtl')
          ? isMobile ? '280px' : '260px'
          : 0,
        marginRight: (isSidebarOpen && dir === 'rtl')
          ? isMobile ? '280px' : '260px'
          : 0,
      }}
    >
      <Header />
      <MainPageContent />
    </div>
  );
};

export default MainArea;
