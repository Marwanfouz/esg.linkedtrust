import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Button,
  Grid,
  LinearProgress,
  Divider,
  Stack,
  Tooltip,
  Link,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Verified,
  ExpandMore,
  ExpandLess,
  TrendingUp,
  People,
  ThumbUp,
  ThumbDown,
  Assessment,
  LinkedIn,
  Twitter,
  Language,
  Business,
} from '@mui/icons-material';
import type { ValidationMetrics } from '../../services/esgCalculations';

interface ValidationEndorsementsProps {
  validationMetrics: ValidationMetrics;
  companyName?: string;
}

const ValidationEndorsements: React.FC<ValidationEndorsementsProps> = ({
  validationMetrics,
  companyName = 'Company'
}) => {
  const [showAllValidations, setShowAllValidations] = useState(false);
  
  const {
    totalValidations,
    endorsements,
    rejections,
    averageRating,
    endorsementRate,
    consensusPercentage,
    verifiedRate,
    validationHistory
  } = validationMetrics;

  // Show maximum 5 validations initially
  const displayedValidations = showAllValidations 
    ? validationHistory 
    : validationHistory.slice(0, 5);

  const hasMoreValidations = validationHistory.length > 5;

  // Calculate rating distribution for visualization
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    validationHistory.forEach(validation => {
      const rating = Math.round(validation.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const neutralReviews = totalValidations - endorsements - rejections; // 3-star reviews

  // Calculate color for endorsement rate
  const getEndorsementColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'primary';
    if (rate >= 40) return 'warning';
    return 'error';
  };

  // Calculate color for consensus
  const getConsensusColor = (percentage: number) => {
    if (percentage >= 85) return 'success';
    if (percentage >= 70) return 'primary';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  // Format validator name for avatar
  const getValidatorInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Get rating color with softer palette
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'success.main';
    if (rating >= 3) return 'primary.main';
    if (rating >= 2) return 'orange.main';
    return 'grey.600'; // Softer than red
  };


  if (totalValidations === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <Verified color="action" />
            Validation & Endorsements
          </Typography>
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            color: 'text.secondary'
          }}>
            <Assessment sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">
              No validations available for {companyName}
            </Typography>
            <Typography variant="body2">
              Validation data will appear here once ESG assessments are submitted.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 600, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <Verified color="success" />
          Validation & Endorsements
        </Typography>

        {/* Validation Summary Stats */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Tooltip title="Number of individuals who provided ratings and assessments" arrow>
                <Box sx={{ textAlign: 'center', cursor: 'help' }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5
                  }}>
                    <People fontSize="small" />
                    {totalValidations}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Community Reviews
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                    Independent assessments
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Tooltip title="Percentage of reviews with 4 or 5 stars (considered positive endorsements)" arrow>
                <Box sx={{ textAlign: 'center', cursor: 'help' }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: getEndorsementColor(endorsementRate),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5
                  }}>
                    <ThumbUp fontSize="small" />
                    {Math.round(endorsementRate)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Positive Rating Rate
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                    4-5 star ratings
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Tooltip title="How closely reviewers agree on the rating (within 1 star of the average)" arrow>
                <Box sx={{ textAlign: 'center', cursor: 'help' }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: getConsensusColor(consensusPercentage),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5
                  }}>
                    <TrendingUp fontSize="small" />
                    {Math.round(consensusPercentage)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Community Agreement
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                    Rating consistency
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Tooltip title="Percentage of reviewers with verified professional credentials and expertise" arrow>
                <Box sx={{ textAlign: 'center', cursor: 'help' }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5
                  }}>
                    <Verified fontSize="small" />
                    {Math.round(verifiedRate)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Verified Reviewers
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                    Credentialed evaluators
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>

        {/* Endorsement Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Community Assessment Results
            </Typography>
            <Tooltip title="Endorsements are reviews with 4 or 5 star ratings" arrow>
              <Typography variant="subtitle2" color="text.secondary" sx={{ cursor: 'help' }}>
                {endorsements} Positive Reviews out of {totalValidations} Total
              </Typography>
            </Tooltip>
          </Box>
          <LinearProgress
            variant="determinate"
            value={endorsementRate}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: endorsementRate >= 80 ? 'success.main' : 
                               endorsementRate >= 60 ? 'primary.main' : 
                               endorsementRate >= 40 ? 'warning.main' : 'error.main',
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbUp fontSize="small" color="success" />
              <Typography variant="caption" color="success.main">
                {endorsements} Positive Reviews (4-5 ⭐)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbDown fontSize="small" sx={{ color: 'grey.600' }} />
              <Typography variant="caption" sx={{ color: 'grey.600' }}>
                {rejections} Critical Reviews (1-2 ⭐)
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Rating Distribution Visualization */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Rating Distribution Breakdown
          </Typography>
          <Grid container spacing={2}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars as keyof typeof ratingDistribution];
              const percentage = totalValidations > 0 ? (count / totalValidations) * 100 : 0;
              const color = stars >= 4 ? 'success' : stars === 3 ? 'primary' : 'error';
              
              return (
                <Grid item xs={12} key={stars}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 80, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {stars} ⭐
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: `${color}.main`,
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 60, textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        {count} ({percentage.toFixed(0)}%)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          
          {/* Summary row */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="caption" color="success.dark" sx={{ fontWeight: 600 }}>
                    Positive (4-5 ⭐)
                  </Typography>
                  <Typography variant="h6" color="success.dark" sx={{ fontWeight: 700 }}>
                    {endorsements} ({Math.round(endorsementRate)}%)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 600 }}>
                    Neutral (3 ⭐)
                  </Typography>
                  <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 700 }}>
                    {neutralReviews} ({totalValidations > 0 ? Math.round((neutralReviews / totalValidations) * 100) : 0}%)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'error.50', borderRadius: 1 }}>
                  <Typography variant="caption" color="error.dark" sx={{ fontWeight: 600 }}>
                    Critical (1-2 ⭐)
                  </Typography>
                  <Typography variant="h6" color="error.dark" sx={{ fontWeight: 700 }}>
                    {rejections} ({totalValidations > 0 ? Math.round((rejections / totalValidations) * 100) : 0}%)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Methodology Explanation */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.light' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'info.dark' }}>
            How Community Ratings Work
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="info.dark" sx={{ mb: 1 }}>
                <strong>Endorsement Criteria:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • 4-5 star ratings = Positive endorsement<br/>
                • 3 star ratings = Neutral feedback<br/>
                • 1-2 star ratings = Critical feedback
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="info.dark" sx={{ mb: 1 }}>
                <strong>Verification Process:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Professional credentials verified<br/>
                • ESG expertise confirmed<br/>
                • Independent assessment required
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" color="info.dark" sx={{ fontStyle: 'italic' }}>
            Community Agreement measures how closely reviewers agree (within 1 star of average rating).
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Individual Validations */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Individual Validations
        </Typography>

        <Stack spacing={3}>
          {displayedValidations.map((validation) => (
            <Card
              key={validation.id}
              sx={{
                border: '1px solid',
                borderColor: validation.rating >= 4 ? 'success.light' : 
                           validation.rating >= 3 ? 'primary.light' : 
                           validation.rating >= 2 ? 'orange.light' : 'grey.300',
                borderRadius: 3,
                bgcolor: validation.rating >= 4 ? 'success.50' : 
                        validation.rating >= 3 ? 'primary.50' : 
                        validation.rating >= 2 ? 'orange.50' : 'grey.50',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Avatar 
                    src={validation.profileImage}
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: getRatingColor(validation.rating),
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      border: '3px solid',
                      borderColor: 'background.paper'
                    }}
                  >
                    {getValidatorInitials(validation.validatorName)}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    {/* Header with name and verification */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {validation.validatorName}
                        </Typography>
                        {validation.verified && (
                          <Tooltip title="Verified Professional">
                            <Verified sx={{ fontSize: 18, color: 'success.main' }} />
                          </Tooltip>
                        )}
                      </Box>
                      
                      {/* Social Media Links */}
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {validation.linkedinUrl && (
                          <Tooltip title="LinkedIn Profile">
                            <IconButton
                              size="small"
                              component={Link}
                              href={validation.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                color: '#0077B5',
                                '&:hover': { bgcolor: 'rgba(0, 119, 181, 0.1)' }
                              }}
                            >
                              <LinkedIn fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {validation.twitterUrl && (
                          <Tooltip title="Twitter Profile">
                            <IconButton
                              size="small"
                              component={Link}
                              href={validation.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                color: '#1DA1F2',
                                '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.1)' }
                              }}
                            >
                              <Twitter fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {validation.websiteUrl && (
                          <Tooltip title="Personal Website">
                            <IconButton
                              size="small"
                              component={Link}
                              href={validation.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.light' }
                              }}
                            >
                              <Language fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Role and Organization */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 500 }}>
                        {validation.validatorRole}
                      </Typography>
                      {validation.organization && (
                        <>
                          <Typography variant="caption" color="text.secondary">•</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Business sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {validation.organization}
                            </Typography>
                          </Box>
                        </>
                      )}
                      {validation.yearsExperience && (
                        <>
                          <Typography variant="caption" color="text.secondary">•</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {validation.yearsExperience}+ years exp.
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Expertise Tags */}
                    {validation.expertise && validation.expertise.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {validation.expertise.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 20,
                              borderColor: 'primary.light',
                              color: 'primary.dark',
                              '&:hover': { bgcolor: 'primary.light' }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating 
                        value={validation.rating} 
                        readOnly 
                        size="medium"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: getRatingColor(validation.rating),
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: getRatingColor(validation.rating) }}>
                        {validation.rating}/5
                      </Typography>
                    </Box>
                    
                    {/* Validation Statement */}
                    {validation.statement && (
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'background.paper', 
                        borderRadius: 2, 
                        border: '1px solid',
                        borderColor: 'grey.200',
                        mb: 2
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontStyle: 'italic',
                            color: 'text.primary',
                            lineHeight: 1.5,
                            '&::before': { content: '"', color: 'primary.main', fontSize: '1.2em' },
                            '&::after': { content: '"', color: 'primary.main', fontSize: '1.2em' }
                          }}
                        >
                          {validation.statement}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Timestamp */}
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Validated on {new Date(validation.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* View All/Show Less Button */}
        {hasMoreValidations && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAllValidations(!showAllValidations)}
              endIcon={showAllValidations ? <ExpandLess /> : <ExpandMore />}
              sx={{ textTransform: 'none' }}
            >
              {showAllValidations 
                ? 'Show Less' 
                : `View All ${validationHistory.length} Validations`
              }
            </Button>
          </Box>
        )}

        {/* Enhanced Average Rating Summary */}
        <Box sx={{ mt: 3, p: 3, bgcolor: 'primary.light', borderRadius: 2, border: '2px solid', borderColor: 'primary.main' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark', textAlign: 'center' }}>
            📊 Community Assessment Summary
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                  Overall Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <Rating 
                    value={averageRating} 
                    readOnly 
                    precision={0.1}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: 'primary.dark',
                      },
                    }}
                  />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {averageRating.toFixed(1)} out of 5.0
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                  Community Participation
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {totalValidations}
                </Typography>
                <Typography variant="body2" color="primary.dark">
                  Total Reviews
                </Typography>
                <Typography variant="caption" color="primary.dark" sx={{ display: 'block' }}>
                  {Math.round(verifiedRate)}% verified professionals
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
                  Community Agreement
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {Math.round(consensusPercentage)}%
                </Typography>
                <Typography variant="body2" color="primary.dark">
                  Rating Consistency
                </Typography>
                <Typography variant="caption" color="primary.dark" sx={{ display: 'block' }}>
                  Reviewers within 1 star
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ValidationEndorsements;
