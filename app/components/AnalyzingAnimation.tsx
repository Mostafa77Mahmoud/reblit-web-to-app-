
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface AnalyzingAnimationProps {
  isAnalyzing: boolean;
}

const AnalyzingAnimation: React.FC<AnalyzingAnimationProps> = ({ isAnalyzing }) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);
  const progressAnim = new Animated.Value(0);

  const analysisSteps = [
    { nameKey: 'analyze.step.initial', durationFactor: 2.5 },
    { nameKey: 'analyze.step.extractText', durationFactor: 4.5 },
    { nameKey: 'analyze.step.identifyTerms', durationFactor: 5 },
    { nameKey: 'analyze.step.shariaComplianceCheck', durationFactor: 6 },
    { nameKey: 'analyze.step.generateSuggestions', durationFactor: 5 },
    { nameKey: 'analyze.step.compileResults', durationFactor: 4 }
  ];

  useEffect(() => {
    if (isAnalyzing) {
      setShowCompletion(false);
      setCurrentStepIndex(0);
      setProgress(0);
      
      // Fade in animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      // Progress simulation
      const totalSteps = analysisSteps.length;
      const stepDuration = 1800;
      let currentStep = 0;

      const stepInterval = setInterval(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStepIndex(currentStep + 1);
          currentStep++;
        } else {
          clearInterval(stepInterval);
        }
      }, stepDuration);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (totalSteps * stepDuration / 100));
          if (newProgress >= 99) {
            clearInterval(progressInterval);
            return 99;
          }
          return newProgress;
        });
      }, 100);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    } else {
      if (progress > 0 && progress < 100) {
        setProgress(100);
        setCurrentStepIndex(analysisSteps.length);
        setShowCompletion(true);
        
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 3500);
      }
    }
  }, [isAnalyzing]);

  if (!isAnalyzing && !showCompletion) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              {isAnalyzing ? '⟳' : '✓'}
            </Text>
          </View>
          <Text style={styles.title}>
            {isAnalyzing ? t('upload.analyzing') : t('analyze.complete')}
          </Text>
          <Text style={styles.percentage}>
            {Math.round(isAnalyzing ? progress : 100)}%
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${isAnalyzing ? progress : 100}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.stepsContainer}>
          {analysisSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex || (!isAnalyzing && showCompletion);
            const isActive = index === currentStepIndex && isAnalyzing;
            
            return (
              <View key={step.nameKey} style={styles.stepItem}>
                <View style={[
                  styles.stepIcon,
                  isCompleted && styles.stepIconCompleted,
                  isActive && styles.stepIconActive,
                ]}>
                  <Text style={[
                    styles.stepIconText,
                    isCompleted && styles.stepIconTextCompleted,
                    isActive && styles.stepIconTextActive,
                  ]}>
                    {isCompleted ? '✓' : isActive ? '⟳' : '○'}
                  </Text>
                </View>
                <Text style={[
                  styles.stepText,
                  isCompleted && styles.stepTextCompleted,
                  isActive && styles.stepTextActive,
                ]}>
                  {t(step.nameKey)}
                </Text>
              </View>
            );
          })}
        </View>

        {showCompletion && (
          <Text style={styles.completionMessage}>
            {t('analyze.viewResults')}
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#10b981',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    marginLeft: 8,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  stepsContainer: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIconCompleted: {
    backgroundColor: '#d1fae5',
  },
  stepIconActive: {
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  stepIconText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  stepIconTextCompleted: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  stepIconTextActive: {
    color: '#10b981',
  },
  stepText: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 1,
  },
  stepTextCompleted: {
    color: '#10b981',
    fontWeight: '500',
  },
  stepTextActive: {
    color: '#374151',
    fontWeight: '600',
  },
  completionMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
});

export default AnalyzingAnimation;
