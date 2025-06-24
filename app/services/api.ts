
// Mobile API service using your backend endpoints
const API_BASE_URL = 'http://localhost:5000'; // Update this with your Replit URL

// Type definitions from your API
export interface ApiAnalysisTerm {
  term_id: string;
  term_text: string;
  is_valid_sharia: boolean;
  sharia_issue?: string;
  reference_number?: string;
  modified_term?: string;
  is_confirmed_by_user?: boolean;
  confirmed_modified_text?: string | null;
  has_expert_feedback?: boolean;
  last_expert_feedback_id?: string | null;
  expert_override_is_valid_sharia?: boolean | null;
}

export interface AnalyzeApiResponse {
  message: string;
  analysis_results: ApiAnalysisTerm[];
  session_id: string;
  original_contract_plain?: string;
  detected_contract_language: 'ar' | 'en';
  original_cloudinary_url?: string;
}

export interface SessionDetailsApiResponse {
  _id: string;
  session_id: string;
  original_filename: string;
  analysis_timestamp: string;
  analysis_results: ApiAnalysisTerm[];
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // Use status text if JSON parsing fails
    }
    throw new Error(errorMessage);
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }
  
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return Promise.resolve(null as unknown as T);
  }
  
  return response.text() as unknown as Promise<T>;
}

export const uploadContractForAnalysis = async (
  file: any, 
  onUploadProgress?: (progress: number) => void
): Promise<AnalyzeApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  onUploadProgress?.(50);
  
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
  
  onUploadProgress?.(100);
  return handleResponse<AnalyzeApiResponse>(response);
};

export const getSessionHistory = async (): Promise<SessionDetailsApiResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/history`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    return handleResponse<SessionDetailsApiResponse[]>(response);
  } catch (error) {
    console.log('History not available in guest mode');
    return [];
  }
};

export const getUserStats = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats/user`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    return handleResponse<any>(response);
  } catch (error) {
    console.log('Stats not available in guest mode');
    return null;
  }
};

export const getSessionDetails = async (sessionId: string): Promise<SessionDetailsApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
    method: 'GET',
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
  return handleResponse<SessionDetailsApiResponse>(response);
};

export const askQuestion = async (
  sessionId: string, 
  questionText: string, 
  termId?: string, 
  termTextContent?: string
): Promise<string> => {
  const payload: { question: string; term_id?: string; term_text?: string } = { 
    question: questionText 
  };
  
  if (termId) payload.term_id = termId;
  if (termTextContent) payload.term_text = termTextContent;
  
  const response = await fetch(`${API_BASE_URL}/interact?session_id=${sessionId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify(payload),
  });
  
  return handleResponse<string>(response);
};

export const generateModifiedContract = async (sessionId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/generate_modified_contract`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify({ session_id: sessionId }),
  });
  return handleResponse<any>(response);
};

// API object for easier imports
export const api = {
  uploadContract: uploadContractForAnalysis,
  getHistory: getSessionHistory,
  getStats: getUserStats,
  getSessionDetails,
  askQuestion,
  generateModifiedContract,
};
