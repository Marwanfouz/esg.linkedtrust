import { useState, useEffect } from 'react';
import type { CompanyCardData, LoadingState, ApiError } from '../types';
import mockService from '../services/mockService';
import { errorUtils } from '../services/utils';

// Custom hook for fetching company data
export const useCompanies = () => {
  const [companies, setCompanies] = useState<CompanyCardData[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCompanies = async () => {
    setLoading('loading');
    setError(null);

    try {
      const data = await mockService.getCompanyCardData();
      setCompanies(data);
      setLoading('success');
    } catch (err) {
      const apiError = errorUtils.handleApiError(err);
      setError(apiError);
      setLoading('error');
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
