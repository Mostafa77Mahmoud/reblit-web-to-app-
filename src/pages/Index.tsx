
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Index Page Component
 * 
 * Entry point that redirects to the main application
 */
const Index: React.FC = () => {
  const { isAuthenticated, isGuestMode } = useAuth();

  // Always redirect to home page since we support guest mode
  return <Navigate to="/home" replace />;
};

export default Index;
