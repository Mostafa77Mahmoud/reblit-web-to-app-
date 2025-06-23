
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export interface User {
  id: string;
  email: string;
  role: 'regular_user' | 'shariah_expert';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: api.LoginCredentials) => Promise<void>;
  signup: (credentials: api.SignupCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isGuestMode: boolean;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false for guest mode
  const [isGuestMode, setIsGuestMode] = useState(true); // Start in guest mode
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthSuccess = useCallback((authResponse: api.AuthResponse) => {
    localStorage.setItem('authToken', authResponse.token);
    setUser(authResponse.user);
    setIsGuestMode(false);
    navigate('/');
  }, [navigate]);

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const profile = await api.getUserProfile();
        setUser(profile.user);
        setIsGuestMode(false);
      } catch (error) {
        console.error("Session expired or token invalid", error);
        localStorage.removeItem('authToken');
        setUser(null);
        setIsGuestMode(true);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (credentials: api.LoginCredentials) => {
    try {
      const response = await api.loginUser(credentials);
      handleAuthSuccess(response);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
      throw error;
    }
  };

  const signup = async (credentials: api.SignupCredentials) => {
    try {
      const response = await api.signupUser(credentials);
      handleAuthSuccess(response);
      toast({ title: 'Signup Successful', description: 'Welcome!' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
      throw error;
    }
  };

  const continueAsGuest = useCallback(() => {
    setIsGuestMode(true);
    setUser(null);
    localStorage.removeItem('authToken');
    navigate('/');
    toast({ title: 'Guest Mode', description: 'You can use all features as a guest!' });
  }, [navigate, toast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authToken');
    setIsGuestMode(true);
    navigate('/');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user || isGuestMode, 
      user, 
      login, 
      signup, 
      logout, 
      isLoading,
      isGuestMode,
      continueAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
