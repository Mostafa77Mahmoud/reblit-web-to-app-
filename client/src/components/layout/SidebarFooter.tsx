
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, UserPlus } from 'lucide-react';

const SidebarFooter: React.FC = () => {
  const { isGuestMode, user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="p-4 border-t border-border mt-auto">
      {isGuestMode ? (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground text-center">
            <span className="font-semibold text-shariah-green">{t('guest.mode')}</span>
            <br />
            <span className="text-xs">{t('guest.featuresAvailable')}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="default" size="sm" className="w-full" asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                {t('auth.login')}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                {t('auth.signup')}
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-sm text-muted-foreground mb-2 truncate">
            {t('auth.loggedInAs')} <span className="font-semibold text-foreground">{user?.email}</span>
          </div>
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('app.logout')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
