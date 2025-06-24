
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ResultsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ onBack, onNavigate }) => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock analysis results - replace with actual API call
    setTimeout(() => {
      setAnalysisResults({
        session_id: 'mock-session-123',
        original_filename: 'contract_analysis.pdf',
        compliance_percentage: 87,
        total_terms: 12,
        compliant_terms: 10,
        non_compliant_terms: 2,
        detected_language: 'en',
        analysis_results: [
          {
            term_id: '1',
            term_text: 'Interest rate of 5% per annum',
            is_valid_sharia: false,
            sharia_issue: 'Interest (Riba) is prohibited in Islamic finance',
            reference_number: 'Quran 2:275',
            modified_term: 'Profit sharing arrangement based on agreed percentage',
          },
          {
            term_id: '2',
            term_text: 'Payment terms: 30 days net',
            is_valid_sharia: true,
            sharia_issue: null,
            reference_number: null,
            modified_term: null,
          },
          {
            term_id: '3',
            term_text: 'Gambling clause for dispute resolution',
            is_valid_sharia: false,
            sharia_issue: 'Gambling (Maysir) is prohibited',
            reference_number: 'Quran 5:90',
            modified_term: 'Islamic arbitration for dispute resolution',
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getComplianceStatus = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    return 'Needs Review';
  };

  const handleDownload = () => {
    Alert.alert('Download', 'Download functionality will be implemented');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality will be implemented');
  };

  const handleRegenerateContract = () => {
    Alert.alert('Regenerate', 'Contract regeneration will be implemented');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Processing analysis results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareIcon}>↗️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.fileName}>{analysisResults.original_filename}</Text>
            <View style={[
              styles.complianceBadge,
              { backgroundColor: getComplianceColor(analysisResults.compliance_percentage) }
            ]}>
              <Text style={styles.complianceText}>
                {analysisResults.compliance_percentage}%
              </Text>
            </View>
          </View>

          <Text style={[
            styles.complianceStatus,
            { color: getComplianceColor(analysisResults.compliance_percentage) }
          ]}>
            {getComplianceStatus(analysisResults.compliance_percentage)}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{analysisResults.total_terms}</Text>
              <Text style={styles.statLabel}>Total Terms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10b981' }]}>
                {analysisResults.compliant_terms}
              </Text>
              <Text style={styles.statLabel}>Compliant</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#ef4444' }]}>
                {analysisResults.non_compliant_terms}
              </Text>
              <Text style={styles.statLabel}>Issues</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleRegenerateContract}>
            <Text style={styles.primaryButtonText}>Generate Compliant Version</Text>
          </TouchableOpacity>
          <View style={styles.secondaryButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDownload}>
              <Text style={styles.secondaryButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms Analysis */}
        <View style={styles.termsSection}>
          <Text style={styles.sectionTitle}>Detailed Analysis</Text>
          
          {analysisResults.analysis_results.map((term: any, index: number) => (
            <View
              key={term.term_id}
              style={[
                styles.termCard,
                term.is_valid_sharia ? styles.compliantTerm : styles.nonCompliantTerm
              ]}
            >
              <View style={styles.termHeader}>
                <View style={styles.termStatus}>
                  <Text style={styles.statusIcon}>
                    {term.is_valid_sharia ? '✅' : '❌'}
                  </Text>
                  <Text style={[
                    styles.statusText,
                    { color: term.is_valid_sharia ? '#10b981' : '#ef4444' }
                  ]}>
                    {term.is_valid_sharia ? 'Compliant' : 'Non-Compliant'}
                  </Text>
                </View>
                <Text style={styles.termNumber}>#{index + 1}</Text>
              </View>

              <Text style={styles.termText}>{term.term_text}</Text>

              {!term.is_valid_sharia && (
                <View style={styles.issueSection}>
                  <Text style={styles.issueTitle}>Issue:</Text>
                  <Text style={styles.issueText}>{term.sharia_issue}</Text>
                  
                  {term.reference_number && (
                    <Text style={styles.referenceText}>
                      Reference: {term.reference_number}
                    </Text>
                  )}

                  {term.modified_term && (
                    <View style={styles.suggestionSection}>
                      <Text style={styles.suggestionTitle}>Suggested Alternative:</Text>
                      <Text style={styles.suggestionText}>{term.modified_term}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Expert Review */}
        <View style={styles.expertSection}>
          <Text style={styles.sectionTitle}>Need Expert Review?</Text>
          <Text style={styles.expertDescription}>
            Get professional Islamic finance expert review for complex terms
          </Text>
          <TouchableOpacity style={styles.expertButton}>
            <Text style={styles.expertButtonText}>Request Expert Review</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
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
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  shareButton: {
    padding: 8,
  },
  shareIcon: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
  },
  complianceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  complianceText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  complianceStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  termsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  termCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compliantTerm: {
    borderLeftColor: '#10b981',
  },
  nonCompliantTerm: {
    borderLeftColor: '#ef4444',
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  termStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  termNumber: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  termText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    marginBottom: 12,
  },
  issueSection: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 4,
  },
  issueText: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 12,
    color: '#991b1b',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  suggestionSection: {
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#0c4a6e',
  },
  expertSection: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expertDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  expertButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  expertButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 100,
  },
});

export default ResultsScreen;
