import React, { useMemo, useState } from 'react';
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
import type { ESGCategoryDetails, ESGCategoryKey, ESGAttributeDetail } from '../../types';

interface ESGAssessmentProps {
  esgMetrics: ESGMetrics;
  statement?: string;
  aspect?: string;
  categoryDetails?: Record<ESGCategoryKey, ESGCategoryDetails> | null;
}

const ESGAssessment: React.FC<ESGAssessmentProps> = ({
  esgMetrics,
  statement,
  aspect,
  categoryDetails: categoryDetailsProp
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

  // Layered navigation state
  const [activeLayer, setActiveLayer] = useState<'overview' | 'category' | 'details'>('overview');
  const [activeCategory, setActiveCategory] = useState<ESGCategoryKey | null>(null);
  const [activeAttribute, setActiveAttribute] = useState<ESGAttributeDetail | null>(null);

  const categoryDetails = categoryDetailsProp || null;

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

  const onOpenCategory = (key: ESGCategoryKey) => {
    setActiveCategory(key);
    setActiveLayer('category');
  };

  const onOpenAttribute = (attr: ESGAttributeDetail) => {
    setActiveAttribute(attr);
    setActiveLayer('details');
  };

  const onBack = () => {
    if (activeLayer === 'details') {
      setActiveLayer('category');
      setActiveAttribute(null);
    } else if (activeLayer === 'category') {
      setActiveLayer('overview');
      setActiveCategory(null);
    }
  };

  const renderHeader = (
    <Typography variant="h4" gutterBottom sx={{ 
      fontWeight: 700, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      mb: 3,
      background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      <Assessment sx={{ fontSize: 36, color: 'primary.main' }} />
      ESG Assessment
    </Typography>
  );

  return (
    <Paper elevation={2} sx={{ 
      p: 4, 
      mb: 4, 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid',
      borderColor: 'grey.100',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #2563eb 0%, #10b981 50%, #f59e0b 100%)',
      }
    }}>
      {renderHeader}
      
      {statement && (
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3, color: 'text.secondary' }}>
          {statement}
        </Typography>
      )}

      {/* Layer 1: Overall Score Card (Main Grade Card) */}
      <Card sx={{ 
        mb: 4, 
        background: `linear-gradient(135deg, ${getScoreColor(overallPercentage)} 0%, rgba(255,255,255,0.95) 100%)`,
        border: '2px solid',
        borderColor: getScoreColor(overallPercentage),
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
      }}>
        <CardContent sx={{ p: 4 }} onClick={() => setActiveLayer('category')}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                mb: 3
              }}>
                Overall ESG Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Box sx={{ 
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h1" sx={{ 
                    fontWeight: 800, 
                    color: getScoreColor(overallPercentage),
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '4rem'
                  }}>
                    {Math.round(overallPercentage)}
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary',
                    ml: 0.5
                  }}>
                    %
                  </Typography>
                </Box>
                <Box>
                  <Chip 
                    label={`Grade ${overallGrade}`} 
                    color={getGradeColor(overallGrade)}
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      height: 40,
                      px: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={overallPercentage}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${getScoreColor(overallPercentage)}, ${getScoreColor(overallPercentage)}dd)`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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

      {/* Layer 2: Category Cards (E/S/G) */}
      {activeLayer !== 'overview' && (
        <>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 700, 
        mb: 4,
        textAlign: 'center',
        color: 'text.primary'
      }}>
        ESG Pillar Breakdown
      </Typography>

      <Grid container spacing={3}>
        {/* Environmental Score */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            border: '3px solid', 
            borderColor: getScoreColor(environmentalScore),
            borderRadius: 4,
            position: 'relative',
            overflow: 'visible',
            background: `linear-gradient(135deg, ${getScoreColor(environmentalScore)}08 0%, #ffffff 100%)`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: `0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px ${getScoreColor(environmentalScore)}`,
              borderColor: getScoreColor(environmentalScore),
            }
          }}>
            <CardContent sx={{ pb: 1, cursor: 'pointer' }} onClick={() => onOpenCategory('environmental')}>
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
                <Typography variant="h2" sx={{ 
                  fontWeight: 800, 
                  color: getScoreColor(environmentalScore),
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  fontSize: '3rem'
                }}>
                  {Math.round(environmentalScore)}
                </Typography>
                <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 500 }}>
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
            <CardContent sx={{ pb: 1, cursor: 'pointer' }} onClick={() => onOpenCategory('social')}>
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
            <CardContent sx={{ pb: 1, cursor: 'pointer' }} onClick={() => onOpenCategory('governance')}>
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
        </>
      )}

      {/* Layer 3: Category Details (attributes & data streams) */}
      {activeLayer !== 'overview' && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {activeLayer === 'category' ? 'Category Details' : activeAttribute?.name}
            </Typography>
            <Chip label={activeLayer === 'details' ? 'Back to Category' : 'Back to Overview'} onClick={onBack} variant="outlined" />
          </Box>

          {activeLayer === 'category' && activeCategory && (
            <Grid container spacing={2}>
              {categoryDetails?.[activeCategory]?.attributes?.length
                ? categoryDetails[activeCategory].attributes.map(attr => (
                <Grid item xs={12} md={6} key={attr.id}>
                  <Card sx={{ cursor: 'pointer' }} onClick={() => onOpenAttribute(attr)}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{attr.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{attr.description}</Typography>
                      <LinearProgress variant="determinate" value={attr.valuePercentage} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
                      <Typography variant="caption" color="text.secondary">Weight: {attr.weightPercentage}% • Value: {attr.valuePercentage}%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
                : (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">No detailed attributes available for this category.</Typography>
                  </Grid>
                )}
            </Grid>
          )}

          {activeLayer === 'details' && activeAttribute && (
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{activeAttribute.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{activeAttribute.contributionExplanation}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Data Streams</Typography>
                {(activeAttribute.dataStreams || []).map(ds => (
                  <Box key={ds.id} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{ds.name}</Typography>
                    {ds.description && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{ds.description}</Typography>}
                    {ds.sourceUri && (
                      <Typography variant="caption" sx={{ color: 'primary.main' }}>
                        Source: <a href={ds.sourceUri} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{ds.sourceUri}</a>
                      </Typography>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Box>
      )}

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
