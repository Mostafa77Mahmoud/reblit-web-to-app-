
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface MobileNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'camera', label: 'Scan', icon: '📸' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.navItem,
            currentScreen === item.id && styles.activeNavItem
          ]}
          onPress={() => onNavigate(item.id)}
        >
          <Text style={[
            styles.navIcon,
            currentScreen === item.id && styles.activeNavIcon
          ]}>
            {item.icon}
          </Text>
          <Text style={[
            styles.navLabel,
            currentScreen === item.id && styles.activeNavLabel
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  activeNavItem: {
    backgroundColor: '#f0f9ff',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeNavIcon: {
    transform: [{ scale: 1.1 }],
  },
  navLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#10b981',
    fontWeight: '600',
  },
});

export default MobileNavigation;
