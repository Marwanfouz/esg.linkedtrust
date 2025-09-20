import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Business,
  Assessment,
  Refresh,
} from '@mui/icons-material';
import { useCompanies } from '../hooks';
import { CompanyGrid } from '../components/Company';
import { LoadingSpinner, ErrorMessage } from '../components/Common';

const Dashboard: React.FC = () => {
  const { companies, error, refetch, isLoading, isError } = useCompanies();

  // Calculate dashboard stats
  const totalCompanies = companies.length;
  const avgScore = companies.length > 0 
    ? companies.reduce((sum, company) => sum + company.score, 0) / companies.length 
    : 0;
  const highPerformers = companies.filter(company => company.grade.startsWith('A')).length;

  const stats = [
    {
      title: 'Total Companies',
      value: totalCompanies.toString(),
      icon: <Business sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      title: 'Average ESG Score',
      value: `${Math.round(((avgScore + 1) / 2) * 100)}%`,
      icon: <Assessment sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary.main',
    },
    {
      title: 'A-Grade Companies',
      value: highPerformers.toString(),
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
    },
  ];

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          ESG Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Transparency and accountability in corporate ESG performance
        </Typography>


        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                }}
              >
                <Box sx={{ flexShrink: 0 }}>
                  {stat.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>LinkedTrust Platform:</strong> Displaying ESG ratings and attestations from verified sources. 
            Data is continuously updated to ensure transparency and accuracy.
          </Typography>
        </Alert>
      </Box>

      {/* Companies Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Company Ratings
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`${totalCompanies} Companies`} size="small" />
              <Chip label="ESG Verified" color="success" size="small" />
              <Chip label="Real-time Data" color="primary" size="small" />
            </Box>
          </Box>
          
          {!isLoading && (
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={refetch}
              sx={{ textTransform: 'none' }}
            >
              Refresh
            </Button>
          )}
        </Box>

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner message="Loading company data..." />
        )}

        {/* Error State */}
        {isError && error && (
          <ErrorMessage
            error={error}
            onRetry={refetch}
            title="Failed to Load Companies"
          />
        )}

        {/* Companies Grid */}
        {!isLoading && !isError && (
          <CompanyGrid companies={companies} />
        )}

        {/* Empty State */}
        {!isLoading && !isError && companies.length === 0 && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'grey.50',
            }}
          >
            <Business sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="text.secondary">
              No Companies Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Company data will appear here once available.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
