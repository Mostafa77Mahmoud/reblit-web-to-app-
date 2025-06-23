import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft,
  User,
  Settings,
  Bell,
  Shield,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  LogOut,
  Edit3,
  Crown,
  Zap,
  FileText,
  TrendingUp,
  Award,
  Calendar,
  Smartphone,
  Camera,
  Download,
  Share
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/EnhancedThemeContext';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

interface UserStats {
  totalAnalyses: number;
  complianceRate: number;
  averageScore: number;
  joinDate: string;
  lastActive: string;
  tier: 'Basic' | 'Premium' | 'Enterprise';
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onNavigate }) => {
  const { t, dir, language, setLanguage } = useLanguage();
  const { user, logout, isGuestMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const userStats: UserStats = {
    totalAnalyses: 47,
    complianceRate: 87,
    averageScore: 84,
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    tier: 'Premium'
  };

  const achievements = [
    { id: 1, name: 'First Analysis', icon: '🎯', unlocked: true },
    { id: 2, name: 'Compliance Expert', icon: '🛡️', unlocked: true },
    { id: 3, name: 'Scanner Pro', icon: '📱', unlocked: true },
    { id: 4, name: 'Monthly Streak', icon: '🔥', unlocked: false },
    { id: 5, name: 'Perfect Score', icon: '⭐', unlocked: false },
    { id: 6, name: 'Power User', icon: '⚡', unlocked: false }
  ];

  const settingsItems = [
    {
      category: 'Preferences',
      items: [
        {
          label: 'Dark Mode',
          description: 'Enable dark mode theme',
          action: (
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          )
        },
        {
          label: 'Language',
          description: 'Change app language',
          action: (
            <Button variant="ghost" size="sm">
              <Globe className="w-4 h-4 mr-2" />
              {language === 'en' ? 'English' : 'العربية'}
            </Button>
          )
        },
        {
          label: 'Push Notifications',
          description: 'Receive analysis updates',
          action: <Switch defaultChecked />
        }
      ]
    },
    {
      category: 'Privacy & Security',
      items: [
        {
          label: 'Data Privacy',
          description: 'Manage your data and privacy settings',
          action: <Button variant="ghost" size="sm">Manage</Button>
        },
        {
          label: 'Camera Access',
          description: 'Allow camera for document scanning',
          action: <Switch defaultChecked />
        },
        {
          label: 'Offline Storage',
          description: 'Store analyses locally on device',
          action: <Switch defaultChecked />
        }
      ]
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic': return 'from-gray-500 to-slate-500';
      case 'Premium': return 'from-purple-500 to-pink-500';
      case 'Enterprise': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Basic': return <User className="w-4 h-4" />;
      case 'Premium': return <Crown className="w-4 h-4" />;
      case 'Enterprise': return <Zap className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5" dir={dir}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={onBack}
                className="p-2 rounded-full bg-card shadow-lg"
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-card via-card to-accent/5 border-border/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 shadow-lg">
                    <AvatarImage src="/api/placeholder/80/80" />
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                      {isGuestMode ? 'G' : user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <motion.button
                      className="absolute -bottom-1 -right-1 p-2 bg-primary rounded-full text-primary-foreground shadow-lg"
                      whileTap={{ scale: 0.9 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Camera className="w-3 h-3" />
                    </motion.button>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {isGuestMode ? 'Guest User' : user?.username || 'User Name'}
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    {isGuestMode ? 'Temporary Account' : 'user@example.com'}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={`bg-gradient-to-r ${getTierColor(userStats.tier)} text-white`}>
                      {getTierIcon(userStats.tier)}
                      <span className="ml-1">{userStats.tier}</span>
                    </Badge>
                    <Badge variant="secondary">
                      <Calendar className="w-3 h-3 mr-1" />
                      Joined {userStats.joinDate}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-xl backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.totalAnalyses}</div>
                  <div className="text-xs text-muted-foreground">Analyses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.complianceRate}%</div>
                  <div className="text-xs text-muted-foreground">Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.averageScore}</div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className={`p-3 rounded-xl text-center transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20'
                        : 'bg-muted/50 border border-border/50'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
                  >
                    <div className={`text-2xl mb-1 ${!achievement.unlocked && 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className={`text-xs font-medium ${
                      achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        {settingsItems.map((section, sectionIndex) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
          >
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{section.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + itemIndex * 0.05 }}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {item.action}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12">
                <Download className="w-4 h-4 mr-3" />
                Export My Data
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Share className="w-4 h-4 mr-3" />
                Share App
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <HelpCircle className="w-4 h-4 mr-3" />
                Help & Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="destructive"
            className="w-full h-12"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isGuestMode ? 'Exit Guest Mode' : 'Sign Out'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileScreen;