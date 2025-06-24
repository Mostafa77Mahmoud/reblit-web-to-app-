import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import ContractTermsList from '../components/ContractTermsList';
import ComplianceBanner from '../components/ComplianceBanner';

const ResultsScreen: React.FC<ResultsScreenProps> = ({ onNavigate, data }) => {
  const { t, isRTL } = useLanguage();

  const mockResults = data?.results || {
    terms: [
      {
        term_id: '1',
        term_text: 'Interest rate clause requiring 12% annual return',
        is_valid_sharia: false,
        sharia_issue: 'Fixed interest rates are prohibited in Islamic finance',
        reference_number: 'AAOIFI Standard 2',
        modified_term: 'Replace with profit-sharing arrangement based on actual business performance'
      },
      {
        term_id: '2',
        term_text: 'Risk sharing between parties as per Mudarabah principles',
        is_valid_sharia: true,
        sharia_issue: null,
        reference_number: 'AAOIFI Standard 13',
        modified_term: null
      },
      {
        term_id: '3',
        term_text: 'Penalty fees for late payment',
        is_valid_sharia: false,
        sharia_issue: 'Penalty fees constitute Riba (usury)',
        reference_number: 'AAOIFI Standard 2',
        modified_term: 'Consider alternative dispute resolution mechanisms without monetary penalties'
      }
    ]
  };

  const complianceStats = {
    currentUserEffectiveCompliantCount: mockResults.terms.filter((t: any) => t.is_valid_sharia).length,
    currentUserEffectiveNonCompliantCount: mockResults.terms.filter((t: any) => !t.is_valid_sharia).length,
    overallCompliancePercentage: (mockResults.terms.filter((t: any) => t.is_valid_sharia).length / mockResults.terms.length) * 100
  };

  const handleTermAction = (termId: string, action: string, actionData?: any) => {
    console.log('Term action:', { termId, action, actionData });
    // Handle term actions like edit, confirm, question, etc.
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onNavigate('home')}
          >
            <Text style={styles.backButtonText}>
              {isRTL ? '→' : '←'} {t('common.back')}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {t('results.title')}
          </Text>
        </View>

        <ComplianceBanner complianceStats={complianceStats} />

        <ContractTermsList
          analysisTerms={mockResults.terms}
          isLoading={false}
          onTermAction={handleTermAction}
        />

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              // Handle generate modified contract
            }}
          >
            <Text style={styles.generateButtonText}>
              {t('results.generateContract')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newAnalysisButton}
            onPress={() => onNavigate('home')}
          >
            <Text style={styles.newAnalysisButtonText}>
              {t('results.newAnalysis')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  rtlText: {
    textAlign: 'right',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  complianceContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  compliancePercentage: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  complianceLabel: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'spaceAround',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  termCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  termText: {
    fontSize: 16,
    flex: 1,
  },
  complianceTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  complianceTagText: {
    color: '#fff',
    fontSize: 12,
  },
  issueContainer: {
    marginBottom: 10,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  issueText: {
    fontSize: 14,
  },
  suggestionContainer: {},
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionText: {
    fontSize: 14,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newAnalysisButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  newAnalysisButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spaceAround: {
    justifyContent: 'spaceAround',
  }
});

export default ResultsScreen;