import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BreastCancerLandingPage from './BreastCancerLandingPage';
import RiskAssessment from './components/RiskAssessment';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<BreastCancerLandingPage />} />
          <Route path="/risk-assessment" element={<RiskAssessment />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
