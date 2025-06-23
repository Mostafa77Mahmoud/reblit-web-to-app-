
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/api";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EnhancedThemeProvider } from "./contexts/EnhancedThemeContext";
import { SessionProvider } from "./contexts/SessionContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import MobileApp from "./components/MobileApp";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";



/**
 * Enhanced App Component
 * 
 * Root application component with comprehensive enhancements:
 * - Enhanced React Query for optimized data fetching
 * - Enhanced theme provider with smooth transitions
 * - Enhanced auth provider with improved user experience
 * - Enhanced session provider for better state management
 * - Enhanced toasts with better positioning and styling
 * - Enhanced routing with smooth page transitions
 * - Enhanced animations and micro-interactions
 * - Enhanced accessibility and keyboard navigation
 * - Enhanced performance optimizations
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <EnhancedThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SessionProvider>
            <TooltipProvider delayDuration={300}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                {/* Enhanced toast notifications */}
                <Toaster />
                <Sonner 
                  position="top-right"
                  expand={true}
                  richColors={true}
                  closeButton={true}
                />
                
                {/* Mobile-first application */}
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
                  <LanguageProvider>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/*" element={<MobileApp />} />
                    </Routes>
                  </LanguageProvider>
                </div>
              </motion.div>
            </TooltipProvider>
          </SessionProvider>
        </AuthProvider>
      </BrowserRouter>
    </EnhancedThemeProvider>
  </QueryClientProvider>
);

export default App;
