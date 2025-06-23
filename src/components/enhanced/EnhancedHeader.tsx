
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/EnhancedThemeContext';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Languages, User2, Gavel, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoLight from '/logo-light.png';
import logoDark from '/logo-dark.png';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from '@/hooks/use-toast';

const EnhancedHeader: React.FC = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  const { currentUserRole, toggleUserRole } = useSession();
  const { toast } = useToast();
  
  // Handle theme context safely - don't destructure if undefined
  const themeContext = useTheme();
  const theme = themeContext?.theme || "light";
  const toggleTheme = themeContext?.toggleTheme || (() => {
    console.warn("Theme context not available in header");
  });

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-[51] border-b border-border/50",
        "bg-background/80 backdrop-blur-xl",
        "shadow-sm shadow-black/5"
      )}
    >
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/95 to-background/90 backdrop-blur-xl" />
      
      <div className="relative container max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between h-16 sm:h-18 md:h-20">
        {/* Logo Section */}
        <motion.div 
          className="flex items-center gap-3 md:gap-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={`logo-${theme}`}
              className="flex-shrink-0 relative"
              initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-xl rounded-full scale-150 opacity-50" />
              
              <img 
                src={theme === 'dark' ? logoDark : logoLight} 
                alt={t('app.title')} 
                className="relative h-28 sm:h-32 md:h-36 w-auto max-w-[450px] sm:max-w-[520px] md:max-w-[600px] filter drop-shadow-lg"
                style={{ 
                  objectFit: 'contain',
                  objectPosition: dir === 'rtl' ? 'right center' : 'left center',
                }}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* Controls Section */}
        <motion.div 
          className="flex items-center gap-2 md:gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Enhanced Role Toggle */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <ToggleGroup
              type="single"
              variant="outline"
              value={currentUserRole}
              onValueChange={(value) => {
                if (value && value !== currentUserRole) {
                  toggleUserRole();
                  const newRoleName = value === 'shariah_expert' ? t('role.expert') : t('role.regular');
                  toast({
                    title: t('role.changed.title'),
                    description: t('role.changed.description', { roleName: newRoleName }),
                  });
                }
              }}
              className="h-10 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm"
              aria-label="Select user role"
            >
              <ToggleGroupItem 
                value="regular_user" 
                aria-label={t('role.regular')} 
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 text-sm rounded-lg",
                  "transition-all duration-200 hover:bg-accent/50",
                  "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                )}
              >
                <User2 size={16} />
                <span className="hidden sm:inline">{t('role.regular')}</span>
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="shariah_expert" 
                aria-label={t('role.expert')} 
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 text-sm rounded-lg",
                  "transition-all duration-200 hover:bg-primary/10",
                  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                  "data-[state=on]:shadow-lg data-[state=on]:shadow-primary/25"
                )}
              >
                <Gavel size={16} />
                <span className="hidden sm:inline">{t('role.expert')}</span>
                {currentUserRole === 'shariah_expert' && (
                  <Sparkles size={14} className="animate-pulse" />
                )}
              </ToggleGroupItem>
            </ToggleGroup>
          </motion.div>

          {/* Enhanced Language Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className={cn(
                "flex items-center gap-2 px-3 sm:px-4 py-2 h-10",
                "rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm",
                "hover:bg-accent/80 hover:border-accent/50 hover:shadow-md",
                "transition-all duration-200 group"
              )}
              aria-label={t('app.language.toggle')}
            >
              <Languages size={16} className="group-hover:rotate-12 transition-transform duration-200" />
              <span className="hidden sm:inline text-sm font-medium">
                {language === 'en' ? t('app.language.ar') : t('app.language.en')}
              </span>
            </Button>
          </motion.div>
          
          {/* Enhanced Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={cn(
                "w-10 h-10 rounded-xl p-0",
                "border border-border/50 bg-background/50 backdrop-blur-sm",
                "hover:bg-accent/80 hover:border-accent/50 hover:shadow-md",
                "transition-all duration-200 group relative overflow-hidden"
              )}
              aria-label={t('app.theme')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  {theme === 'dark' ? (
                    <Sun size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                  ) : (
                    <Moon size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default EnhancedHeader;
