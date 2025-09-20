import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Claim, LoadingState, ApiError } from '../types';
import { ESGCalculationEngine, type ESGMetrics, type ValidationMetrics } from '../services/esgCalculations';
import { apiService } from '../services/api';
import { errorUtils } from '../services/utils';

// Hook for fetching and calculating ESG metrics for a specific company
export const useESGMetrics = (companyUri?: string, companySubject?: string) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Fetch claims data from backend API
  const fetchClaims = useCallback(async () => {
    if (!companyUri && !companySubject) {
      setError(errorUtils.createError('Company identifier is required'));
      return;
    }

    setLoading('loading');
    setError(null);

    try {
      let response;
      
      // Try different API endpoints based on available data
      if (companyUri) {
        // Use subject-specific endpoint (preferred)
        response = await apiService.getClaimsBySubject(companyUri);
      } else if (companySubject) {
        // Use general claims endpoint with subject filter
        response = await apiService.getCompanyClaims(companySubject);
      }

      if (!response) {
        throw new Error('No valid API endpoint available');
      }

      let claimsData: any = response.data;
      
      // Handle different response formats
      if (!Array.isArray(claimsData)) {
        // If response is not an array, try to extract claims from nested structure
        if (claimsData && claimsData.claims && Array.isArray(claimsData.claims)) {
          claimsData = claimsData.claims;
        } else if (claimsData && typeof claimsData === 'object') {
          // If it's a single claim object, wrap it in an array
          claimsData = [claimsData];
        } else {
          // If we can't parse the data, throw an error to trigger fallback
          throw new Error('Invalid response format: expected array of claims');
        }
      }
      
      // Validate and process claims data
      const validClaims = claimsData.filter((claim: any) => 
        claim && 
        typeof claim.id === 'number' && 
        typeof claim.subject === 'string'
      );

      setClaims(validClaims);
      setLastFetched(new Date());
      setLoading('success');
    } catch (err) {
      console.error('Error fetching claims:', err);
      
      // Automatically fall back to mock data when API fails
      try {
        console.log('Falling back to mock data...');
        const mockService = await import('../services/mockService');
        
        let mockClaims;
        if (companySubject) {
          mockClaims = await mockService.default.getCompanyClaims(companySubject);
        } else {
          // If no specific company, get all claims and filter
          const allClaims = await mockService.default.getClaims();
          mockClaims = companyUri ? allClaims.filter(claim => 
            claim.subject.toLowerCase().includes(companyUri.toLowerCase())
          ) : allClaims;
        }
        
        setClaims(mockClaims);
        setLastFetched(new Date());
        setLoading('success');
        
        // Clear any previous errors since we have working data
        setError(null);
      } catch (mockErr) {
        console.error('Mock data fallback also failed:', mockErr);
        const apiError = errorUtils.handleApiError(err);
        setError(apiError);
        setLoading('error');
      }
    }
  }, [companyUri, companySubject]);

  // Auto-fetch on mount and when identifiers change
  useEffect(() => {
    if (companyUri || companySubject) {
      fetchClaims();
    }
  }, [fetchClaims]);

  // Calculate ESG metrics from claims data
  const esgMetrics = useMemo((): ESGMetrics => {
    if (claims.length === 0) {
      return ESGCalculationEngine.calculateESGMetrics([]);
    }

    const metrics = ESGCalculationEngine.calculateESGMetrics(claims);
    
    // Validate calculated metrics
    if (!ESGCalculationEngine.validateMetrics(metrics)) {
      console.warn('Invalid ESG metrics calculated:', metrics);
    }

    return metrics;
  }, [claims]);

  // Calculate validation metrics separately for detailed analysis
  const validationMetrics = useMemo((): ValidationMetrics => {
    return ESGCalculationEngine.calculateValidationMetrics(claims);
  }, [claims]);

  // Refresh data (manual trigger)
  const refresh = useCallback(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Check if data is stale (older than 5 minutes)
  const isStale = useMemo(() => {
    if (!lastFetched) return true;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastFetched < fiveMinutesAgo;
  }, [lastFetched]);

  return {
    // Raw data
    claims,
    
    // Calculated metrics
    esgMetrics,
    validationMetrics,
    
    // State management
    loading,
    error,
    lastFetched,
    isStale,
    
    // Actions
    refresh,
    
    // Convenience flags
    isLoading: loading === 'loading',
    isSuccess: loading === 'success',
    isError: loading === 'error',
    hasData: claims.length > 0,
    
    // Metrics convenience accessors
    overallScore: esgMetrics.overallScore,
    overallPercentage: esgMetrics.overallPercentage,
    overallStars: esgMetrics.overallStars,
    overallGrade: esgMetrics.overallGrade,
    environmentalScore: esgMetrics.environmentalScore,
    socialScore: esgMetrics.socialScore,
    governanceScore: esgMetrics.governanceScore,
    confidenceLevel: esgMetrics.confidenceLevel,
    industryPercentile: esgMetrics.industryPercentile,
    
    // Validation metrics convenience accessors
    totalValidations: validationMetrics.totalValidations,
    endorsements: validationMetrics.endorsements,
    rejections: validationMetrics.rejections,
    averageRating: validationMetrics.averageRating,
    endorsementRate: validationMetrics.endorsementRate,
    consensusPercentage: validationMetrics.consensusPercentage,
    verifiedRate: validationMetrics.verifiedRate,
    validationHistory: validationMetrics.validationHistory,
  };
};

