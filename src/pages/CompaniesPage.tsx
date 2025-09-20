import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Business,
  Refresh,
} from '@mui/icons-material';
import { useCompanies } from '../hooks';
import { CompanyGrid } from '../components/Company';
import { LoadingSpinner, ErrorMessage } from '../components/Common';

const CompaniesPage: React.FC = () => {
  const { companies, loading, error, refetch, isLoading, isError } = useCompanies();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter companies based on search term
  const filteredCompanies = React.useMemo(() => {
    if (!searchTerm.trim()) return companies;
    
    const term = searchTerm.toLowerCase();
    return companies.filter(company =>
      company.subject.toLowerCase().includes(term) ||
      company.grade.toLowerCase().includes(term)
    );
  }, [companies, searchTerm]);

  // Statistics
  const totalCompanies = companies.length;
  const filteredCount = filteredCompanies.length;
  const avgScore = companies.length > 0 
    ? companies.reduce((sum, company) => sum + company.score, 0) / companies.length 
    : 0;
  const gradeDistribution = companies.reduce((acc, company) => {
    const gradeLetter = company.grade.charAt(0);
    acc[gradeLetter] = (acc[gradeLetter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          All Companies
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Browse and search through our comprehensive database of ESG-rated companies
        </Typography>

        {/* Search and Filters */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search companies by name or grade..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{ textTransform: 'none' }}
                  disabled // Placeholder for future filter functionality
                >
                  Filters
                </Button>
                
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
            </Grid>
          </Grid>

          {/* Search Results Info */}
          {searchTerm && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredCount} of {totalCompanies} companies
              </Typography>
              <Chip
                label={`"${searchTerm}"`}
                size="small"
                onDelete={clearSearch}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </Paper>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {totalCompanies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Companies
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {Math.round(((avgScore + 1) / 2) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg ESG Score
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {gradeDistribution.A || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A-Grade Companies
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {(gradeDistribution.B || 0) + (gradeDistribution.C || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                B & C Grades
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>Real-time Data:</strong> Company ratings are updated regularly based on the latest ESG assessments 
            from verified sources. Click on any company card to view detailed ESG information.
          </Typography>
        </Alert>
      </Box>

      {/* Companies Section */}
      <Box>
        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner message="Loading companies..." />
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
        {!isLoading && !isError && filteredCompanies.length > 0 && (
          <CompanyGrid companies={filteredCompanies} />
        )}

        {/* No Results State */}
        {!isLoading && !isError && companies.length > 0 && filteredCompanies.length === 0 && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'grey.50',
            }}
          >
            <Search sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="text.secondary">
              No Companies Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              No companies match your search criteria. Try adjusting your search terms.
            </Typography>
            <Button
              variant="outlined"
              onClick={clearSearch}
              sx={{ textTransform: 'none' }}
            >
              Clear Search
            </Button>
          </Paper>
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
              No Companies Available
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

export default CompaniesPage;
