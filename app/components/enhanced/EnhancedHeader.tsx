
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface EnhancedHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightComponent,
}) => {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();

  const isDark = theme === 'dark';

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#1f2937' : '#ffffff' },
      isRTL && styles.rtl
    ]}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[
            styles.backText,
            { color: isDark ? '#ffffff' : '#374151' }
          ]}>
            {isRTL ? '←' : '→'}
          </Text>
        </TouchableOpacity>
      )}
      
      <Text style={[
        styles.title,
        { color: isDark ? '#ffffff' : '#374151' },
        isRTL && styles.rtlText
      ]}>
        {title}
      </Text>
      
      <View style={styles.rightSection}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
