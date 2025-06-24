
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface ComplianceStats {
  currentUserEffectiveCompliantCount: number;
  currentUserEffectiveNonCompliantCount: number;
  overallCompliancePercentage: number;
}

interface ComplianceBannerProps {
  complianceStats?: ComplianceStats;
}

const ComplianceBanner: React.FC<ComplianceBannerProps> = ({ complianceStats }) => {
  const { t, isRTL } = useLanguage();

  if (!complianceStats) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar} />
        <View style={[styles.loadingBar, { width: '60%', marginTop: 8 }]} />
        <View style={styles.loadingStatsContainer}>
          <View style={styles.loadingStatBox} />
          <View style={styles.loadingStatBox} />
        </View>
        <View style={[styles.loadingBar, { height: 20, marginTop: 16 }]} />
      </View>
    );
  }

  const {
    currentUserEffectiveCompliantCount,
    currentUserEffectiveNonCompliantCount,
    overallCompliancePercentage
  } = complianceStats;

  const getComplianceColors = () => {
    if (overallCompliancePercentage >= 80) return {
      bg: '#d1fae5',
      border: '#10b981',
      text: '#065f46',
      iconBg: '#ecfdf5',
    };
    if (overallCompliancePercentage >= 50) return {
      bg: '#fef3c7',
      border: '#f59e0b',
      text: '#92400e',
      iconBg: '#fffbeb',
    };
    return {
      bg: '#fee2e2',
      border: '#ef4444',
      text: '#991b1b',
      iconBg: '#fef2f2',
    };
  };

  const colors = getComplianceColors();
  const icon = overallCompliancePercentage >= 80 ? '✓' : 
               overallCompliancePercentage >= 50 ? 'ⓘ' : '⚠';

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.bg, borderColor: colors.border }
    ]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
          <Text style={[styles.icon, { color: colors.text }]}>{icon}</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          {overallCompliancePercentage >= 100 ? t('compliance.full') : 
           overallCompliancePercentage >= 50 ? t('compliance.partial') : 
           t('compliance.non')}
        </Text>
      </View>

      <Text style={styles.description}>
        {t('compliance.terms')}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{currentUserEffectiveCompliantCount}</Text>
          <Text style={styles.statLabel}>{t('compliance.compliantTerms')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#ef4444' }]}>
            {currentUserEffectiveNonCompliantCount}
          </Text>
          <Text style={styles.statLabel}>{t('compliance.nonCompliantTerms')}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${overallCompliancePercentage}%`,
                backgroundColor: colors.border 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.text }]}>
          {overallCompliancePercentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  loadingBar: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    width: '75%',
  },
  loadingStatsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  loadingStatBox: {
    flex: 1,
    height: 60,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  container: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },
});

export default ComplianceBanner;
