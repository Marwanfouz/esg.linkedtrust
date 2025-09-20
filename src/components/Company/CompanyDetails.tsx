import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Rating,
  Link,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Business,
  Link as LinkIcon,
  Verified,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';
import type { Claim } from '../../types';
import { GradeChip } from '../Common';
import { transformUtils } from '../../services/utils';
import { calculateGrade } from '../../theme/theme';

interface CompanyDetailsProps {
  claim: Claim;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ claim }) => {
  const companyName = transformUtils.extractCompanyName(claim.subject);
  const grade = calculateGrade(claim.score || 0);
  const scorePercentage = transformUtils.formatScoreAsPercentage(claim.score || 0);
  const confidenceLevel = transformUtils.getConfidenceLevel(claim.confidence || 0);

  return (
    <Box>
      {/* Company Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
        <Grid container spacing={4}>
          {/* Logo and Basic Info */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  <Business sx={{ fontSize: '2.5rem' }} />
                </Avatar>
              </Grid>
              
              <Grid item xs>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                  {companyName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {claim.subject}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={claim.stars || 0} readOnly size="large" />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      ({claim.stars || 0}/5)
                    </Typography>
                  </Box>
                  
                  <GradeChip grade={grade} size="medium" />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {scorePercentage}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Founded
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  1994
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Headquarters
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Seattle, WA
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Industry
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  E-commerce & Cloud Computing
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Website
                </Typography>
                <Link
                  href="https://amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    amazon.com
                  </Typography>
                  <LinkIcon fontSize="small" />
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* ESG Statement */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment color="primary" />
              ESG Assessment
            </Typography>
            
            {claim.statement && (
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
                {claim.statement}
              </Typography>
            )}

            {/* Score Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                ESG Score Breakdown
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall ESG Score</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {scorePercentage}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={((claim.score || 0) + 1) / 2 * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: grade.startsWith('A') ? 'success.main' : 
                                     grade.startsWith('B') ? 'primary.main' : 
                                     grade.startsWith('C') ? 'warning.main' : 'error.main',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Aspect Information */}
            {claim.aspect && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Assessment Focus
                </Typography>
                <Chip 
                  label={claim.aspect.replace('-', ' ').toUpperCase()} 
                  variant="outlined" 
                  size="small"
                />
              </Box>
            )}
          </Paper>

          {/* Source Information */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Verified color="primary" />
              Source & Verification
            </Typography>

            <Grid container spacing={3}>
              {claim.author && (
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Author
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {claim.author}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {claim.curator && (
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Curator
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {claim.curator}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {claim.howKnown && (
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Verification Method
                    </Typography>
                    <Chip 
                      label={claim.howKnown.replace('_', ' ')} 
                      color="primary" 
                      variant="outlined" 
                      size="small"
                    />
                  </Box>
                </Grid>
              )}

              {claim.confidence && (
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Confidence Level
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {confidenceLevel}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({Math.round((claim.confidence || 0) * 100)}%)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {claim.sourceURI && (
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Source URL
                    </Typography>
                    <Link
                      href={claim.sourceURI}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
                    >
                      <LinkIcon fontSize="small" />
                      <Typography variant="body2">
                        {claim.sourceURI}
                      </Typography>
                    </Link>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Key Metrics */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Key Metrics
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ESG Grade
                </Typography>
                <GradeChip grade={grade} size="small" sx={{ mt: 0.5 }} />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Star Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Rating value={claim.stars || 0} readOnly size="small" />
                  <Typography variant="body2">
                    {claim.stars || 0}/5
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Score
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {scorePercentage}
                </Typography>
              </Box>

              {claim.confidence && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Confidence
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {confidenceLevel}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Validation & Endorsements */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Verified color="success" />
                Validation & Endorsements
              </Typography>
              
              {/* Primary Validator */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', borderRadius: 2, border: '1px solid', borderColor: 'success.main' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main', fontSize: '0.875rem' }}>
                    {claim.author?.charAt(0) || 'A'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                      {claim.author || 'ESG Rating Agency'}
                    </Typography>
                    <Typography variant="caption" color="success.dark">
                      Primary Validator
                    </Typography>
                  </Box>
                  <Chip 
                    label="Verified" 
                    size="small" 
                    color="success" 
                    sx={{ fontSize: '0.75rem', height: 20 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'success.dark', fontStyle: 'italic', mb: 1 }}>
                  "{claim.statement?.substring(0, 80)}..."
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={claim.stars || 0} readOnly size="small" />
                  <Typography variant="caption" color="success.dark">
                    Rated {claim.stars}/5
                  </Typography>
                </Box>
              </Box>

              {/* Additional Validators */}
              {claim.validators && claim.validators.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Additional Validators ({claim.validators.length})
                  </Typography>
                  
                  {claim.validators.map((validator, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                      {validator.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {validator.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {validator.role}
                      </Typography>
                    </Box>
                    <Rating value={validator.rating} readOnly size="small" />
                  </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', fontStyle: 'italic' }}>
                      "{validator.statement}"
                    </Typography>
                    {validator.organization && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                        {validator.organization}
                      </Typography>
                    )}
                  </Box>
                  ))}
                </>
              )}

              {/* Community Stats */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
                  Community Validation
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      {(claim.validators?.length || 0) + 1}
                    </Typography>
                    <Typography variant="caption" color="primary.dark">
                      Total Validators
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      {claim.validators && claim.validators.length > 0 
                        ? Math.round((claim.validators.filter(v => v.verified).length / claim.validators.length) * 100)
                        : 100}%
                    </Typography>
                    <Typography variant="caption" color="primary.dark">
                      Verified Rate
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyDetails;
