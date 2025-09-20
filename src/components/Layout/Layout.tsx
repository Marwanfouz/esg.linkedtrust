import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  maxWidth = 'xl',
  disableGutters = false 
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3, md: 4 },
          backgroundColor: 'background.default',
        }}
      >
        {maxWidth ? (
          <Container 
            maxWidth={maxWidth} 
            disableGutters={disableGutters}
            sx={{ height: '100%' }}
          >
            {children}
          </Container>
        ) : (
          <Box sx={{ px: disableGutters ? 0 : 2 }}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Layout;
