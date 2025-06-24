import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Home, Camera, History, User, Menu } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentScreen, onNavigate }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', icon: Home, label: t('navigation.home') },
    { id: 'camera', icon: Camera, label: t('navigation.camera') },
    { id: 'history', icon: History, label: t('navigation.history') },
    { id: 'profile', icon: User, label: t('navigation.profile') },
    { id: 'sidebar', icon: Menu, label: t('navigation.menu') },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
      borderTopWidth: 1,
      borderTopColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
      paddingVertical: 4,
      paddingHorizontal: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 8,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 12,
    },
    activeTab: {
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f0fdf4',
    },
    tabLabel: {
      fontSize: 11,
      marginTop: 2,
      fontWeight: '500',
    },
    activeTabLabel: {
      color: '#10b981',
    },
    inactiveTabLabel: {
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    },
  });

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onNavigate(tab.id)}
          >
            <Icon 
              size={22} 
              color={isActive ? '#10b981' : theme === 'dark' ? '#9ca3af' : '#6b7280'} 
              strokeWidth={2}
            />
            <Text 
              style={[
                styles.tabLabel,
                isActive ? styles.activeTabLabel : styles.inactiveTabLabel
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MobileNavigation;