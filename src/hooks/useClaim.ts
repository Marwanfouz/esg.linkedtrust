import { useState, useEffect } from 'react';
import type { Claim, LoadingState, ApiError } from '../types';
import mockService from '../services/mockService';
import { errorUtils } from '../services/utils';

// Custom hook for fetching a single claim
export const useClaim = (id: number | undefined) => {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchClaim = async (claimId: number) => {
    setLoading('loading');
    setError(null);

    try {
      const data = await mockService.getClaimById(claimId);
      setClaim(data);
      setLoading('success');
    } catch (err) {
      const apiError = errorUtils.handleApiError(err);
      setError(apiError);
      setLoading('error');
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

  return {
    claim,
    loading,
    error,
    refetch,
    isLoading: loading === 'loading',
    isSuccess: loading === 'success',
    isError: loading === 'error',
  };
};

export default useClaim;
