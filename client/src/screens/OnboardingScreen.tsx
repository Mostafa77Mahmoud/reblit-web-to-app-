import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, FileText, Camera, Shield, Zap, CheckCircle, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Shariaa Analyzer",
    subtitle: "AI-Powered Islamic Compliance",
    description: "Your trusted companion for analyzing financial documents according to Islamic principles",
    icon: <FileText className="w-16 h-16" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    features: ["Advanced AI Analysis", "Real-time Results", "Secure & Private"]
  },
  {
    id: 2,
    title: "Smart Document Scanning",
    subtitle: "Capture with Your Camera",
    description: "Simply point your camera at any contract or document for instant analysis",
    icon: <Camera className="w-16 h-16" />,
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    features: ["OCR Technology", "Auto-Crop", "Multi-Format Support"]
  },
  {
    id: 3,
    title: "Shariaa Compliance Check",
    subtitle: "Expert-Level Analysis",
    description: "Get detailed insights on compliance with Islamic financial principles",
    icon: <Shield className="w-16 h-16" />,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    features: ["Detailed Reports", "Compliance Score", "Recommendations"]
  },
  {
    id: 4,
    title: "Lightning Fast Results",
    subtitle: "Instant Analysis",
    description: "Receive comprehensive analysis results in seconds, not hours",
    icon: <Zap className="w-16 h-16" />,
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    features: ["Sub-second Analysis", "Cloud Processing", "Offline Capable"]
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t, dir } = useLanguage();
  
  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
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

  const currentData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col" dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <motion.button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="p-2 rounded-full bg-card shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        
        <div className="flex space-x-2">
          {onboardingSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-primary w-8' : 'bg-muted w-2'
              }`}
              initial={{ width: 8 }}
              animate={{ width: index <= currentStep ? 32 : 8 }}
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          onClick={onComplete}
          className="text-muted-foreground hover:text-foreground"
        >
          Skip
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full max-w-md text-center"
          >
            {/* Icon with Gradient Background */}
            <motion.div
              className={`mx-auto mb-8 w-32 h-32 rounded-full bg-gradient-to-r ${currentData.gradient} p-8 shadow-2xl`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-white flex items-center justify-center h-full">
                {currentData.icon}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentData.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              className="text-xl text-primary font-semibold mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentData.subtitle}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-muted-foreground text-lg leading-relaxed mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentData.description}
            </motion.p>

            {/* Features */}
            <motion.div
              className="grid grid-cols-1 gap-3 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentData.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center justify-center space-x-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-8">
        <motion.div
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={nextStep}
            className={`w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r ${currentData.gradient} text-white shadow-2xl hover:shadow-3xl transition-all duration-300`}
          >
            {currentStep === onboardingSteps.length - 1 ? (
              <>
                Get Started
                <Users className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingScreen;