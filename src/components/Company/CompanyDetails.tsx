import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Rating,
  Link,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
 ddd
import {
  Business,
  Link as LinkIcon,
  TrendingUp,
} from '@mui/icons-material';
import type { Claim } from '../../types';
import { GradeChip } from '../Common';
import { transformUtils } from '../../services/utils';
import { calculateGrade } from '../../theme/theme';
import { useESGMetrics } from '../../hooks';
import { ESGAssessment, ValidationEndorsements } from './';
import type { ESGMetrics, ValidationMetrics } from '../../services/esgCalculations';

interface CompanyDetailsProps {
  claim: Claim;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ claim }) => {
  const companyName = transformUtils.extractCompanyName(claim.subject);
  
  // Use real ESG metrics calculation hook
  const { 
    esgMetrics, 
    validationMetrics, 
    hasData: hasESGData 
  } = useESGMetrics(claim.subject, claim.subject);
  
  // Use calculated metrics if available, otherwise fallback to claim data
  const displayMetrics = hasESGData ? esgMetrics : {
    overallScore: claim.score || 0,
    overallPercentage: ((claim.score || 0) + 1) / 2 * 100,
    overallStars: claim.stars || 0,
    overallGrade: calculateGrade(claim.score || 0),
    environmentalScore: 0,
    socialScore: 0,
    governanceScore: 0,
    confidenceLevel: claim.confidence || 0,
    industryPercentile: 50,
    totalValidations: 0,
    endorsements: 0,
    rejections: 0,
    averageRating: 0,
    endorsementRate: 0,
    consensusPercentage: 0,
    lastUpdated: new Date()
  } as ESGMetrics;
  
  const displayValidationMetrics = hasESGData && validationMetrics ? validationMetrics : {
    totalValidations: claim.validators?.length || 0,
    endorsements: claim.validators?.filter(v => v.rating >= 4).length || 0,
    rejections: claim.validators?.filter(v => v.rating <= 2).length || 0,
    averageRating: claim.stars || 0,
    endorsementRate: 0,
    consensusPercentage: 0,
    verifiedRate: 100,
    validationHistory: []
  } as ValidationMetrics;
  
  // Legacy values for backward compatibility
  const grade = displayMetrics.overallGrade;
  const scorePercentage = `${Math.round(displayMetrics.overallPercentage)}%`;
  const confidenceLevel = transformUtils.getConfidenceLevel(displayMetrics.confidenceLevel);

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
                    <Rating value={displayMetrics.overallStars} readOnly size="large" />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      ({displayMetrics.overallStars}/5)
                    </Typography>
                  </Box>
                  
                  <GradeChip grade={grade} size="medium" />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {scorePercentage}
                    </Typography>
                  </Box>
                  
                  {hasESGData && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                        {displayMetrics.industryPercentile}th percentile
                      </Typography>
                    </Box>
                  )}
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
          {/* ESG Assessment - Using new component with real calculations */}
          <ESGAssessment 
            esgMetrics={displayMetrics}
            statement={claim.statement}
            aspect={claim.aspect}
          />


          {/* Validation & Endorsements */}
          <ValidationEndorsements 
            validationMetrics={displayValidationMetrics}
            companyName={companyName}
          />
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
                  <Rating value={displayMetrics.overallStars} readOnly size="small" />
                  <Typography variant="body2">
                    {displayMetrics.overallStars}/5
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ESG Score
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {scorePercentage}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Confidence Level
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {confidenceLevel}
                </Typography>
              </Box>

              {hasESGData && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Industry Ranking
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>
                    {displayMetrics.industryPercentile}th percentile
                  </Typography>
                </Box>
              )}

              {displayValidationMetrics.totalValidations > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Validations
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {displayValidationMetrics.totalValidations} validators
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>


        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyDetails;
