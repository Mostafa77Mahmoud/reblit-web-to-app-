import { QueryClient } from '@tanstack/react-query';

// API Configuration
export const API_BASE_URL = 'https://shariah-ai.netlify.app';

// Query Client Setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// API Request Helper
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token if available
  const token = localStorage.getItem('auth_token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text() as T;
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Auth API
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  role?: 'regular_user' | 'shariah_expert';
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (credentials: SignupCredentials): Promise<AuthResponse> =>
    apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: (): Promise<{ message: string }> =>
    apiRequest('/api/auth/logout', {
      method: 'POST',
    }),

  getProfile: (): Promise<User> =>
    apiRequest('/api/auth/profile'),
};

// Contract Analysis API
export interface AnalysisRequest {
  file?: File;
  text?: string;
  language?: 'ar' | 'en';
}

export interface AnalysisTerm {
  term_id: string;
  term_text: string;
  is_valid_sharia: boolean;
  sharia_issue?: string;
  reference_number?: string;
  modified_term?: string;
  expert_feedback?: any;
}

export interface AnalysisResult {
  session_id: string;
  terms: AnalysisTerm[];
  compliance_stats: {
    total_terms: number;
    compliant_count: number;
    non_compliant_count: number;
    compliance_percentage: number;
  };
  original_filename?: string;
  detected_language: 'ar' | 'en';
  analysis_timestamp: string;
}

export interface SessionData {
  session_id: string;
  terms: AnalysisTerm[];
  compliance_stats: any;
  session_details: {
    original_filename: string;
    original_format: string;
    detected_contract_language: 'ar' | 'en';
    analysis_timestamp: string;
  };
}

export const analysisApi = {
  // Upload and analyze contract
  analyzeContract: async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('auth_token');
    
    return apiRequest('/api/analyze', {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser do it
      },
    });
  },

  // Get session data
  getSession: (sessionId: string): Promise<SessionData> =>
    apiRequest(`/api/sessions/${sessionId}`),

  // Get user's analysis history
  getHistory: (): Promise<AnalysisResult[]> =>
    apiRequest('/api/history'),

  // Ask question about specific term
  askTermQuestion: (termId: string, question: string): Promise<{ answer: string }> =>
    apiRequest('/api/terms/question', {
      method: 'POST',
      body: JSON.stringify({ term_id: termId, question }),
    }),

  // Confirm term modification
  confirmTerm: (termId: string, modifiedText: string): Promise<{ success: boolean }> =>
    apiRequest('/api/terms/confirm', {
      method: 'POST',
      body: JSON.stringify({ term_id: termId, modified_text: modifiedText }),
    }),

  // Generate modified contract
  generateContract: (sessionId: string): Promise<{ download_url: string }> =>
    apiRequest('/api/generate/modified', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),
};

// Expert API (for expert users)
export const expertApi = {
  // Submit expert feedback
  submitFeedback: (termId: string, feedback: any): Promise<{ success: boolean }> =>
    apiRequest('/api/expert/feedback', {
      method: 'POST',
      body: JSON.stringify({ term_id: termId, feedback }),
    }),

  // Get pending reviews
  getPendingReviews: (): Promise<AnalysisTerm[]> =>
    apiRequest('/api/expert/pending'),
};

// Statistics API
export interface UserStats {
  total_analyses: number;
  compliance_rate: number;
  average_score: number;
  analyses_this_month: number;
  join_date: string;
  last_active: string;
}

export const statsApi = {
  getUserStats: (): Promise<UserStats> =>
    apiRequest('/api/stats/user'),
};

export default {
  auth: authApi,
  analysis: analysisApi,
  expert: expertApi,
  stats: statsApi,
};