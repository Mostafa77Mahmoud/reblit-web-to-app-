
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  username?: string;
  role: 'regular_user' | 'shariah_expert';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isGuestMode: boolean;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { authApi } = await import('@/lib/api');
      const response = await authApi.login(credentials);
      
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      setIsGuestMode(false);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Shariaa Analyzer"
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please check your credentials"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setIsLoading(true);
    try {
      const { authApi } = await import('@/lib/api');
      const response = await authApi.signup(credentials);
      
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      setIsGuestMode(false);
      
      toast({
        title: "Account Created",
        description: "Welcome to Shariaa Analyzer"
      });
    } catch (error) {
      console.error('Signup failed:', error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Please try again"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { authApi } = await import('@/lib/api');
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      setIsGuestMode(false);
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      
      toast({
        title: "Logged Out",
        description: "Come back soon!"
      });
    }
  };

  const continueAsGuest = () => {
    setIsGuestMode(true);
    setUser(null);
    
    toast({
      title: "Guest Mode",
      description: "You can explore limited features"
    });
  };

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
