
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface AnalysisTerm {
  term_id: string;
  term_text: string;
  is_valid_sharia: boolean;
  sharia_issue?: string;
  reference_number?: string;
  modified_term?: string;
  is_confirmed_by_user?: boolean;
  confirmed_modified_text?: string | null;
  has_expert_feedback?: boolean;
  last_expert_feedback_id?: string | null;
  expert_override_is_valid_sharia?: boolean | null;
}

interface ContractTermsListProps {
  analysisTerms?: AnalysisTerm[];
  isLoading?: boolean;
  onTermAction?: (termId: string, action: string, data?: any) => void;
}

const ContractTermsList: React.FC<ContractTermsListProps> = ({
  analysisTerms = [],
  isLoading = false,
  onTermAction
}) => {
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'compliant' | 'non-compliant'>('all');
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({});
  const [editingTermId, setEditingTermId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [currentQuestionTermId, setCurrentQuestionTermId] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return analysisTerms.filter(term => {
      if (activeFilter === 'all') return true;
      const isCompliant = term.expert_override_is_valid_sharia ?? term.is_valid_sharia;
      return activeFilter === 'compliant' ? isCompliant : !isCompliant;
    });
  }, [analysisTerms, activeFilter]);

  const toggleTerm = useCallback((termId: string) => {
    setExpandedTerms(prev => ({
      ...prev,
      [termId]: !prev[termId]
    }));
  }, []);

  const handleEditTerm = useCallback((term: AnalysisTerm) => {
    setEditingTermId(term.term_id);
    setEditText(term.modified_term || term.term_text);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingTermId && editText.trim()) {
      onTermAction?.(editingTermId, 'edit', { text: editText.trim() });
      setEditingTermId(null);
      setEditText('');
    }
  }, [editingTermId, editText, onTermAction]);

  const handleAskQuestion = useCallback((termId: string) => {
    setCurrentQuestionTermId(termId);
    setQuestionModalVisible(true);
  }, []);

  const handleSendQuestion = useCallback(() => {
    if (currentQuestionTermId && questionText.trim()) {
      onTermAction?.(currentQuestionTermId, 'question', { question: questionText.trim() });
      setQuestionModalVisible(false);
      setQuestionText('');
      setCurrentQuestionTermId(null);
    }
  }, [currentQuestionTermId, questionText, onTermAction]);

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      {(['all', 'compliant', 'non-compliant'] as const).map(filter => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterTab,
            activeFilter === filter && styles.filterTabActive
          ]}
          onPress={() => setActiveFilter(filter)}
        >
          <Text style={[
            styles.filterTabText,
            activeFilter === filter && styles.filterTabTextActive
          ]}>
            {t(`filter.${filter}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTerm = (term: AnalysisTerm) => {
    const isExpanded = expandedTerms[term.term_id];
    const isCompliant = term.expert_override_is_valid_sharia ?? term.is_valid_sharia;
    const isEditing = editingTermId === term.term_id;

    return (
      <View key={term.term_id} style={styles.termCard}>
        <TouchableOpacity
          style={styles.termHeader}
          onPress={() => toggleTerm(term.term_id)}
        >
          <Text style={styles.termText} numberOfLines={isExpanded ? undefined : 3}>
            {term.term_text}
          </Text>
          <View style={styles.termHeaderRight}>
            <View style={[
              styles.complianceTag,
              { backgroundColor: isCompliant ? '#10b981' : '#ef4444' }
            ]}>
              <Text style={styles.complianceTagText}>
                {isCompliant ? t('term.compliant') : t('term.non-compliant')}
              </Text>
            </View>
            <Text style={styles.expandIcon}>
              {isExpanded ? '⌄' : '⌃'}
            </Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.termDetails}>
            <View style={styles.termSection}>
              <Text style={styles.sectionTitle}>{t('term.fullText')}</Text>
              <Text style={styles.sectionContent}>{term.term_text}</Text>
            </View>

            {term.sharia_issue && !isCompliant && (
              <View style={styles.issueSection}>
                <Text style={styles.issueTitle}>{t('term.why')}</Text>
                <Text style={styles.issueContent}>{term.sharia_issue}</Text>
              </View>
            )}

            {term.reference_number && (
              <View style={styles.referenceSection}>
                <Text style={styles.referenceTitle}>{t('term.reference')}</Text>
                <Text style={styles.referenceContent}>{term.reference_number}</Text>
              </View>
            )}

            {isEditing ? (
              <View style={styles.editSection}>
                <Text style={styles.sectionTitle}>{t('term.editSuggestion')}</Text>
                <TextInput
                  style={styles.editInput}
                  value={editText}
                  onChangeText={setEditText}
                  multiline
                  textAlign={isRTL ? 'right' : 'left'}
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditingTermId(null)}
                  >
                    <Text style={styles.cancelButtonText}>{t('term.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveEdit}
                  >
                    <Text style={styles.saveButtonText}>{t('term.save')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : term.modified_term && (
              <View style={styles.suggestionSection}>
                <Text style={styles.sectionTitle}>{t('term.suggestion')}</Text>
                <Text style={styles.suggestionContent}>{term.modified_term}</Text>
                <View style={styles.suggestionActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditTerm(term)}
                  >
                    <Text style={styles.editButtonText}>{t('term.edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => onTermAction?.(term.term_id, 'confirm')}
                  >
                    <Text style={styles.confirmButtonText}>{t('term.confirm')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.questionButton}
              onPress={() => handleAskQuestion(term.term_id)}
            >
              <Text style={styles.questionButtonText}>{t('term.askQuestion')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('contract.terms')}</Text>
      
      {renderFilterTabs()}

      <ScrollView style={styles.termsList} showsVerticalScrollIndicator={false}>
        {filteredTerms.length > 0 ? (
          filteredTerms.map(renderTerm)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('term.noTermsForFilter')}</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={questionModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setQuestionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('term.askQuestion')}</Text>
            <TextInput
              style={styles.questionInput}
              value={questionText}
              onChangeText={setQuestionText}
              placeholder={t('term.questionPlaceholder')}
              multiline
              textAlign={isRTL ? 'right' : 'left'}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setQuestionModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>{t('term.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSendButton}
                onPress={handleSendQuestion}
              >
                <Text style={styles.modalSendButtonText}>{t('button.send')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: '#374151',
    fontWeight: '500',
  },
  termsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  termCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  termHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 24,
    marginRight: 12,
  },
  termHeaderRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  complianceTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  complianceTagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expandIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
  termDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    gap: 16,
  },
  termSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  issueSection: {
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  issueTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 4,
  },
  issueContent: {
    fontSize: 14,
    color: '#dc2626',
    lineHeight: 20,
  },
  referenceSection: {
    backgroundColor: '#dbeafe',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  referenceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  referenceContent: {
    fontSize: 14,
    color: '#2563eb',
    lineHeight: 20,
  },
  editSection: {
    gap: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#ffffff',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#10b981',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  suggestionSection: {
    backgroundColor: '#dbeafe',
    padding: 14,
    borderRadius: 8,
    gap: 12,
  },
  suggestionContent: {
    fontSize: 16,
    color: '#1e40af',
    lineHeight: 24,
  },
  suggestionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  questionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  questionButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
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
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  modalCancelButtonText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  modalSendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  modalSendButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default ContractTermsList;
