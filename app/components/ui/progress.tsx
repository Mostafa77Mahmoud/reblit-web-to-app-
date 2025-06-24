
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Animated } from 'react-native';

interface ProgressProps {
  value: number;
  max?: number;
  style?: ViewStyle;
  indicatorStyle?: ViewStyle;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  style,
  indicatorStyle,
}) => {
  const percentage = Math.min(Math.max(value, 0), max) / max;
  const animatedValue = new Animated.Value(percentage);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.indicator,
          indicatorStyle,
          {
            width: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
});
