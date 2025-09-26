import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Home,
  Business,
} from '@mui/icons-material';
import { useClaim } from '../hooks';
import ESGCalculationEngine from '../services/esgCalculations';
import { CompanyDetails } from '../components/Company';
import { LoadingSpinner, ErrorMessage } from '../components/Common';

const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const claimId = id ? parseInt(id, 10) : undefined;

  const { claim, esgMetrics, validationMetrics, error, refetch, isLoading, isError, hasESGData, allCompanyClaims } = useClaim(claimId);

  const handleBack = () => {
    navigate(-1);
  };

  const handleHomePage = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <Box>
        <LoadingSpinner message="Loading company details..." />
      </Box>
    );
  }

  if (isError && error) {
    return (
      <Box>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleHomePage();
            }}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none' }}
          >
            <Home fontSize="small" />
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Business fontSize="small" />
            Company Details
          </Typography>
        </Breadcrumbs>

        <ErrorMessage
          error={error}
          onRetry={refetch}
          title="Failed to Load Company Details"
        />
      </Box>
    );
  }

  if (!claim) {
    return (
      <Box>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleHomePage();
            }}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none' }}
          >
            <Home fontSize="small" />
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Business fontSize="small" />
            Company Details
          </Typography>
        </Breadcrumbs>

        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'grey.50',
          }}
        >
          <Business sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            Company Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The requested company details could not be found.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={handleBack}
          >
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Navigation */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleHomePage();
            }}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none' }}
          >
            <Home fontSize="small" />
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Business fontSize="small" />
            {claim.subject}
          </Typography>
        </Breadcrumbs>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ textTransform: 'none' }}
        >
          Back
        </Button>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Data Source:</strong> This information is sourced from verified ESG rating agencies and 
          continuously updated to ensure accuracy and transparency.
        </Typography>
      </Alert>


      {/* Company Details */}
      <CompanyDetails 
        claim={claim} 
        esgMetrics={esgMetrics}
        validationMetrics={validationMetrics}
        hasESGData={hasESGData}
        categoryDetails={hasESGData && allCompanyClaims && allCompanyClaims.length > 0 ? ESGCalculationEngine.getCategoryAttributeDetails(allCompanyClaims) : null}
      />
    </Box>
  );
};

export default CompanyDetailsPage;
