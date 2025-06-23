
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import SidebarContent from '@/components/SidebarContent';
import SidebarFooter from './SidebarFooter';

interface SidebarContainerProps {
  isOpen: boolean;
  isMobile: boolean;
  dir: 'ltr' | 'rtl';
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({ isOpen, isMobile, dir }) => {
  const sidebarVariants = {
    open: {
      width: isMobile ? '280px' : '260px',
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        opacity: { duration: 0.2 }
      }
    },
    closed: {
      width: 0,
      x: dir === 'rtl' ? 280 : -280,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        opacity: { duration: 0.1 }
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="sidebar-animated"
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          className={cn(
            "fixed inset-y-0 z-40 h-screen shadow-lg",
            "bg-background dark:bg-background",
            "border-border",
            dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
          )}
        >
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <SidebarContent />
              </div>
            </div>
            <SidebarFooter />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarContainer;
