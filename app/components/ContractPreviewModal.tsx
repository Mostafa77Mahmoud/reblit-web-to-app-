
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface ContractPreviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  contract?: {
    title: string;
    content: string;
    analysisDate: string;
    complianceScore: number;
  };
}

export const ContractPreviewModal: React.FC<ContractPreviewModalProps> = ({
  isVisible,
  onClose,
  contract,
}) => {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!contract) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.container,
          { backgroundColor: isDark ? '#1f2937' : '#ffffff' },
          isRTL && styles.rtl
        ]}>
          <View style={styles.header}>
            <Text style={[
              styles.title,
              { color: isDark ? '#ffffff' : '#374151' },
              isRTL && styles.rtlText
            ]}>
              {contract.title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[
                styles.closeText,
                { color: isDark ? '#ffffff' : '#374151' }
              ]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={[
              styles.infoText,
              { color: isDark ? '#d1d5db' : '#6b7280' }
            ]}>
              {t('contract.analysisDate')}: {contract.analysisDate}
            </Text>
            <Text style={[
              styles.infoText,
              { color: isDark ? '#d1d5db' : '#6b7280' }
            ]}>
              {t('contract.complianceScore')}: {contract.complianceScore}%
            </Text>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[
              styles.contentText,
              { color: isDark ? '#ffffff' : '#374151' },
              isRTL && styles.rtlText
            ]}>
              {contract.content}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  rtl: {
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  rtlText: {
    textAlign: 'right',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  content: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
