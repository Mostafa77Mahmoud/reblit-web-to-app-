
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { SidebarOpen, SidebarClose } from 'lucide-react';

interface SidebarToggleProps {
  isOpen: boolean;
  isMobile: boolean;
  dir: 'ltr' | 'rtl';
  onClick: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, isMobile, dir, onClick }) => {
  const { t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn(
        "fixed z-[60] flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm border-border shadow-md",
        "transition-all duration-300 rounded-md hover:bg-accent",
        isMobile ? "w-10 h-10 top-2.5" : "w-9 h-9 top-[calc(theme(spacing.16)_-_0.5rem)]",
        dir === 'rtl'
          ? (isOpen
            ? isMobile ? "right-[280px] translate-x-1/2" : "right-[260px] translate-x-1/2"
            : "right-3")
          : (isOpen
            ? isMobile ? "left-[280px] -translate-x-1/2" : "left-[260px] -translate-x-1/2"
            : "left-3"),
        "hover:scale-110 active:scale-95"
      )}
      aria-label={t('sidebar.toggle')}
    >
      {isOpen
        ? (dir === 'rtl' ? <SidebarOpen size={18} /> : <SidebarClose size={18} />)
        : (dir === 'rtl' ? <SidebarClose size={18} /> : <SidebarOpen size={18} />)}
    </Button>
  );
};

export default SidebarToggle;
