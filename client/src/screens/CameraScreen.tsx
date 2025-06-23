import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  X, 
  RotateCcw, 
  Download,
  Share,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  FileText,
  Zap,
  Sun,
  SunDim
} from 'lucide-react';
import Webcam from 'react-webcam';
import { useLanguage } from '@/contexts/LanguageContext';

interface CameraScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface CapturedImage {
  src: string;
  timestamp: Date;
}

interface AnalysisResult {
  complianceScore: number;
  status: 'compliant' | 'warning' | 'non-compliant';
  keyFindings: string[];
  recommendations: string[];
  processingTime: number;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onNavigate, onBack }) => {
  const { t, dir } = useLanguage();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage({
        src: imageSrc,
        timestamp: new Date()
      });
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const analyzeDocument = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    
    // Mock analysis result
    const mockResult: AnalysisResult = {
      complianceScore: Math.floor(Math.random() * 30) + 70, // 70-100
      status: Math.random() > 0.7 ? 'warning' : 'compliant',
      keyFindings: [
        "Document follows Islamic financial principles",
        "No interest-based transactions detected",
        "Profit-sharing mechanism identified",
        "Compliance with Shariaa guidelines"
      ],
      recommendations: [
        "Consider adding explicit Shariaa compliance clause",
        "Ensure profit-loss sharing ratios are clearly defined",
        "Add dispute resolution mechanism"
      ],
      processingTime: 2.3
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'from-green-500 to-emerald-500';
      case 'warning': return 'from-yellow-500 to-amber-500';
      case 'non-compliant': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-6 h-6" />;
      case 'warning': return <AlertTriangle className="w-6 h-6" />;
      case 'non-compliant': return <AlertTriangle className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col" dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <motion.button
          onClick={onBack}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
        
        <h1 className="text-white font-semibold">Document Scanner</h1>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setIsFlashOn(!isFlashOn)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
            whileTap={{ scale: 0.9 }}
          >
            {isFlashOn ? <Sun className="w-5 h-5" /> : <SunDim className="w-5 h-5" />}
          </motion.button>
          
          <motion.button
            onClick={switchCamera}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Camera/Image View */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!capturedImage ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                  facingMode: facingMode
                }}
              />
              
              {/* Overlay Guide */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-80 h-56 border-2 border-white/50 rounded-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: [0.9, 1, 0.9],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <p className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                      Position document within frame
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0"
            >
              <img
                src={capturedImage.src}
                alt="Captured document"
                className="w-full h-full object-cover"
              />
              
              {/* Analysis Overlay */}
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-0 left-0 right-0 p-4"
                >
                  <Card className="bg-card/95 backdrop-blur-lg border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full bg-gradient-to-r ${getStatusColor(analysisResult.status)} text-white`}>
                            {getStatusIcon(analysisResult.status)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Analysis Complete</h3>
                            <p className="text-sm text-muted-foreground">
                              Processed in {analysisResult.processingTime}s
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {analysisResult.complianceScore}%
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              analysisResult.status === 'compliant' 
                                ? 'bg-green-500/10 text-green-600' 
                                : 'bg-yellow-500/10 text-yellow-600'
                            }`}
                          >
                            {analysisResult.status === 'compliant' ? 'Compliant' : 'Needs Review'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Key Findings:</h4>
                        <div className="space-y-1">
                          {analysisResult.keyFindings.slice(0, 2).map((finding, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Loading Overlay */}
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                >
                  <Card className="p-6 bg-card/95 backdrop-blur-lg">
                    <CardContent className="text-center space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 mx-auto"
                      >
                        <Zap className="w-12 h-12 text-primary" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg">Analyzing Document</h3>
                        <p className="text-sm text-muted-foreground">
                          AI is processing your document for Shariaa compliance...
                        </p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-gradient-to-t from-black to-transparent">
        {!capturedImage ? (
          <div className="flex items-center justify-center">
            <motion.button
              onClick={capture}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Camera className="w-8 h-8 text-black" />
            </motion.button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Button
              onClick={retake}
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake
            </Button>

            {!analysisResult && !isAnalyzing && (
              <Button
                onClick={analyzeDocument}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Analyze Document
              </Button>
            )}

            {analysisResult && (
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                >
                  <Share className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onNavigate('results')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                >
                  View Full Report
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraScreen;