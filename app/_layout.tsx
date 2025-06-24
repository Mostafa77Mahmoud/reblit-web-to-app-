
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MobileApp from './MobileApp';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SessionProvider } from './contexts/SessionContext';
import { ContractProvider } from './contexts/ContractContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SessionProvider>
            <ContractProvider>
              <View style={styles.container}>
                <StatusBar style="auto" />
                <MobileApp />
              </View>
            </ContractProvider>
          </SessionProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
