
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api, ApiAnalysisTerm, SessionDetailsApiResponse } from '../services/api';

interface ResultsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  sessionId?: string;
  analysisData?: any;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  onBack, 
  onNavigate, 
  sessionId, 
  analysisData 
}) => {
  const { t, isRTL } = useLanguage();
  const { isGuestMode } = useAuth();
  const [sessionData, setSessionData] = useState<SessionDetailsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<ApiAnalysisTerm | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generalQuestionVisible, setGeneralQuestionVisible] = useState(false);
  const [generalQuestion, setGeneralQuestion] = useState('');

  useEffect(() => {
    loadSessionData();
  }, [sessionId, analysisData]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      
      if (analysisData) {
        // Use provided analysis data
        const mockSession: SessionDetailsApiResponse = {
          _id: analysisData.session_id || 'temp',
          session_id: analysisData.session_id || 'temp',
          original_filename: analysisData.original_filename || 'Document',
          analysis_timestamp: new Date().toISOString(),
          analysis_results: analysisData.analysis_results || [],
          compliance_percentage: calculateCompliancePercentage(analysisData.analysis_results || []),
          detected_contract_language: analysisData.detected_contract_language || 'en',
          original_contract_plain: analysisData.original_contract_plain || '',
        };
        setSessionData(mockSession);
        
        // Save to local storage
        api.saveSessionLocally(mockSession);
      } else if (sessionId) {
        // Fetch from API
        const data = await api.getSessionDetails(sessionId);
        setSessionData(data);
      }
    } catch (error) {
      console.error('Failed to load session data:', error);
      Alert.alert(t('common.error'), 'Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompliancePercentage = (terms: ApiAnalysisTerm[]): number => {
    if (terms.length === 0) return 0;
    const compliantTerms = terms.filter(term => term.is_valid_sharia).length;
    return Math.round((compliantTerms / terms.length) * 100);
  };

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getComplianceStatus = (percentage: number) => {
    if (percentage >= 80) return t('results.excellent');
    if (percentage >= 60) return t('results.good');
    return t('results.needsReview');
  };

  const handleAskQuestion = (term?: ApiAnalysisTerm) => {
    if (term) {
      setSelectedTerm(term);
      setQuestionModalVisible(true);
    } else {
      setGeneralQuestionVisible(true);
    }
    setQuestionText('');
  };

  const submitQuestion = async () => {
    if (!questionText.trim() || !sessionData) return;

    try {
      setIsAskingQuestion(true);
      
      const answer = await api.askQuestion(
        sessionData.session_id,
        questionText,
        selectedTerm?.term_id,
        selectedTerm?.term_text
      );

      Alert.alert(
        t('common.success'),
        answer,
        [
          {
            text: t('common.close'),
            onPress: () => {
              setQuestionModalVisible(false);
              setGeneralQuestionVisible(false);
              setQuestionText('');
              setSelectedTerm(null);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to get answer');
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleGenerateCompliant = async () => {
    if (!sessionData) return;

    try {
      setIsGenerating(true);
      const result = await api.generateModifiedContract(sessionData.session_id);
      
      if (result.success) {
        Alert.alert(
          t('common.success'),
          'Compliant contract generated successfully!',
          [
            {
              text: t('results.download'),
              onPress: () => {
                // Handle download - would open URL in browser
                if (result.modified_docx_cloudinary_url) {
                  // Open URL or handle download
                  console.log('Download URL:', result.modified_docx_cloudinary_url);
                }
              }
            },
            { text: t('common.close') }
          ]
        );
      }
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to generate compliant contract');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
            {t('common.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!sessionData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, isRTL && styles.rtlText]}>
            {t('common.error')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const compliancePercentage = sessionData.compliance_percentage || 0;
  const compliantTerms = sessionData.analysis_results.filter(term => term.is_valid_sharia).length;
  const nonCompliantTerms = sessionData.analysis_results.length - compliantTerms;

  return (
    <SafeAreaView style={[styles.container, isRTL && styles.rtlContainer]}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>
          {t('results.title')}
        </Text>
        <TouchableOpacity 
          onPress={() => handleAskQuestion()}
          style={styles.askButton}
        >
          <Text style={styles.askIcon}>❓</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={[styles.summaryHeader, isRTL && styles.rtlHeader]}>
            <Text style={[styles.fileName, isRTL && styles.rtlText]}>
              {sessionData.original_filename}
            </Text>
            <View style={[
              styles.complianceBadge,
              { backgroundColor: getComplianceColor(compliancePercentage) }
            ]}>
              <Text style={styles.complianceText}>
                {compliancePercentage}%
              </Text>
            </View>
          </View>

          <Text style={[
            styles.complianceStatus,
            { color: getComplianceColor(compliancePercentage) },
            isRTL && styles.rtlText
          ]}>
            {getComplianceStatus(compliancePercentage)}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionData.analysis_results.length}</Text>
              <Text style={[styles.statLabel, isRTL && styles.rtlText]}>
                {t('results.totalTerms')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10b981' }]}>
                {compliantTerms}
              </Text>
              <Text style={[styles.statLabel, isRTL && styles.rtlText]}>
                {t('results.compliant')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#ef4444' }]}>
                {nonCompliantTerms}
              </Text>
              <Text style={[styles.statLabel, isRTL && styles.rtlText]}>
                {t('results.issues')}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.primaryButton, isGenerating && styles.disabledButton]} 
            onPress={handleGenerateCompliant}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={[styles.primaryButtonText, isRTL && styles.rtlText]}>
                {t('results.generateCompliant')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Terms Analysis */}
        <View style={styles.termsSection}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t('results.detailedAnalysis')}
          </Text>
          
          {sessionData.analysis_results.map((term: ApiAnalysisTerm, index: number) => (
            <View
              key={term.term_id}
              style={[
                styles.termCard,
                term.is_valid_sharia ? styles.compliantTerm : styles.nonCompliantTerm,
                isRTL && styles.rtlCard
              ]}
            >
              <View style={[styles.termHeader, isRTL && styles.rtlHeader]}>
                <View style={[styles.termStatus, isRTL && styles.rtlStatus]}>
                  <Text style={styles.statusIcon}>
                    {term.is_valid_sharia ? '✅' : '❌'}
                  </Text>
                  <Text style={[
                    styles.statusText,
                    { color: term.is_valid_sharia ? '#10b981' : '#ef4444' },
                    isRTL && styles.rtlText
                  ]}>
                    {term.is_valid_sharia ? t('results.compliantTerm') : t('results.nonCompliant')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleAskQuestion(term)}
                  style={styles.questionButton}
                >
                  <Text style={styles.questionIcon}>❓</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.termText, isRTL && styles.rtlText]}>
                {term.term_text}
              </Text>

              {!term.is_valid_sharia && (
                <View style={styles.issueSection}>
                  <Text style={[styles.issueTitle, isRTL && styles.rtlText]}>
                    {t('results.issue')}
                  </Text>
                  <Text style={[styles.issueText, isRTL && styles.rtlText]}>
                    {term.sharia_issue}
                  </Text>
                  
                  {term.reference_number && (
                    <Text style={[styles.referenceText, isRTL && styles.rtlText]}>
                      {t('results.reference')} {term.reference_number}
                    </Text>
                  )}

                  {term.modified_term && (
                    <View style={styles.suggestionSection}>
                      <Text style={[styles.suggestionTitle, isRTL && styles.rtlText]}>
                        {t('results.suggestion')}
                      </Text>
                      <Text style={[styles.suggestionText, isRTL && styles.rtlText]}>
                        {term.modified_term}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Question Modal */}
      <Modal
        visible={questionModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isRTL && styles.rtlModal]}>
            <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>
              {t('term.askQuestion')}
            </Text>
            
            <TextInput
              style={[styles.questionInput, isRTL && styles.rtlInput]}
              placeholder={t('term.questionPlaceholder')}
              value={questionText}
              onChangeText={setQuestionText}
              multiline
              textAlign={isRTL ? 'right' : 'left'}
            />
            
            <View style={[styles.modalButtons, isRTL && styles.rtlButtons]}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setQuestionModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, isRTL && styles.rtlText]}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.sendButton, (!questionText.trim() || isAskingQuestion) && styles.disabledButton]}
                onPress={submitQuestion}
                disabled={!questionText.trim() || isAskingQuestion}
              >
                {isAskingQuestion ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={[styles.sendButtonText, isRTL && styles.rtlText]}>
                    {t('term.send')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* General Question Modal */}
      <Modal
        visible={generalQuestionVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isRTL && styles.rtlModal]}>
            <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>
              Ask about Contract
            </Text>
            
            <TextInput
              style={[styles.questionInput, isRTL && styles.rtlInput]}
              placeholder="Ask about the entire contract..."
              value={generalQuestion}
              onChangeText={setGeneralQuestion}
              multiline
              textAlign={isRTL ? 'right' : 'left'}
            />
            
            <View style={[styles.modalButtons, isRTL && styles.rtlButtons]}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setGeneralQuestionVisible(false)}
              >
                <Text style={[styles.cancelButtonText, isRTL && styles.rtlText]}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.sendButton, (!generalQuestion.trim() || isAskingQuestion) && styles.disabledButton]}
                onPress={() => {
                  setQuestionText(generalQuestion);
                  setGeneralQuestionVisible(false);
                  submitQuestion();
                }}
                disabled={!generalQuestion.trim() || isAskingQuestion}
              >
                <Text style={[styles.sendButtonText, isRTL && styles.rtlText]}>
                  {t('term.send')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  rtlContainer: {
    direction: 'rtl',
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
  rtlHeader: {
    flexDirection: 'row-reverse',
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
  askButton: {
    padding: 8,
  },
  askIcon: {
    fontSize: 20,
  },
  rtlText: {
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
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
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
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
  rtlCard: {
    borderLeftWidth: 0,
    borderRightWidth: 4,
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
    flex: 1,
  },
  rtlStatus: {
    flexDirection: 'row-reverse',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  questionButton: {
    padding: 4,
  },
  questionIcon: {
    fontSize: 16,
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
  bottomSpace: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  rtlModal: {
    direction: 'rtl',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 16,
    fontSize: 16,
  },
  rtlInput: {
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rtlButtons: {
    flexDirection: 'row-reverse',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultsScreen;
