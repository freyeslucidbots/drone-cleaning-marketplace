import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/layout/LandingPage';
import MainLayout from './components/layout/MainLayout';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import Jobs from './components/jobs/Jobs';
import Pilots from './components/pilots/Pilots';
import OnboardPilot from './components/onboarding/OnboardPilot';
import OnboardPM from './components/onboarding/OnboardPM';
import './App.css';

// A wrapper for routes that should have the main layout (navbar, footer, etc.)
const AppRoutes = () => (
  <MainLayout>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/pilots" element={<Pilots />} />
      <Route path="/onboard-pilot" element={<OnboardPilot />} />
      <Route path="/onboard-pm" element={<OnboardPM />} />
    </Routes>
  </MainLayout>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {/* All other app routes go here */}
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 