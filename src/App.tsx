import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { Dashboard } from './pages';
import { Box, Typography } from '@mui/material';

const Companies = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Companies
    </Typography>
    <Typography variant="body1">
      Company listings will be displayed here
    </Typography>
  </Box>
);

const ScanProduct = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Scan Product
    </Typography>
    <Typography variant="body1">
      Product scanning functionality will be available here
    </Typography>
  </Box>
);

const CompanyDetails = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Company Details
    </Typography>
    <Typography variant="body1">
      Detailed company information will be displayed here
    </Typography>
  </Box>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/scan" element={<ScanProduct />} />
          <Route path="/company/:id" element={<CompanyDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
