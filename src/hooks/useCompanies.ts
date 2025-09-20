import { useState, useEffect } from 'react';
import type { CompanyCardData, LoadingState, ApiError } from '../types';
import { apiService } from '../services/api';
import { ESGCalculationEngine } from '../services/esgCalculations';
import { errorUtils } from '../services/utils';

// Custom hook for fetching company data with real ESG calculations
export const useCompanies = () => {
  const [companies, setCompanies] = useState<CompanyCardData[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCompanies = async () => {
    setLoading('loading');
    setError(null);

    try {
      // Fetch all rated claims from real API
      const response = await apiService.getRatedClaims();
      const claims = response.data;

      // Group claims by company subject
      const companiesBySubject = claims.reduce((acc, claim) => {
        const subject = claim.subject;
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(claim);
        return acc;
      }, {} as Record<string, typeof claims>);

      // Calculate ESG metrics for each company using SAME logic as company details
      const companiesData: CompanyCardData[] = Object.entries(companiesBySubject).map(([subject, companyClaims]) => {
        const esgMetrics = ESGCalculationEngine.calculateESGMetrics(companyClaims);
        const firstClaim = companyClaims[0];
        
        return {
          id: firstClaim.id,
          subject: subject,
          stars: esgMetrics.overallStars,
          score: esgMetrics.overallScore, // This is the raw score (-1 to 1)
          grade: esgMetrics.overallGrade,
        };
      });

      // Sort by overall score (highest first)
      companiesData.sort((a, b) => b.score - a.score);

      setCompanies(companiesData);
      setLoading('success');
    } catch (err) {
      console.error('Error fetching companies:', err);
      
      // Fallback to mock data if API fails - use SAME logic as main path
      try {
        const mockService = await import('../services/mockService');
        const mockClaims = await mockService.default.getRatedClaims();

        // Group claims by company subject (SAME as main path)
        const companiesBySubject = mockClaims.reduce((acc, claim) => {
          const subject = claim.subject;
          if (!acc[subject]) {
            acc[subject] = [];
          }
          acc[subject].push(claim);
          return acc;
        }, {} as Record<string, typeof mockClaims>);

        // Calculate ESG metrics for each company (SAME as main path)
        const companiesData: CompanyCardData[] = Object.entries(companiesBySubject).map(([subject, companyClaims]) => {
          const esgMetrics = ESGCalculationEngine.calculateESGMetrics(companyClaims);
          const firstClaim = companyClaims[0];
          
          return {
            id: firstClaim.id,
            subject: subject,
            stars: esgMetrics.overallStars,
            score: esgMetrics.overallScore, // This is the raw score (-1 to 1)
            grade: esgMetrics.overallGrade,
          };
        });

        // Sort by overall score (highest first)
        companiesData.sort((a, b) => b.score - a.score);

        setCompanies(companiesData);
        setLoading('success');
        
        // Clear any previous errors since we have working data
        setError(null);
      } catch (mockErr) {
        const apiError = errorUtils.handleApiError(err);
        setError(apiError);
        setLoading('error');
      }
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const refetch = () => {
    fetchCompanies();
  };

  return {
    companies,
    loading,
    error,
    refetch,
    isLoading: loading === 'loading',
    isSuccess: loading === 'success',
    isError: loading === 'error',
  };
};

export default useCompanies;
