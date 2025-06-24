
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api, SessionDetailsApiResponse } from '../services/api';

interface HistoryScreenProps {
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onNavigate }) => {
  const { t, isRTL } = useLanguage();
  const { isGuestMode } = useAuth();
  const [sessions, setSessions] = useState<SessionDetailsApiResponse[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionDetailsApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'compliance'>('newest');

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortSessions();
  }, [sessions, searchQuery, sortBy]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      
      // Always try to load from local storage first
      const localSessions = api.getLocalSessions();
      
      if (!isGuestMode) {
        // If authenticated, try to fetch from server
        try {
          const serverSessions = await api.getHistory();
          // Merge server and local sessions, prioritizing server data
          const mergedSessions = mergeSessions(serverSessions, localSessions);
          setSessions(mergedSessions);
        } catch (error) {
          console.log('Server history unavailable, using local storage');
          setSessions(localSessions);
        }
      } else {
        // Guest mode: use only local storage
        setSessions(localSessions);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const mergeSessions = (
    serverSessions: SessionDetailsApiResponse[], 
    localSessions: SessionDetailsApiResponse[]
  ): SessionDetailsApiResponse[] => {
    const merged = [...serverSessions];
    
    // Add local sessions that are not on server
    localSessions.forEach(localSession => {
      if (!merged.find(s => s.session_id === localSession.session_id)) {
        merged.push(localSession);
      }
    });
    
    return merged;
  };

  const filterAndSortSessions = () => {
    let filtered = [...sessions];
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(session =>
        session.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.session_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.analysis_timestamp).getTime() - new Date(a.analysis_timestamp).getTime();
        case 'oldest':
          return new Date(a.analysis_timestamp).getTime() - new Date(b.analysis_timestamp).getTime();
        case 'compliance':
          const aCompliance = calculateCompliancePercentage(a.analysis_results);
          const bCompliance = calculateCompliancePercentage(b.analysis_results);
          return bCompliance - aCompliance;
        default:
          return 0;
      }
    });
    
    setFilteredSessions(filtered);
  };

  const calculateCompliancePercentage = (terms: any[]): number => {
    if (terms.length === 0) return 0;
    const compliantTerms = terms.filter(term => term.is_valid_sharia).length;
    return Math.round((compliantTerms / terms.length) * 100);
  };

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const handleSessionPress = (session: SessionDetailsApiResponse) => {
    onNavigate('results', { 
      sessionId: session.session_id,
      analysisData: {
        session_id: session.session_id,
        original_filename: session.original_filename,
        analysis_results: session.analysis_results,
        detected_contract_language: session.detected_contract_language,
        original_contract_plain: session.original_contract_plain,
      }
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      t('common.delete'),
      'Are you sure you want to delete this analysis?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            api.deleteLocalSession(sessionId);
            setSessions(sessions.filter(s => s.session_id !== sessionId));
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={[styles.container, isRTL && styles.rtlContainer]}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>
          {t('history.title')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search and Sort */}
      <View style={styles.searchSection}>
        <TextInput
          style={[styles.searchInput, isRTL && styles.rtlInput]}
          placeholder={t('history.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign={isRTL ? 'right' : 'left'}
        />
        
        <View style={[styles.sortSection, isRTL && styles.rtlSortSection]}>
          <Text style={[styles.sortLabel, isRTL && styles.rtlText]}>
            {t('history.sortBy')}
          </Text>
          <View style={[styles.sortButtons, isRTL && styles.rtlSortButtons]}>
            {(['newest', 'oldest', 'compliance'] as const).map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.sortButton,
                  sortBy === sort && styles.activeSortButton
                ]}
                onPress={() => setSortBy(sort)}
              >
                <Text style={[
                  styles.sortButtonText,
                  sortBy === sort && styles.activeSortButtonText,
                  isRTL && styles.rtlText
                ]}>
                  {t(`history.${sort}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* History List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
            {t('common.loading')}
          </Text>
        </View>
      ) : filteredSessions.length > 0 ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredSessions.map((session) => {
            const compliancePercentage = calculateCompliancePercentage(session.analysis_results);
            
            return (
              <TouchableOpacity
                key={session.session_id}
                style={styles.sessionCard}
                onPress={() => handleSessionPress(session)}
              >
                <View style={[styles.sessionHeader, isRTL && styles.rtlHeader]}>
                  <View style={styles.sessionInfo}>
                    <Text style={[styles.sessionTitle, isRTL && styles.rtlText]}>
                      {session.original_filename}
                    </Text>
                    <Text style={[styles.sessionDate, isRTL && styles.rtlText]}>
                      {formatDate(session.analysis_timestamp)}
                    </Text>
                    <Text style={[styles.sessionStats, isRTL && styles.rtlText]}>
                      {session.analysis_results.length} terms • {session.detected_contract_language?.toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={styles.sessionActions}>
                    <View style={[
                      styles.complianceBadge,
                      { backgroundColor: getComplianceColor(compliancePercentage) }
                    ]}>
                      <Text style={styles.complianceText}>
                        {compliancePercentage}%
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteSession(session.session_id)}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Preview of issues */}
                {session.analysis_results.some(term => !term.is_valid_sharia) && (
                  <View style={styles.issuesPreview}>
                    <Text style={[styles.issuesTitle, isRTL && styles.rtlText]}>
                      Issues found:
                    </Text>
                    {session.analysis_results
                      .filter(term => !term.is_valid_sharia)
                      .slice(0, 2)
                      .map((term, index) => (
                        <Text 
                          key={index} 
                          style={[styles.issuePreview, isRTL && styles.rtlText]}
                          numberOfLines={1}
                        >
                          • {term.sharia_issue}
                        </Text>
                      ))}
                    {session.analysis_results.filter(term => !term.is_valid_sharia).length > 2 && (
                      <Text style={[styles.moreIssues, isRTL && styles.rtlText]}>
                        +{session.analysis_results.filter(term => !term.is_valid_sharia).length - 2} more issues
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          
          <View style={styles.bottomSpace} />
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={[styles.emptyTitle, isRTL && styles.rtlText]}>
            {t('history.empty')}
          </Text>
          <Text style={[styles.emptyDescription, isRTL && styles.rtlText]}>
            {t('history.emptyDesc')}
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => onNavigate('camera')}
          >
            <Text style={[styles.startButtonText, isRTL && styles.rtlText]}>
              {t('history.startAnalysis')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  placeholder: {
    width: 40,
  },
  rtlText: {
    textAlign: 'right',
  },
  searchSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  rtlInput: {
    textAlign: 'right',
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rtlSortSection: {
    flexDirection: 'row-reverse',
  },
  sortLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rtlSortButtons: {
    flexDirection: 'row-reverse',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  activeSortButton: {
    backgroundColor: '#10b981',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: '#ffffff',
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
  scrollContent: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
    marginRight: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  sessionStats: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sessionActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  complianceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  complianceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 16,
  },
  issuesPreview: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  issuesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 4,
  },
  issuePreview: {
    fontSize: 12,
    color: '#7f1d1d',
    marginBottom: 2,
  },
  moreIssues: {
    fontSize: 11,
    color: '#991b1b',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
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
  bottomSpace: {
    height: 20,
  },
});

export default HistoryScreen;
