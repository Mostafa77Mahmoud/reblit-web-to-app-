import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, RotateCcw, Check, FlashOn, FlashOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface CameraScannerProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onCapture,
  onClose,
  isOpen,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { toast } = useToast();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode,
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        toast({
          title: 'Document Captured',
          description: 'Review and confirm the captured document',
        });
      }
    }
  }, [toast]);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      toast({
        title: 'Processing Document',
        description: 'Analyzing your document for Shariaa compliance',
      });
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center justify-between text-white">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Scan Document</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFlashOn(!flashOn)}
              className="text-white hover:bg-white/20"
            >
              {flashOn ? <FlashOff className="h-6 w-6" /> : <FlashOn className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative">
          {!capturedImage ? (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white/50 rounded-lg w-80 h-56 relative">
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>
                  
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm text-center">
                    Position document within frame
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured document"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          {!capturedImage ? (
            <div className="flex items-center justify-center space-x-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCamera}
                className="text-white hover:bg-white/20 w-12 h-12"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={capture}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white/50"
              >
                <Camera className="h-8 w-8 text-black" />
              </motion.button>
              
              <div className="w-12 h-12"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                onClick={retake}
                className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button
                onClick={confirmCapture}
                className="flex-1 bg-shariah-green hover:bg-shariah-green/90"
              >
                <Check className="h-4 w-4 mr-2" />
                Use Photo
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};