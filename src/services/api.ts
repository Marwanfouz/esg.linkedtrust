import axios from 'axios';
import type { Claim, Node } from '../types';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:9000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions for backend communication
export const apiService = {
  // Claims endpoints
  getClaims: () => apiClient.get<Claim[]>('/claims'),
  getClaimById: (id: number) => apiClient.get<Claim>(`/claims/${id}`),
  getCompanyClaims: (subject: string) => apiClient.get<Claim[]>(`/claims?subject=${subject}`),
  getRatedClaims: () => apiClient.get<Claim[]>('/claims?claim=rated'),
  
  // Nodes endpoints
  getNodes: () => apiClient.get<Node[]>('/nodes'),
  getNodeById: (id: number) => apiClient.get<Node>(`/nodes/${id}`),
  getCompanyNodes: () => apiClient.get<Node[]>('/nodes?entType=ORGANIZATION'),
  
  // Search endpoints (for future implementation)
  searchClaims: (query: string) => apiClient.get<Claim[]>(`/claims/search?q=${query}`),
  searchNodes: (query: string) => apiClient.get<Node[]>(`/nodes/search?q=${query}`),
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to connect to server');
    } else {
      // Other error
      throw new Error('Request failed: ' + error.message);
    }
  }
);

export default apiService;
