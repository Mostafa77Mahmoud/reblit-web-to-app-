import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Camera, 
  History, 
  User, 
  Search,
  FileText,
  Settings,
  Bell
} from 'lucide-react';

interface MobileNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  gradient?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'search',
      label: 'Search',
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: 'camera',
      label: 'Scan',
      icon: <Camera className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'history',
      label: 'History',
      icon: <History className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50">
      <div className="flex items-center justify-around px-4 py-2 safe-area-bottom">
        {navItems.map((item, index) => {
          const isActive = currentScreen === item.id;
          const isCenterItem = item.gradient;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                isCenterItem
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl`
                  : isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              } ${isCenterItem ? 'px-4 py-4 -mt-2' : 'px-3 py-2'}`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: isCenterItem ? 1.05 : 1.02 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {/* Active indicator */}
              {isActive && !isCenterItem && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon with scale animation */}
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  y: isActive && !isCenterItem ? -2 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {item.icon}
              </motion.div>

              {/* Label */}
              <motion.span
                className={`text-xs font-medium mt-1 ${
                  isCenterItem ? 'text-white' : ''
                } ${isActive && !isCenterItem ? 'font-semibold' : ''}`}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  opacity: 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {item.label}
              </motion.span>

              {/* Notification badge for certain items */}
              {(item.id === 'history' || item.id === 'profile') && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                />
              )}

              {/* Ripple effect */}
              {isCenterItem && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-safe-bottom bg-background/95" />
    </div>
  );
};

export default MobileNavigation;