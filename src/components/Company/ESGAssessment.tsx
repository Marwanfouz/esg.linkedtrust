import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Assessment,
  Nature,
  People,
  AccountBalance,
  TrendingUp,
  Info,
} from '@mui/icons-material';
import type { ESGMetrics } from '../../services/esgCalculations';

interface ESGAssessmentProps {
  esgMetrics: ESGMetrics;
  statement?: string;
  aspect?: string;
}

const ESGAssessment: React.FC<ESGAssessmentProps> = ({
  esgMetrics,
  statement,
  aspect
}) => {
  const {
    overallPercentage,
    overallGrade,
    environmentalScore,
    socialScore,
    governanceScore,
    confidenceLevel,
    industryPercentile,
    lastUpdated
  } = esgMetrics;

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'primary.main';
    if (score >= 40) return 'warning.main';
    return 'error.main';
  };

  // Get grade color
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'warning';
    return 'error';
  };

  // Format confidence level
  const getConfidenceLevel = (confidence: number): string => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.7) return 'Medium';
    if (confidence >= 0.6) return 'Moderate';
    return 'Low';
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'primary';
    if (confidence >= 0.4) return 'warning';
    return 'error';
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 600, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1 
      }}>
        <Assessment color="primary" />
        ESG Assessment
      </Typography>
      
      {statement && (
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3, color: 'text.secondary' }}>
          {statement}
        </Typography>
      )}

      {/* Overall Score Card */}
      <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
                Overall ESG Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: getScoreColor(overallPercentage) 
                }}>
                  {Math.round(overallPercentage)}%
                </Typography>
                <Chip 
                  label={`Grade ${overallGrade}`} 
                  color={getGradeColor(overallGrade)}
                  sx={{ fontSize: '1rem', fontWeight: 600, height: 32 }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={overallPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: getScoreColor(overallPercentage),
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Industry Percentile
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUp color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                      {industryPercentile}th
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Confidence Level
                  </Typography>
                  <Tooltip title={`Confidence: ${Math.round(confidenceLevel * 100)}%`}>
                    <Chip 
                      label={getConfidenceLevel(confidenceLevel)}
                      color={getConfidenceColor(confidenceLevel)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ESG Pillar Breakdown */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        ESG Pillar Breakdown
      </Typography>

      <Grid container spacing={3}>
        {/* Environmental Score */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            border: '2px solid', 
            borderColor: getScoreColor(environmentalScore),
            position: 'relative',
            overflow: 'visible'
          }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Nature sx={{ color: getScoreColor(environmentalScore) }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: getScoreColor(environmentalScore) }}>
                    Environmental
                  </Typography>
                </Box>
                <Chip 
                  label={`${Math.round((environmentalScore / overallPercentage) * 100)}% weight`}
                  size="small"
                  sx={{ 
                    bgcolor: 'success.light', 
                    color: 'success.dark',
                    fontSize: '0.7rem',
                    height: 20
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: getScoreColor(environmentalScore)
                }}>
                  {Math.round(environmentalScore)}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  /100
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  {environmentalScore >= 80 && <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>Excellent</Typography>}
                  {environmentalScore >= 60 && environmentalScore < 80 && <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>Good</Typography>}
                  {environmentalScore >= 40 && environmentalScore < 60 && <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>Fair</Typography>}
                  {environmentalScore < 40 && <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>Needs Improvement</Typography>}
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={environmentalScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: getScoreColor(environmentalScore),
                  },
                }}
              />
              
              <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                  Key Areas:
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Climate action & carbon reduction
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Renewable energy & efficiency  
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Waste management & sustainability
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Social Score */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            border: '2px solid', 
            borderColor: getScoreColor(socialScore),
            position: 'relative',
            overflow: 'visible'
          }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People sx={{ color: getScoreColor(socialScore) }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: getScoreColor(socialScore) }}>
                    Social
                  </Typography>
                </Box>
                <Chip 
                  label={`${Math.round((socialScore / overallPercentage) * 100)}% weight`}
                  size="small"
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.dark',
                    fontSize: '0.7rem',
                    height: 20
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: getScoreColor(socialScore)
                }}>
                  {Math.round(socialScore)}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  /100
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  {socialScore >= 80 && <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>Excellent</Typography>}
                  {socialScore >= 60 && socialScore < 80 && <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>Good</Typography>}
                  {socialScore >= 40 && socialScore < 60 && <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>Fair</Typography>}
                  {socialScore < 40 && <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>Needs Improvement</Typography>}
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={socialScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: getScoreColor(socialScore),
                  },
                }}
              />
              
              <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                  Key Areas:
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Employee wellbeing & diversity
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Community impact & relations
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Human rights & labor practices
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Governance Score */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            border: '2px solid', 
            borderColor: getScoreColor(governanceScore),
            position: 'relative',
            overflow: 'visible'
          }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance sx={{ color: getScoreColor(governanceScore) }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: getScoreColor(governanceScore) }}>
                    Governance
                  </Typography>
                </Box>
                <Chip 
                  label={`${Math.round((governanceScore / overallPercentage) * 100)}% weight`}
                  size="small"
                  sx={{ 
                    bgcolor: 'warning.light', 
                    color: 'warning.dark',
                    fontSize: '0.7rem',
                    height: 20
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: getScoreColor(governanceScore)
                }}>
                  {Math.round(governanceScore)}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  /100
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  {governanceScore >= 80 && <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>Excellent</Typography>}
                  {governanceScore >= 60 && governanceScore < 80 && <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>Good</Typography>}
                  {governanceScore >= 40 && governanceScore < 60 && <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>Fair</Typography>}
                  {governanceScore < 40 && <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>Needs Improvement</Typography>}
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={governanceScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: getScoreColor(governanceScore),
                  },
                }}
              />
              
              <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                  Key Areas:
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Board independence & structure
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Transparency & disclosure
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  • Ethics & compliance programs
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weighting Explanation */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2, border: '1px solid', borderColor: 'info.main' }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'info.dark' }}>
          ESG Weighting Formula
        </Typography>
        <Typography variant="caption" color="info.dark" sx={{ display: 'block', mb: 1 }}>
          Overall ESG Score = (Environmental × 40%) + (Social × 30%) + (Governance × 30%)
        </Typography>
        <Typography variant="caption" color="info.dark">
          <strong>Current Calculation:</strong> ({Math.round(environmentalScore)} × 40%) + ({Math.round(socialScore)} × 30%) + ({Math.round(governanceScore)} × 30%) = {Math.round(overallPercentage)}%
        </Typography>
      </Box>

      {/* Aspect Information */}
      {aspect && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Assessment Focus
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={aspect.replace('-', ' ').toUpperCase()} 
              variant="outlined" 
              size="small"
              icon={<Info />}
            />
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Calculation Methodology Note */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2, border: '1px solid', borderColor: 'info.main' }}>
        <Typography variant="caption" color="info.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Info fontSize="small" />
          <strong>Calculation Method:</strong> ESG scores are calculated using weighted averages (Environmental: 40%, Social: 30%, Governance: 30%) 
          from verified claims, with confidence and recency factors applied. All calculations are performed in real-time using the latest available data.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ESGAssessment;
