import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ErrorBoundary } from './components';
import { Dashboard, CompanyDetailsPage, CompaniesPage, ScanProductPage } from './pages';


function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
