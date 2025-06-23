
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import SidebarContent from '@/components/SidebarContent';
import SidebarFooter from './SidebarFooter';

interface EnhancedSidebarContainerProps {
  isOpen: boolean;
  isMobile: boolean;
  dir: 'ltr' | 'rtl';
  onClose?: () => void;
}

const EnhancedSidebarContainer: React.FC<EnhancedSidebarContainerProps> = ({ 
  isOpen, 
  isMobile, 
  dir,
  onClose 
}) => {
  const sidebarVariants = {
    open: {
      width: isMobile ? '320px' : '280px',
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }
    },
    closed: {
      width: 0,
      x: dir === 'rtl' ? 320 : -320,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.1 }
      }
    }
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          {isMobile && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />
          )}
          
          {/* Sidebar */}
          <motion.div
            key="enhanced-sidebar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={cn(
              "fixed inset-y-0 z-40 h-screen",
              "bg-background/95 backdrop-blur-xl",
              "border-border/50",
              "shadow-2xl shadow-black/10",
              dir === 'rtl' ? 'right-0 border-l-2' : 'left-0 border-r-2'
            )}
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl" />
            
            {/* Content */}
            <div className="relative h-full w-full flex flex-col">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                <div className="p-6">
                  <SidebarContent />
                </div>
              </div>
              
              {/* Footer */}
              <div className="border-t border-border/50 bg-background/80">
                <SidebarFooter />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnhancedSidebarContainer;
