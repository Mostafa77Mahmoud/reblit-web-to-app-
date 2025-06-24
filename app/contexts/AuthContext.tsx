
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<void>;
  enterGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(true);

  useEffect(() => {
    // Initialize guest mode
    setIsGuestMode(true);
  }, []);

  const login = async (email: string, password: string) => {
    // Implement login logic here
    const mockUser = { id: '1', email, username: email.split('@')[0] };
    setUser(mockUser);
    setIsGuestMode(false);
  };

  const logout = () => {
    setUser(null);
    setIsGuestMode(true);
  };

  const signup = async (username: string, email: string, password: string) => {
    // Implement signup logic here
    const mockUser = { id: '1', email, username };
    setUser(mockUser);
    setIsGuestMode(false);
  };

  const enterGuestMode = () => {
    setIsGuestMode(true);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isGuestMode,
      login,
      logout,
      signup,
      enterGuestMode,
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
