
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentScreen, onNavigate }) => {
  const { t, isRTL } = useLanguage();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: t('navigation.home') || 'Home',
      icon: '🏠',
    },
    {
      id: 'camera',
      label: t('navigation.camera') || 'Scan',
      icon: '📷',
    },
    {
      id: 'history',
      label: t('navigation.history') || 'History',
      icon: '📋',
    },
    {
      id: 'profile',
      label: t('navigation.profile') || 'Profile',
      icon: '👤',
    }
  ];

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <View style={[styles.navigationBar, isRTL && styles.rtlNavigationBar]}>
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const isCenterItem = item.id === 'camera';

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onNavigate(item.id)}
              style={[
                styles.navButton,
                isCenterItem && styles.centerButton,
                isActive && styles.activeButton,
                isRTL && styles.rtlNavButton
              ]}
            >
              <Text style={[
                styles.icon,
                isCenterItem && styles.centerIcon,
                isActive && styles.activeIcon
              ]}>
                {item.icon}
              </Text>
              <Text style={[
                styles.label,
                isCenterItem && styles.centerLabel,
                isActive && styles.activeLabel,
                isRTL && styles.rtlLabel
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20, // Safe area for iOS
  },
  rtlNavigationBar: {
    flexDirection: 'row-reverse',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  rtlNavButton: {
    marginHorizontal: 4,
  },
  centerButton: {
    backgroundColor: '#10b981',
    marginTop: -8,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activeButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  centerIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  rtlLabel: {
    textAlign: 'right',
  },
  centerLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  activeLabel: {
    color: '#10b981',
    fontWeight: '600',
  },
});

export default MobileNavigation;
