import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ResultsScreen from './screens/ResultsScreen';
import MobileNavigation from './components/MobileNavigation';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';

const { width } = Dimensions.get('window');

type ScreenType = 'onboarding' | 'home' | 'camera' | 'history' | 'profile' | 'search' | 'notifications' | 'upload' | 'results' | 'sidebar';

interface NavigationData {
  sessionId?: string;
  analysisData?: any;
}

const MobileApp = () => {
  const { isAuthenticated } = useAuth();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [navigationData, setNavigationData] = useState<NavigationData>({});
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const slideAnim = new Animated.Value(0);

  useEffect(() => {
    const initializeApp = async () => {
      // Check if user has seen onboarding
      const onboardingSeen = localStorage.getItem('shariaa_onboarding_seen');
      if (onboardingSeen === 'true') {
        setHasSeenOnboarding(true);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('onboarding');
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem('shariaa_onboarding_seen', 'true');
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: ScreenType, data?: NavigationData) => {
    setNavigationData(data || {});

    Animated.timing(slideAnim, {
      toValue: isRTL ? -width : width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen(screen);
      slideAnim.setValue(isRTL ? width : -width);
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
    setNavigationData({});
  };

  const handleAnalysisComplete = (analysisData: any) => {
    handleNavigate('results', { analysisData });
  };

  const renderScreen = () => {
    const screenProps = {
      onNavigate: handleNavigate,
      onBack: handleBack,
      ...navigationData,
    };

    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'home':
        return <HomeScreen {...screenProps} />;
      case 'camera':
        return (
          <CameraScreen 
            {...screenProps} 
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case 'history':
        return <HistoryScreen {...screenProps} />;
      case 'profile':
        return <ProfileScreen {...screenProps} />;
      case 'results':
        return <ResultsScreen {...screenProps} />;
      case 'sidebar':
        return <SidebarScreen navigation={{ goBack: () => setCurrentScreen('home') }} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  };

  const showNavigation = ['home', 'search', 'history', 'profile'].includes(currentScreen);

  const isDarkMode = theme === 'dark';
  const containerStyle = {
    ...styles.container,
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#1f2937' : '#10b981' }]}>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'light-content'} 
          backgroundColor={isDarkMode ? '#1f2937' : '#10b981'} 
        />
        <Text style={styles.loadingText}>Loading Shariaa Analyzer...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#1f2937' : '#ffffff'} 
      />
      <SafeAreaView style={[containerStyle, isRTL && styles.rtlContainer]}>
        <Animated.View style={[
          styles.screenContainer, 
          { transform: [{ translateX: slideAnim }] }
        ]}>
          {renderScreen()}
        </Animated.View>

        {showNavigation && (
          <MobileNavigation 
            currentScreen={currentScreen} 
            onNavigate={handleNavigate}
            theme={theme}
          />
        )}

        <View style={[
          styles.statusBar, 
          { backgroundColor: isDarkMode ? '#10b981' : '#10b981' }
        ]} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  rtlContainer: {
    direction: 'rtl',
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