import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { Dashboard, CompanyDetailsPage, CompaniesPage, ScanProductPage } from './pages';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/scan" element={<ScanProductPage />} />
          <Route path="/company/:id" element={<CompanyDetailsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
