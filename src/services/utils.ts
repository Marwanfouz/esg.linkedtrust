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

  // Validate ESG score consistency between dashboard and details
  validateScoreConsistency: (dashboardScore: number, detailsScore: number, companyName: string): boolean => {
    const dashboardPercentage = ((dashboardScore + 1) / 2) * 100;
    const detailsPercentage = ((detailsScore + 1) / 2) * 100;
    const difference = Math.abs(dashboardPercentage - detailsPercentage);
    
    // Allow for small rounding differences (0.5%)
    const isConsistent = difference <= 0.5;
    
    if (!isConsistent) {
      console.error(`Score inconsistency for ${companyName}:`, {
        dashboardScore,
        dashboardPercentage: Math.round(dashboardPercentage),
        detailsScore,
        detailsPercentage: Math.round(detailsPercentage),
        difference: Math.round(difference * 10) / 10
      });
    }
    
    return isConsistent;
  },

  // Validate grade matches percentage
  validateGradeConsistency: (score: number, grade: string, companyName: string): boolean => {
    const percentage = ((score + 1) / 2) * 100;
    let expectedGradePrefix = '';
    
    if (percentage >= 95) expectedGradePrefix = 'A+';
    else if (percentage >= 90) expectedGradePrefix = 'A';
    else if (percentage >= 85) expectedGradePrefix = 'A-';
    else if (percentage >= 80) expectedGradePrefix = 'B+';
    else if (percentage >= 75) expectedGradePrefix = 'B';
    else if (percentage >= 70) expectedGradePrefix = 'B-';
    else if (percentage >= 65) expectedGradePrefix = 'C+';
    else if (percentage >= 60) expectedGradePrefix = 'C';
    else if (percentage >= 55) expectedGradePrefix = 'C-';
    else if (percentage >= 50) expectedGradePrefix = 'D+';
    else if (percentage >= 45) expectedGradePrefix = 'D';
    else if (percentage >= 40) expectedGradePrefix = 'D-';
    else expectedGradePrefix = 'F';
    
    const isConsistent = grade === expectedGradePrefix;
    
    if (!isConsistent) {
      console.warn(`Grade inconsistency for ${companyName}:`, {
        score,
        percentage: Math.round(percentage),
        actualGrade: grade,
        expectedGrade: expectedGradePrefix
      });
    }
    
    return isConsistent;
  },

  // Validate A-grade classification
  validateAGradeClassification: (companies: CompanyCardData[]): { 
    correct: number; 
    incorrect: CompanyCardData[]; 
    expectedCount: number 
  } => {
    const results = companies.map(company => {
      const percentage = ((company.score + 1) / 2) * 100;
      const shouldBeAGrade = percentage >= 85;
      const isAGrade = company.grade.startsWith('A');
      
      return {
        company,
        percentage,
        shouldBeAGrade,
        isAGrade,
        isCorrect: shouldBeAGrade === isAGrade
      };
    });
    
    const correct = results.filter(r => r.isCorrect).length;
    const incorrect = results.filter(r => !r.isCorrect).map(r => r.company);
    const expectedCount = results.filter(r => r.shouldBeAGrade).length;
    
    if (incorrect.length > 0) {
      console.error('A-grade classification errors:', incorrect.map(c => ({
        name: c.subject,
        grade: c.grade,
        percentage: Math.round(((c.score + 1) / 2) * 100)
      })));
    }
    
    return { correct, incorrect, expectedCount };
  },
};

export default {
  transformUtils,
  errorUtils,
  loadingUtils,
  validationUtils,
};