// Hook for fetching all companies with calculated ESG metrics
export const useAllESGMetrics = () => {
  const [companiesData, setCompaniesData] = useState<Array<{
    id: number;
    subject: string;
    uri?: string;
    esgMetrics: ESGMetrics;
  }>>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchAllCompanies = useCallback(async () => {
    setLoading('loading');
    setError(null);

    try {
      // Get all rated claims
      const response = await apiService.getRatedClaims();
      const claims = response.data;

      // Group claims by company
      const companiesBySubject = claims.reduce((acc, claim) => {
        const subject = claim.subject;
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(claim);
        return acc;
      }, {} as Record<string, Claim[]>);

      // Calculate ESG metrics for each company
      const companiesWithMetrics = Object.entries(companiesBySubject).map(([subject, companyClaims]) => {
        const esgMetrics = ESGCalculationEngine.calculateESGMetrics(companyClaims);
        const firstClaim = companyClaims[0];
        
        return {
          id: firstClaim.id,
          subject,
          uri: firstClaim.subject, // Use subject as URI for API calls
          esgMetrics
        };
      });

      // Sort by overall score (highest first)
      companiesWithMetrics.sort((a, b) => b.esgMetrics.overallScore - a.esgMetrics.overallScore);

      setCompaniesData(companiesWithMetrics);
      setLoading('success');
    } catch (err) {
      console.error('Error fetching all companies:', err);
      
      // Fallback to mock data
      try {
        console.log('Falling back to mock data for all companies...');
        const mockService = await import('../services/mockService');
        const mockClaims = await mockService.default.getRatedClaims();

        // Group claims by company
        const companiesBySubject = mockClaims.reduce((acc, claim) => {
          const subject = claim.subject;
          if (!acc[subject]) {
            acc[subject] = [];
          }
          acc[subject].push(claim);
          return acc;
        }, {} as Record<string, typeof mockClaims>);

        // Calculate ESG metrics for each company
        const companiesWithMetrics = Object.entries(companiesBySubject).map(([subject, companyClaims]) => {
          const esgMetrics = ESGCalculationEngine.calculateESGMetrics(companyClaims);
          const firstClaim = companyClaims[0];
          
          return {
            id: firstClaim.id,
            subject,
            uri: firstClaim.subject,
            esgMetrics
          };
        });

        // Sort by overall score (highest first)
        companiesWithMetrics.sort((a, b) => b.esgMetrics.overallScore - a.esgMetrics.overallScore);

        setCompaniesData(companiesWithMetrics);
        setLoading('success');
        
        // Clear any previous errors since we have working data
        setError(null);
      } catch (mockErr) {
        console.error('Mock data fallback also failed:', mockErr);
        const apiError = errorUtils.handleApiError(err);
        setError(apiError);
        setLoading('error');
      }
    }
  }, []);

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  return {
    companies: companiesData,
    loading,
    error,
    refresh: fetchAllCompanies,
    isLoading: loading === 'loading',
    isSuccess: loading === 'success',
    isError: loading === 'error',
    hasData: companiesData.length > 0,
  };
};

// Hook for real-time polling of ESG data
export const useRealTimeESGMetrics = (companyUri?: string, companySubject?: string, pollInterval = 30000) => {
  const esgData = useESGMetrics(companyUri, companySubject);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!companyUri && !companySubject) return;

    setIsPolling(true);
    const interval = setInterval(() => {
      if (!esgData.isLoading) {
        esgData.refresh();
      }
    }, pollInterval);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [companyUri, companySubject, pollInterval, esgData]);

  return {
    ...esgData,
    isPolling,
  };
};

export default useESGMetrics;
