import { useState, useEffect, useMemo } from 'react';
import type { Claim, LoadingState, ApiError } from '../types';
import { apiService } from '../services/api';
import { ESGCalculationEngine } from '../services/esgCalculations';
import { errorUtils } from '../services/utils';

// Custom hook for fetching a single claim with ESG calculations
export const useClaim = (id: number | undefined) => {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [allCompanyClaims, setAllCompanyClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchClaim = async (claimId: number) => {
    setLoading('loading');
    setError(null);

    try {
      // First try to get the specific claim
      const claimResponse = await apiService.getClaimById(claimId);
      const claimData = claimResponse.data;
      
      if (!claimData) {
        throw new Error('Claim not found');
      }

      // Then fetch all claims for this company to calculate comprehensive ESG metrics
      let companyClaims: Claim[] = [];
      try {
        const companyResponse = await apiService.getClaimsBySubject(claimData.subject);
        companyClaims = companyResponse.data || [];
      } catch (companyErr) {
        // If subject-specific endpoint fails, try general company claims
        try {
          const fallbackResponse = await apiService.getCompanyClaims(claimData.subject);
          companyClaims = fallbackResponse.data || [];
        } catch (fallbackErr) {
          console.warn('Could not fetch company claims for comprehensive metrics:', fallbackErr);
          companyClaims = [claimData]; // Use only the single claim
        }
      }

      // Calculate ESG metrics for the company
      const esgMetrics = ESGCalculationEngine.calculateESGMetrics(companyClaims);
      
      // Enhance the claim with calculated metrics
      const enhancedClaim: Claim = {
        ...claimData,
        // Override with calculated values to ensure accuracy
        score: esgMetrics.overallScore,
        stars: esgMetrics.overallStars,
        confidence: esgMetrics.confidenceLevel,
      };

      setClaim(enhancedClaim);
      setAllCompanyClaims(companyClaims);
      setLoading('success');
    } catch (err) {
      console.error('Error fetching claim:', err);
      
      // Fallback to mock data if API fails
      try {
        console.log(`Falling back to mock data for claim ID: ${claimId}`);
        const mockService = await import('../services/mockService');
        const mockData = await mockService.default.getClaimById(claimId);
        
        if (mockData) {
          // Also get all company claims for comprehensive ESG metrics
          const allMockClaims = await mockService.default.getCompanyClaims(mockData.subject);
          
          // Calculate ESG metrics for consistency (SAME as main path)
          const esgMetrics = ESGCalculationEngine.calculateESGMetrics(allMockClaims);
          
          // Enhance the claim with calculated metrics (SAME as main path)
          const enhancedClaim: Claim = {
            ...mockData,
            // Override with calculated values to ensure accuracy
            score: esgMetrics.overallScore,
            stars: esgMetrics.overallStars,
            confidence: esgMetrics.confidenceLevel,
          };
          
          setClaim(enhancedClaim);
          setAllCompanyClaims(allMockClaims);
          setLoading('success');
          
          // Clear any previous errors since we have working data
          setError(null);
        } else {
          throw new Error('Claim not found in mock data');
        }
      } catch (mockErr) {
        console.error('Mock data fallback also failed:', mockErr);
        const apiError = errorUtils.handleApiError(err);
        setError(apiError);
        setLoading('error');
      }
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      fetchClaim(id);
    }
  }, [id]);

  const refetch = () => {
    if (id !== undefined) {
      fetchClaim(id);
    }
  };

  // Calculate comprehensive ESG metrics for the company
  const esgMetrics = useMemo(() => {
    if (allCompanyClaims.length === 0) return null;
    return ESGCalculationEngine.calculateESGMetrics(allCompanyClaims);
  }, [allCompanyClaims]);

  // Calculate validation metrics
  const validationMetrics = useMemo(() => {
    if (allCompanyClaims.length === 0) return null;
    return ESGCalculationEngine.calculateValidationMetrics(allCompanyClaims);
  }, [allCompanyClaims]);

  return {
    claim,
    esgMetrics,
    validationMetrics,
    allCompanyClaims,
    loading,
    error,
    refetch,
    isLoading: loading === 'loading',
    isSuccess: loading === 'success',
    isError: loading === 'error',
    hasESGData: esgMetrics !== null,
  };
};

export default useClaim;
