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
import { ESGCalculationEngine } from '../services/esgCalculations';
import { validationUtils } from '../services/utils';

const Dashboard: React.FC = () => {
  const { companies, error, refetch, isLoading, isError } = useCompanies();

  // Calculate dashboard stats using same logic as company details
  const totalCompanies = companies.length;
  
  // Calculate average ESG score from the SAME scores shown in company cards
  // This ensures dashboard average matches individual company scores
  const avgScore = companies.length > 0 
    ? companies.reduce((sum, company) => {
        // Validate score range before calculation
        if (company.score < -1 || company.score > 1) {
          console.warn(`Invalid score for ${company.subject}: ${company.score}`);
        }
        
        // Use the same percentage calculation as company details
        const percentage = ((company.score + 1) / 2) * 100;
        return sum + percentage;
      }, 0) / companies.length 
    : 0;
  
  // Count A-grade companies using same grade classification logic
  // A-grade = companies with 85%+ ESG scores (A-, A, A+)
  const highPerformers = companies.filter(company => {
    const percentage = ((company.score + 1) / 2) * 100;
    const isAGrade = percentage >= 85; // A-grade threshold
    
    // Validate grade consistency
    const expectedAGrade = company.grade.startsWith('A');
    if (isAGrade !== expectedAGrade) {
      console.warn(`Grade mismatch for ${company.subject}: percentage=${percentage}%, grade=${company.grade}`);
    }
    
    return isAGrade;
  }).length;

  // Add development-only validation logging
  if (process.env.NODE_ENV === 'development' && companies.length > 0) {
    // Validate A-grade classification
    const aGradeValidation = validationUtils.validateAGradeClassification(companies);
    
    // Validate individual company grades
    companies.forEach(company => {
      validationUtils.validateGradeConsistency(company.score, company.grade, company.subject);
    });
    
    console.log('Dashboard Calculation Validation:', {
      totalCompanies,
      avgScore: Math.round(avgScore),
      highPerformers,
      aGradeValidation: {
        expected: aGradeValidation.expectedCount,
        calculated: highPerformers,
        isCorrect: aGradeValidation.expectedCount === highPerformers
      },
      companies: companies.map(c => ({
        name: c.subject,
        score: c.score,
        percentage: Math.round(((c.score + 1) / 2) * 100),
        grade: c.grade,
        stars: c.stars,
        isAGrade: c.grade.startsWith('A')
      }))
    });
  }

  const stats = [
    {
      title: 'Total Companies',
      value: totalCompanies.toString(),
      icon: <Business sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      title: 'Average ESG Score',
      value: `${Math.round(avgScore)}%`,
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
