import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, FileText, Settings, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="h-5 w-5" />,
    path: '/mobile',
  },
  {
    id: 'scan',
    label: 'Scan',
    icon: <Camera className="h-5 w-5" />,
    path: '/mobile/scan',
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: <FileText className="h-5 w-5" />,
    path: '/mobile/contracts',
  },
  {
    id: 'history',
    label: 'History',
    icon: <History className="h-5 w-5" />,
    path: '/mobile/history',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    path: '/mobile/settings',
  },
];

export const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 safe-area-padding-bottom">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.path)}
            className={cn(
              'flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1 relative',
              isActive(item.path)
                ? 'text-shariah-green'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isActive(item.path) && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-shariah-green/10 rounded-lg"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <div className="relative z-10 flex flex-col items-center">
              {item.icon}
              <span className="text-xs font-medium mt-1 truncate">
                {item.label}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};