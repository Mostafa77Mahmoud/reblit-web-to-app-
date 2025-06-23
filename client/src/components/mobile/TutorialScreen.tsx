import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, FileText, Shield, Star, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  illustration: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to Shariaa Analyzer',
    description: 'Analyze your contracts for Islamic compliance with AI-powered insights',
    icon: <Shield className="h-12 w-12 text-shariah-green" />,
    illustration: '🕌',
  },
  {
    id: 2,
    title: 'Scan Documents',
    description: 'Use your camera to scan contracts directly or upload files from your device',
    icon: <Camera className="h-12 w-12 text-shariah-green" />,
    illustration: '📸',
  },
  {
    id: 3,
    title: 'AI Analysis',
    description: 'Get instant compliance scores and detailed recommendations for improvement',
    icon: <FileText className="h-12 w-12 text-shariah-green" />,
    illustration: '🤖',
  },
  {
    id: 4,
    title: 'Save & Track',
    description: 'Store your contracts locally and track compliance history offline',
    icon: <Star className="h-12 w-12 text-shariah-green" />,
    illustration: '💾',
  },
];

interface TutorialScreenProps {
  onComplete: () => void;
  isVisible: boolean;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  onComplete,
  isVisible,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => nextStep(),
    onSwipedRight: () => prevStep(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  if (!isVisible) return null;

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex space-x-1">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-shariah-green'
                    : index < currentStep
                    ? 'bg-shariah-green/50'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            onClick={onComplete}
            className="text-sm text-muted-foreground"
          >
            Skip
          </Button>
        </div>

        {/* Content */}
        <div {...handlers} className="flex-1 flex flex-col items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-sm"
            >
              {/* Illustration */}
              <div className="mb-8">
                <div className="text-8xl mb-4">{currentTutorial.illustration}</div>
                {currentTutorial.icon}
              </div>

              {/* Content */}
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {currentTutorial.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {currentTutorial.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex-1 mr-2"
            >
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              className="flex-1 ml-2 bg-shariah-green hover:bg-shariah-green/90"
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          <div className="text-center mt-4 text-sm text-muted-foreground">
            {currentStep + 1} of {tutorialSteps.length}
          </div>
        </div>
      </div>
    </motion.div>
  );
};