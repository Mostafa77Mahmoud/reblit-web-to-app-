
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export const CardHeader: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

export const CardTitle: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.title, style]}>{children}</View>;
};

export const CardContent: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

export const CardFooter: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 8,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: 12,
  },
});
