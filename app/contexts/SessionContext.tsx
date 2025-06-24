
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SessionData {
  sessionId?: string;
  analysisResults?: any[];
  complianceStats?: {
    currentUserEffectiveCompliantCount: number;
    currentUserEffectiveNonCompliantCount: number;
    overallCompliancePercentage: number;
  };
  originalContract?: string;
  detectedLanguage?: 'ar' | 'en';
}

interface SessionContextType {
  sessionData: SessionData;
  setSessionData: (data: SessionData) => void;
  clearSession: () => void;
  complianceStats?: SessionData['complianceStats'];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionData, setSessionDataState] = useState<SessionData>({});

  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    try {
      const data = await AsyncStorage.getItem('shariaa_session_data');
      if (data) {
        setSessionDataState(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  };

  const setSessionData = async (data: SessionData) => {
    try {
      const newData = { ...sessionData, ...data };
      setSessionDataState(newData);
      await AsyncStorage.setItem('shariaa_session_data', JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  };

  const clearSession = async () => {
    try {
      setSessionDataState({});
      await AsyncStorage.removeItem('shariaa_session_data');
    } catch (error) {
      console.error('Error clearing session data:', error);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessionData,
        setSessionData,
        clearSession,
        complianceStats: sessionData.complianceStats,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
