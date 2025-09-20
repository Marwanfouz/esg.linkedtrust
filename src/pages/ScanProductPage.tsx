import React from 'react';
import {
  Box,
  Typography,
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

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Scan Products
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Scan QR codes, barcodes, or upload product images to instantly discover ESG ratings, 
          sustainability metrics, and supply chain transparency information.
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

    </Box>
  );
};

export default ScanProductPage;
