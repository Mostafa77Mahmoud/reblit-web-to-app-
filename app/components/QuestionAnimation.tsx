
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface QuestionAnimationProps {
  isVisible: boolean;
  question?: string;
}

export const QuestionAnimation: React.FC<QuestionAnimationProps> = ({
  isVisible,
  question = '',
}) => {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const isDark = theme === 'dark';

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
          isRTL && styles.rtl,
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🤔</Text>
        </View>
        
        <Text style={[
          styles.title,
          { color: isDark ? '#ffffff' : '#374151' },
          isRTL && styles.rtlText,
        ]}>
          {t('question.analyzing')}
        </Text>
        
        {question && (
          <Text style={[
            styles.question,
            { color: isDark ? '#d1d5db' : '#6b7280' },
            isRTL && styles.rtlText,
          ]}>
            {question}
          </Text>
        )}
        
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  rtl: {
    direction: 'rtl',
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  question: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  rtlText: {
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginHorizontal: 4,
  },
  dot1: {
    // Animation would be handled by Animated.Value in a real implementation
  },
  dot2: {
    // Animation would be handled by Animated.Value in a real implementation
  },
  dot3: {
    // Animation would be handled by Animated.Value in a real implementation
  },
});
