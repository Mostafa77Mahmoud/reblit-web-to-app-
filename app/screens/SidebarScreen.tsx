
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import SidebarContent from '../components/SidebarContent';

interface SidebarScreenProps {
  navigation: any;
}

const SidebarScreen: React.FC<SidebarScreenProps> = ({ navigation }) => {
  const { t, dir } = useLanguage();
  const { theme } = useTheme();
  const { isGuestMode, user, logout } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
    },
    header: {
      flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme === 'dark' ? '#f9fafb' : '#111827',
      marginLeft: dir === 'rtl' ? 0 : 12,
      marginRight: dir === 'rtl' ? 12 : 0,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
      backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
    },
    guestModeContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    guestModeText: {
      fontSize: 14,
      color: '#10b981',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 4,
    },
    guestModeSubtext: {
      fontSize: 12,
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      textAlign: 'center',
    },
    authButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    authButton: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    authButtonPrimary: {
      backgroundColor: '#10b981',
    },
    authButtonText: {
      color: theme === 'dark' ? '#f9fafb' : '#111827',
      fontSize: 14,
      fontWeight: '500',
    },
    authButtonTextPrimary: {
      color: '#ffffff',
    },
    userContainer: {
      marginBottom: 12,
    },
    userText: {
      fontSize: 14,
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      marginBottom: 8,
    },
    userEmail: {
      fontWeight: '600',
      color: theme === 'dark' ? '#f9fafb' : '#111827',
    },
    logoutButton: {
      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    },
    logoutButtonText: {
      color: theme === 'dark' ? '#f9fafb' : '#111827',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    // Navigate to login - implement based on your auth flow
    console.log('Navigate to login');
  };

  const handleSignup = () => {
    // Navigate to signup - implement based on your auth flow
    console.log('Navigate to signup');
  };

  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24} color={theme === 'dark' ? '#f9fafb' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('sidebar.title') || 'Menu'}</Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <SidebarContent />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {isGuestMode ? (
          <View>
            <View style={styles.guestModeContainer}>
              <Text style={styles.guestModeText}>{t('guest.mode')}</Text>
              <Text style={styles.guestModeSubtext}>{t('guest.featuresAvailable')}</Text>
            </View>
            <View style={styles.authButtons}>
              <TouchableOpacity 
                style={[styles.authButton, styles.authButtonPrimary]}
                onPress={handleLogin}
              >
                <Text style={[styles.authButtonText, styles.authButtonTextPrimary]}>
                  {t('auth.login')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.authButton} onPress={handleSignup}>
                <Text style={styles.authButtonText}>{t('auth.signup')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.userContainer}>
              <Text style={styles.userText}>
                {t('auth.loggedInAs')} <Text style={styles.userEmail}>{user?.email}</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>{t('app.logout')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SidebarScreen;
