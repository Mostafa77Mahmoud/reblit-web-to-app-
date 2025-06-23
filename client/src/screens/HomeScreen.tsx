import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Camera, 
  History, 
  TrendingUp, 
  Shield, 
  Plus,
  Bell,
  User,
  Settings,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface QuickStat {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
  color: string;
}

interface RecentAnalysis {
  id: string;
  title: string;
  date: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  score: number;
  type: string;
}

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { t, dir } = useLanguage();
  const { user, isGuestMode } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  const quickStats: QuickStat[] = [
    {
      label: 'Total Analyses',
      value: '24',
      icon: <FileText className="w-5 h-5" />,
      trend: 12,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Compliance Rate',
      value: '87%',
      icon: <Shield className="w-5 h-5" />,
      trend: 5,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'This Month',
      value: '8',
      icon: <TrendingUp className="w-5 h-5" />,
      trend: 23,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const recentAnalyses: RecentAnalysis[] = [
    {
      id: '1',
      title: 'Investment Contract - ABC Bank',
      date: '2 hours ago',
      status: 'compliant',
      score: 94,
      type: 'Investment'
    },
    {
      id: '2',
      title: 'Loan Agreement - XYZ Finance',
      date: '1 day ago',
      status: 'warning',
      score: 76,
      type: 'Loan'
    },
    {
      id: '3',
      title: 'Partnership Agreement',
      date: '3 days ago',
      status: 'compliant',
      score: 89,
      type: 'Partnership'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'non-compliant': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'non-compliant': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5" dir={dir}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Good {timeOfDay}
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {isGuestMode ? 'Guest User' : user?.username || 'User'}
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              className="p-3 rounded-full bg-card shadow-lg relative"
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate('notifications')}
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </motion.button>
            
            <motion.button
              className="p-3 rounded-full bg-card shadow-lg"
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate('profile')}
            >
              <User className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search contracts or analyses..."
            className="w-full pl-12 pr-4 py-4 bg-card rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl text-white"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onNavigate('camera')}
          >
            <Camera className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg">Scan Document</h3>
            <p className="text-emerald-100 text-sm">Use camera to analyze</p>
          </motion.button>

          <motion.button
            className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl text-white"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onNavigate('upload')}
          >
            <FileText className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg">Upload File</h3>
            <p className="text-blue-100 text-sm">Select from device</p>
          </motion.button>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <motion.h2
          className="text-xl font-bold mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your Analytics
        </motion.h2>
        
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-4 bg-card rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-center">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+{stat.trend}%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recent Analyses */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            className="text-xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Recent Analyses
          </motion.h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('history')}
            className="text-primary"
          >
            View All
          </Button>
        </div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {recentAnalyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              className="p-4 bg-card rounded-xl shadow-lg border border-border/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{analysis.title}</h3>
                  <p className="text-xs text-muted-foreground">{analysis.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {analysis.type}
                  </Badge>
                  <div className={`p-1 rounded-full ${getStatusColor(analysis.status)}`}>
                    {getStatusIcon(analysis.status)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(analysis.score / 20)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium">{analysis.score}%</span>
                </div>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-2xl flex items-center justify-center text-white z-50"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => onNavigate('camera')}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default HomeScreen;