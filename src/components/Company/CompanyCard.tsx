import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
  Avatar,
} from '@mui/material';
import { Business, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CompanyCardData } from '../../types';
import { GradeChip } from '../Common';
import { transformUtils } from '../../services/utils';

interface CompanyCardProps {
  company: CompanyCardData;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/company/${company.id}`);
  };

  const companyName = transformUtils.extractCompanyName(company.subject);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
      onClick={handleViewDetails}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Company Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              mr: 2,
            }}
          >
            <Business />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {companyName}
            </Typography>
          </Box>
        </Box>

        {/* Rating and Grade */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={company.stars}
              readOnly
              size="small"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: 'primary.main',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              ({company.stars})
            </Typography>
          </Box>
          <GradeChip grade={company.grade} size="medium" />
        </Box>

        {/* Score Display */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ESG Score
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {transformUtils.formatScoreAsPercentage(company.score)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForward />}
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            py: 1,
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default CompanyCard;
