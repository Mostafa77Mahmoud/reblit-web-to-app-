import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { TutorialScreen } from '@/components/mobile/TutorialScreen';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Camera, 
  FileText, 
  Plus, 
  TrendingUp, 
  Shield, 
  Clock,
  ChevronRight,
  Star,
  BarChart3
} from 'lucide-react';

export const MobileHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuestMode } = useAuth();
  const { contracts, isLoading } = useLocalStorage();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Show tutorial for first-time users
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const recentContracts = contracts.slice(0, 3);
  const totalContracts = contracts.length;
  const avgComplianceScore = contracts.length > 0 
    ? Math.round(contracts.reduce((sum, contract) => 
        sum + (contract.analysisResult?.complianceScore || 0), 0) / contracts.length)
    : 0;

  const quickActions = [
    {
      title: 'Scan Document',
      description: 'Use camera to scan',
      icon: <Camera className="h-6 w-6" />,
      action: () => navigate('/mobile/scan'),
      color: 'bg-blue-500',
    },
    {
      title: 'Upload File',
      description: 'Choose from device',
      icon: <FileText className="h-6 w-6" />,
      action: () => navigate('/mobile/upload'),
      color: 'bg-green-500',
    },
  ];

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate('/mobile/scan'),
    onSwipedRight: () => navigate('/mobile/contracts'),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TutorialScreen
        isVisible={showTutorial}
        onComplete={handleTutorialComplete}
      />

      <div {...handlers} className="p-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Shariaa Analyzer
          </h1>
          <p className="text-muted-foreground">
            {isGuestMode ? 'Welcome, Guest' : `Welcome back, ${user?.username || 'User'}`}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="border-shariah-green/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-shariah-green" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalContracts}</div>
              <div className="text-sm text-muted-foreground">Contracts</div>
            </CardContent>
          </Card>

          <Card className="border-shariah-green/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-8 w-8 text-shariah-green" />
              </div>
              <div className="text-2xl font-bold text-foreground">{avgComplianceScore}%</div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="cursor-pointer border-2 border-transparent hover:border-shariah-green/30 transition-all duration-200"
                onClick={action.action}
              >
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Contracts */}
        {recentContracts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Contracts</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/mobile/contracts')}
                className="text-shariah-green"
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentContracts.map((contract, index) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground truncate flex-1">
                          {contract.name}
                        </h3>
                        {contract.analysisResult && (
                          <Badge
                            variant={contract.analysisResult.complianceScore >= 80 ? 'default' : 'destructive'}
                            className="ml-2"
                          >
                            {contract.analysisResult.complianceScore}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(contract.uploadDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {contracts.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Contracts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by scanning or uploading your first contract
            </p>
            <Button
              onClick={() => navigate('/mobile/scan')}
              className="bg-shariah-green hover:bg-shariah-green/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Scan First Contract
            </Button>
          </motion.div>
        )}
      </div>

      <MobileNavigation />
    </div>
  );
};