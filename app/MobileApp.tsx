
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ResultsScreen from './screens/ResultsScreen';
import MobileNavigation from './components/MobileNavigation';
import { useAuth } from './contexts/AuthContext';

const { width } = Dimensions.get('window');

type ScreenType = 'onboarding' | 'home' | 'camera' | 'history' | 'profile' | 'search' | 'notifications' | 'upload' | 'results';

const MobileApp = () => {
  const { isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const slideAnim = new Animated.Value(0);

  useEffect(() => {
    const initializeApp = async () => {
      // Check if user has seen onboarding (you can implement AsyncStorage here)
      if (hasSeenOnboarding) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('onboarding');
      }
      setIsLoading(false);
    };

    initializeApp();
  }, [hasSeenOnboarding]);

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: ScreenType) => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen(screen);
      slideAnim.setValue(-width);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleBack = () => {
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
      case 'results':
        return <ResultsScreen onBack={handleBack} onNavigate={handleNavigate} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  const showNavigation = ['home', 'search', 'history', 'profile'].includes(currentScreen);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Shariaa Analyzer...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.screenContainer, { transform: [{ translateX: slideAnim }] }]}>
          {renderScreen()}
        </Animated.View>
        
        {showNavigation && (
          <MobileNavigation 
            currentScreen={currentScreen} 
            onNavigate={handleNavigate} 
          />
        )}
        
        <View style={styles.statusBar} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10b981',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#10b981',
  },
});

export default MobileApp;
