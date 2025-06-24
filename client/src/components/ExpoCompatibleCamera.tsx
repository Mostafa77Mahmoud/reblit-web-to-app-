
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ExpoCompatibleCameraProps {
  onCapture: (imageUri: string) => void;
}

export const ExpoCompatibleCamera: React.FC<ExpoCompatibleCameraProps> = ({ onCapture }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWebCapture = () => {
    // For web, use file input
    fileInputRef.current?.click();
  };

  const handleNativeCapture = async () => {
    try {
      // Dynamic import for Expo Camera (only works in Expo environment)
      if (typeof window !== 'undefined' && window.navigator?.product?.includes('ReactNative')) {
        const { launchCameraAsync, MediaTypeOptions } = await import('expo-image-picker');
        
        const result = await launchCameraAsync({
          mediaTypes: MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          onCapture(result.assets[0].uri);
        }
      } else {
        // Fallback to web camera
        handleWebCapture();
      }
    } catch (error) {
      console.log('Expo camera not available, falling back to file input');
      handleWebCapture();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onCapture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        onClick={handleNativeCapture}
        className="bg-shariah-green hover:bg-shariah-green/90 text-white px-8 py-4 rounded-xl"
        disabled={isCapturing}
      >
        <Camera className="h-6 w-6 mr-2" />
        {isCapturing ? 'Capturing...' : 'Take Photo'}
      </Button>
    </div>
  );
};
