
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedSidebarToggle from './layout/EnhancedSidebarToggle';
import EnhancedSidebarContainer from './layout/EnhancedSidebarContainer';
import EnhancedMainArea from './layout/EnhancedMainArea';

const MainContent: React.FC = () => {
  const { dir, language } = useLanguage();
  const isMobile = useIsMobile();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(!isMobile);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebarHandler = useCallback(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsDesktopSidebarOpen(prev => !prev);
    }
  }, [isMobile]);

  const closeMobileSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.body.classList.toggle('rtl', dir === 'rtl');
    document.body.classList.toggle('ltr', dir !== 'rtl');
  }, [dir, language]);

  const isSidebarOpen = isMobile ? isMobileSidebarOpen : isDesktopSidebarOpen;

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <SidebarProvider defaultOpen={!isMobile}>
        <div className={cn(
          "flex min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-background via-background to-accent/5",
          dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'
        )}>
          <EnhancedSidebarToggle
            isOpen={isSidebarOpen}
            isMobile={isMobile}
            dir={dir as 'ltr' | 'rtl'}
            onClick={toggleSidebarHandler}
          />
          <EnhancedSidebarContainer
            isOpen={isSidebarOpen}
            isMobile={isMobile}
            dir={dir as 'ltr' | 'rtl'}
            onClose={closeMobileSidebar}
          />
          <EnhancedMainArea
            isSidebarOpen={isSidebarOpen}
            isMobile={isMobile}
            dir={dir as 'ltr' | 'rtl'}
          />
        </div>
      </SidebarProvider>
    </>
  );
};

export default MainContent;
