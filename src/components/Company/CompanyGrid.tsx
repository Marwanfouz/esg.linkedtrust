import React from 'react';
import { Grid, Skeleton, Box } from '@mui/material';
import { CompanyCardData } from '../../types';
import CompanyCard from './CompanyCard';

interface CompanyGridProps {
  companies: CompanyCardData[];
  loading?: boolean;
}

// Loading skeleton for company cards
const CompanyCardSkeleton: React.FC = () => (
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={24} width="60%" sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="rectangular" height={20} width={120} />
        <Skeleton variant="rectangular" height={24} width={40} sx={{ borderRadius: 12 }} />
      </Box>
      <Skeleton variant="rectangular" height={36} width="100%" sx={{ borderRadius: 1 }} />
    </Box>
  </Grid>
);

const CompanyGrid: React.FC<CompanyGridProps> = ({ companies, loading = false }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 8 }).map((_, index) => (
          <CompanyCardSkeleton key={index} />
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {companies.map((company) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
          <CompanyCard company={company} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CompanyGrid;
