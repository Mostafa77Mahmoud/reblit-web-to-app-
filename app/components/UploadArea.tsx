
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface UploadAreaProps {
  onFileSelected?: (file: any) => void;
  onAnalyze?: (file: any) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  isAnalyzing?: boolean;
  uploadError?: string;
  analysisError?: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelected,
  onAnalyze,
  isUploading = false,
  uploadProgress = 0,
  isAnalyzing = false,
  uploadError,
  analysisError,
}) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const scaleAnim = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedFile(file);
        onFileSelected?.(file);
      }
    } catch (error) {
      Alert.alert(
        t('error.fileType') || 'Error',
        t('upload.formats') || 'Please select a valid file format'
      );
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze?.(selectedFile);
    } else {
      Alert.alert(
        'No File Selected',
        'Please select a file to analyze.'
      );
    }
  };

  const renderUploadContent = () => {
    if (isUploading) {
      return (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingIcon}>⟳</Text>
          <Text style={styles.uploadingText}>
            {t('upload.uploading')} ({Math.round(uploadProgress)}%)
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${uploadProgress}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      );
    }

    if (selectedFile) {
      return (
        <View style={styles.selectedFileContainer}>
          <Text style={styles.fileIcon}>📄</Text>
          <Text style={styles.fileName}>{selectedFile.name}</Text>
          <Text style={styles.fileSelectedText}>
            {t('upload.fileSelected')}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.dropzoneContent}>
        <Text style={styles.uploadIcon}>⬆</Text>
        <Text style={styles.dragDropText}>{t('upload.dragDrop')}</Text>
        <Text style={styles.formatsText}>{t('upload.formats')}</Text>
      </View>
    );
  };

  const isProcessing = isUploading || isAnalyzing;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⬆</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{t('upload.title')}</Text>
          <Text style={styles.description}>{t('upload.description')}</Text>
        </View>
      </View>

      <Animated.View style={[styles.uploadArea, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[
            styles.dropzone,
            isUploading && styles.dropzoneUploading,
            selectedFile && styles.dropzoneSelected,
          ]}
          onPress={() => {
            handlePress();
            if (!isProcessing) {
              pickDocument();
            }
          }}
          disabled={isProcessing}
        >
          {renderUploadContent()}
        </TouchableOpacity>
      </Animated.View>

      {uploadError && !isProcessing && (
        <Text style={styles.errorText}>{uploadError}</Text>
      )}

      {selectedFile && !isProcessing && (
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={handleAnalyze}
          disabled={isProcessing}
        >
          <Text style={styles.analyzeButtonText}>
            {t('upload.analyze')}
          </Text>
          <Text style={styles.analyzeButtonIcon}>→</Text>
        </TouchableOpacity>
      )}

      {analysisError && !isProcessing && (
        <Text style={styles.errorText}>
          {t('error.analysisFailed') || 'Analysis Failed'}: {analysisError}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: '#10b981',
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
  uploadArea: {
    padding: 24,
  },
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    minHeight: 200,
  },
  dropzoneUploading: {
    borderColor: '#3b82f6',
    backgroundColor: '#dbeafe',
  },
  dropzoneSelected: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  uploadingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  uploadingIcon: {
    fontSize: 48,
    color: '#3b82f6',
  },
  uploadingText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    maxWidth: 300,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  selectedFileContainer: {
    alignItems: 'center',
    gap: 8,
  },
  fileIcon: {
    fontSize: 48,
    color: '#10b981',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
  },
  fileSelectedText: {
    fontSize: 14,
    color: '#6b7280',
  },
  dropzoneContent: {
    alignItems: 'center',
    gap: 12,
  },
  uploadIcon: {
    fontSize: 48,
    color: '#9ca3af',
  },
  dragDropText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  formatsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  analyzeButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 8,
    gap: 8,
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButtonIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
  },
});

export default UploadArea;
