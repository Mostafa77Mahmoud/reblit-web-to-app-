import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import useLocalStorage from '@/hooks/useLocalStorage';

// Import all screens
import OnboardingScreen from '@/screens/OnboardingScreen';
import HomeScreen from '@/screens/HomeScreen';
import CameraScreen from '@/screens/CameraScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ResultsScreen from '@/screens/ResultsScreen';
import MobileNavigation from '@/components/MobileNavigation';

// Screen types
type ScreenType = 'onboarding' | 'home' | 'camera' | 'history' | 'profile' | 'search' | 'notifications' | 'upload' | 'results';

interface MobileAppProps {}

const MobileApp: React.FC<MobileAppProps> = () => {
  const { isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('hasSeenOnboarding', false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      // Check if user has seen onboarding
      if (hasSeenOnboarding) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('onboarding');
      }
      setIsLoading(false);
    };

    initializeApp();
  }, [hasSeenOnboarding]);

  const handleOnboardingComplete = async () => {
    await setHasSeenOnboarding(true);
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    // Simple back navigation logic
    switch (currentScreen) {
      case 'camera':
      case 'history':
      case 'profile':
      case 'search':
      case 'notifications':
        setCurrentScreen('home');
        break;
      case 'upload':
      case 'results':
        setCurrentScreen('home');
        break;
      default:
        setCurrentScreen('home');
    }
  };

  // Screen transition variants
  const screenVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }
    })
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-500">ش</span>
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Shariaa Analyzer</h1>
          <p className="text-emerald-100">Loading your analysis toolkit...</p>
        </motion.div>
      </div>
    );
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      
      case 'camera':
        return <CameraScreen onNavigate={handleNavigate} onBack={handleBack} />;
      
      case 'history':
        return <HistoryScreen onBack={handleBack} onNavigate={handleNavigate} />;
      
      case 'profile':
        return <ProfileScreen onBack={handleBack} onNavigate={handleNavigate} />;
      
      case 'search':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Search Contracts</h2>
              <p className="text-muted-foreground">Search functionality coming soon</p>
              <button 
                onClick={handleBack}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <p className="text-muted-foreground">No new notifications</p>
              <button 
                onClick={handleBack}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      
      case 'upload':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
              <p className="text-muted-foreground">File upload functionality coming soon</p>
              <button 
                onClick={handleBack}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      
      case 'results':
        return <ResultsScreen onBack={handleBack} onNavigate={handleNavigate} />;
      
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  // Show navigation only for main screens
  const showNavigation = ['home', 'search', 'history', 'profile'].includes(currentScreen);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Screen Container */}
      <div className={`relative ${showNavigation ? 'pb-20' : ''}`}>
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentScreen}
            custom={1}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showNavigation && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <MobileNavigation 
              currentScreen={currentScreen} 
              onNavigate={handleNavigate} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global floating elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-50" />
    </div>
  );
};

export default MobileApp;