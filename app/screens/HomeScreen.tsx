
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { t, dir } = useLanguage();
  const { user, isGuestMode } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState('');
  const [userStats, setUserStats] = useState<any>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');

    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (isGuestMode) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [stats, history] = await Promise.all([
        api.getStats().catch(() => null),
        api.getHistory().catch(() => [])
      ]);

      setUserStats(stats);
      setRecentAnalyses(history.slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadDashboardData().then(() => setRefreshing(false));
  }, []);

  const quickStats = [
    {
      label: t('home.totalAnalyses'),
      value: userStats?.total_analyses?.toString() || '0',
      icon: '📄',
      color: '#3b82f6',
    },
    {
      label: t('home.complianceRate'),
      value: userStats?.compliance_rate ? `${Math.round(userStats.compliance_rate)}%` : '0%',
      icon: '🛡️',
      color: '#10b981',
    },
    {
      label: t('home.thisMonth'),
      value: userStats?.analyses_this_month?.toString() || '0',
      icon: '📈',
      color: '#8b5cf6',
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              {t(`home.good${timeOfDay}`)}
            </Text>
            <Text style={styles.userName}>
              {isGuestMode ? t('home.guestUser') : user?.username || user?.email?.split('@')[0] || 'User'}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => onNavigate('profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() => onNavigate('camera')}
          >
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionTitle}>{t('home.scanDocument')}</Text>
            <Text style={styles.actionSubtitle}>Use camera to analyze</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => onNavigate('upload')}
          >
            <Text style={styles.actionIcon}>📁</Text>
            <Text style={styles.actionTitle}>{t('home.uploadFile')}</Text>
            <Text style={styles.actionSubtitle}>Select from device</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Analytics</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Analyses */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.recentAnalyses')}</Text>
            <TouchableOpacity onPress={() => onNavigate('history')}>
              <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          {recentAnalyses.length > 0 ? (
            <View style={styles.analysesList}>
              {recentAnalyses.map((analysis, index) => (
                <View key={index} style={styles.analysisCard}>
                  <View style={styles.analysisInfo}>
                    <Text style={styles.analysisTitle}>
                      {analysis.original_filename || 'Contract Analysis'}
                    </Text>
                    <Text style={styles.analysisDate}>
                      {new Date(analysis.analysis_timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.complianceIndicator}>
                    <Text style={styles.complianceText}>
                      {Math.round(analysis.compliance_percentage || 0)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={styles.emptyTitle}>{t('home.noAnalyses')}</Text>
              <Text style={styles.emptySubtitle}>{t('home.startFirst')}</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => onNavigate('camera')}
              >
                <Text style={styles.startButtonText}>{t('home.scanDocument')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => onNavigate('camera')}
      >
        <Text style={styles.fabIcon}>📸</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userName: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 20,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryAction: {
    backgroundColor: '#10b981',
  },
  secondaryAction: {
    backgroundColor: '#3b82f6',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  analysesList: {
    gap: 12,
  },
  analysisCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisInfo: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  analysisDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  complianceIndicator: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  complianceText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
  },
});

export default HomeScreen;
