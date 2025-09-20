import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
import {
  QrCodeScanner,
  Search,
  PhotoCamera,
  Upload,
  Inventory,
  TrendingUp,
} from '@mui/icons-material';

const ScanProductPage: React.FC = () => {
  const features = [
    {
      icon: <QrCodeScanner sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'QR Code Scanning',
      description: 'Scan product QR codes to instantly access ESG information and supply chain transparency data.',
      status: 'Coming Soon',
    },
    {
      icon: <PhotoCamera sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Image Recognition',
      description: 'Take photos of products to identify them and retrieve their ESG ratings and sustainability metrics.',
      status: 'Coming Soon',
    },
    {
      icon: <Search sx={{ fontSize: 48, color: 'success.main' }} />,
      title: 'Product Search',
      description: 'Search for products by name, brand, or barcode to discover their environmental and social impact.',
      status: 'Coming Soon',
    },
    {
      icon: <Upload sx={{ fontSize: 48, color: 'warning.main' }} />,
      title: 'Batch Upload',
      description: 'Upload multiple product identifiers at once for comprehensive ESG analysis and reporting.',
      status: 'Coming Soon',
    },
  ];

  const useCases = [
    'Supply Chain Transparency',
    'Sustainable Procurement',
    'ESG Compliance Checking',
    'Consumer Education',
    'Retailer Verification',
    'Impact Assessment',
  ];

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Product Scanning
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Scan, identify, and analyze products to discover their ESG ratings, sustainability metrics, 
          and supply chain transparency information in real-time.
        </Typography>

        {/* Status Alert */}
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
          <Typography variant="body2">
            <strong>Feature in Development:</strong> Our product scanning capabilities are currently being developed. 
            This feature will be available in a future release of the LinkedTrust platform.
          </Typography>
        </Alert>
      </Box>

      {/* Features Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                  {feature.icon}
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
                
                <Chip
                  label={feature.status}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Use Cases Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <TrendingUp color="primary" />
            Use Cases
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Product scanning will enable various ESG and sustainability applications
          </Typography>
        </Box>

        <Grid container spacing={2} justifyContent="center">
          {useCases.map((useCase, index) => (
            <Grid item key={index}>
              <Chip
                label={useCase}
                variant="outlined"
                color="primary"
                sx={{
                  py: 2,
                  px: 1,
                  height: 'auto',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Call to Action */}
      <Paper
        elevation={1}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 3,
        }}
      >
        <Inventory sx={{ fontSize: 64, mb: 3, opacity: 0.9 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Stay Informed
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', opacity: 0.9 }}>
          Be the first to know when our product scanning features become available. 
          These tools will revolutionize how you assess and verify product sustainability.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
            disabled // Placeholder for future notification signup
          >
            Get Notified
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              px: 4,
              '&:hover': {
                borderColor: 'grey.300',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
            onClick={() => window.location.href = '/'}
          >
            Explore Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ScanProductPage;
