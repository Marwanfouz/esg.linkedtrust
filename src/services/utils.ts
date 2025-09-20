import type { Claim, CompanyCardData, LoadingState, ApiError } from '../types';
import { calculateGrade } from '../theme/theme';

// Data transformation utilities
export const transformUtils = {
  // Convert Claim to CompanyCardData
  claimToCompanyCard: (claim: Claim): CompanyCardData => ({
    id: claim.id,
    subject: claim.subject,
    stars: claim.stars || 0,
    score: claim.score || 0,
    grade: calculateGrade(claim.score || 0),
  }),

  // Convert multiple claims to company card data
  claimsToCompanyCards: (claims: Claim[]): CompanyCardData[] => {
    return claims
      .filter(claim => claim.claim === 'rated' && claim.score !== undefined && claim.stars !== undefined)
      .map(transformUtils.claimToCompanyCard);
  },

  // Extract company name from subject (remove ticker if present)
  extractCompanyName: (subject: string): string => {
    // Remove ticker symbols in parentheses like "(AMZN)"
    return subject.replace(/\s*\([A-Z]+\)$/, '').trim();
  },

  // Format date for display
  formatDate: (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Format score as percentage
  formatScoreAsPercentage: (score: number): string => {
    const percentage = ((score + 1) / 2) * 100;
    return `${Math.round(percentage)}%`;
  },

  // Get confidence level text
  getConfidenceLevel: (confidence: number): string => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.7) return 'Medium';
    if (confidence >= 0.6) return 'Moderate';
    return 'Low';
  },

  // Sort claims by date (newest first)
  sortClaimsByDate: (claims: Claim[]): Claim[] => {
    return [...claims].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Group claims by aspect
  groupClaimsByAspect: (claims: Claim[]): Record<string, Claim[]> => {
    return claims.reduce((groups, claim) => {
      const aspect = claim.aspect || 'general';
      if (!groups[aspect]) {
        groups[aspect] = [];
      }
      groups[aspect].push(claim);
      return groups;
    }, {} as Record<string, Claim[]>);
  },
};

// Error handling utilities
export const errorUtils = {
  // Create standardized error object
  createError: (message: string, status?: number): ApiError => ({
    message,
    status,
  }),

  // Handle API errors
  handleApiError: (error: unknown): ApiError => {
    if (error instanceof Error) {
      return errorUtils.createError(error.message);
    }
    return errorUtils.createError('An unknown error occurred');
  },

  // Check if error is network related
  isNetworkError: (error: ApiError): boolean => {
    return error.message.toLowerCase().includes('network') || 
           error.message.toLowerCase().includes('fetch');
  },

  // Get user-friendly error message
  getFriendlyErrorMessage: (error: ApiError): string => {
    if (errorUtils.isNetworkError(error)) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (error.status === 404) {
      return 'The requested data was not found.';
    }
    
    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }
    
    return error.message || 'An unexpected error occurred.';
  },
};

// Loading state management utilities
export const loadingUtils = {
  // Create initial loading state
  createInitialState: (): LoadingState => 'idle',

  // Check if loading
  isLoading: (state: LoadingState): boolean => state === 'loading',

  // Check if success
  isSuccess: (state: LoadingState): boolean => state === 'success',

  // Check if error
  isError: (state: LoadingState): boolean => state === 'error',

  // Check if idle
  isIdle: (state: LoadingState): boolean => state === 'idle',
};

// Validation utilities
export const validationUtils = {
  // Validate claim data
  isValidClaim: (claim: any): claim is Claim => {
    return claim && 
           typeof claim.id === 'number' &&
           typeof claim.subject === 'string' &&
           typeof claim.claim === 'string';
  },

  // Validate score range
  isValidScore: (score: number): boolean => {
    return score >= -1 && score <= 1;
  },

  // Validate stars range
  isValidStars: (stars: number): boolean => {
    return Number.isInteger(stars) && stars >= 0 && stars <= 5;
  },

  // Validate confidence range
  isValidConfidence: (confidence: number): boolean => {
    return confidence >= 0 && confidence <= 1;
  },
};

export default {
  transformUtils,
  errorUtils,
  loadingUtils,
  validationUtils,
};
