
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedSidebarToggleProps {
  isOpen: boolean;
  isMobile: boolean;
  dir: 'ltr' | 'rtl';
  onClick: () => void;
}

const EnhancedSidebarToggle: React.FC<EnhancedSidebarToggleProps> = ({ 
  isOpen, 
  isMobile, 
  dir, 
  onClick 
}) => {
  const { t } = useLanguage();

  const getIcon = () => {
    if (isMobile) {
      return isOpen ? <X size={20} /> : <Menu size={20} />;
    }
    
    if (dir === 'rtl') {
      return isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />;
    }
    
    return isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed z-[60] transition-all duration-300",
        isMobile ? "top-3" : "top-[calc(theme(spacing.20)_-_1rem)]",
        dir === 'rtl'
          ? (isOpen
            ? isMobile ? "right-[280px] -translate-x-1/2" : "right-[260px] -translate-x-1/2"
            : "right-4")
          : (isOpen
            ? isMobile ? "left-[280px] translate-x-1/2" : "left-[260px] translate-x-1/2"
            : "left-4")
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        className={cn(
          "w-11 h-11 rounded-xl shadow-lg border-2",
          "bg-background/95 backdrop-blur-md",
          "border-border/50 hover:border-primary/30",
          "hover:bg-accent/80 hover:shadow-xl",
          "transition-all duration-300 ease-out",
          "hover:scale-110 active:scale-95",
          "group relative overflow-hidden"
        )}
        aria-label={t('sidebar.toggle')}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div
          key={`${isOpen}-${isMobile}-${dir}`}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {getIcon()}
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default EnhancedSidebarToggle;
