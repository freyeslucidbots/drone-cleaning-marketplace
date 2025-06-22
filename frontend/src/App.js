import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Dashboard from './components/dashboard/Dashboard';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AdminSignIn from './components/auth/AdminSignIn';
import Jobs from './components/jobs/Jobs';
import Pilots from './components/pilots/Pilots';
import OnboardPilot from './components/onboarding/OnboardPilot';
import OnboardPM from './components/onboarding/OnboardPM';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/signin" />;
};

const LandingPage = () => (
  <>
    <section className="hero-section" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'}}>
      <div className="hero-content">
        <h1>Effortless Exterior Cleaning<br/>by Certified Drone Pilots</h1>
        <p style={{fontSize: '1.25rem', marginBottom: '2.5rem'}}>Connecting property managers with trusted, insured drone professionals for fast, safe, and eco-friendly building cleaning.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-primary">Get Started</Link>
          <Link to="/jobs" className="btn-secondary">Browse Jobs</Link>
        </div>
      </div>
    </section>
    <section className="features-section">
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🚁</div>
          <h3>Certified Pilots</h3>
          <p>All pilots are vetted, certified, and insured for your peace of mind.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💸</div>
          <h3>Competitive Bidding</h3>
          <p>Get the best price for your job with our transparent bidding system.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast Turnaround</h3>
          <p>Book, schedule, and complete jobs quickly with real-time updates.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌎</div>
          <h3>Eco-Friendly</h3>
          <p>Reduce water and chemical use with advanced drone cleaning technology.</p>
        </div>
      </div>
    </section>
  </>
);

const AppContent = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        {isLanding && <LandingPage />}
        {!isLanding && (
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin/login" element={<AdminSignIn />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/pilots" element={<Pilots />} />
            <Route path="/onboard/pilot" element={<ProtectedRoute><OnboardPilot /></ProtectedRoute>} />
            <Route path="/onboard/property-manager" element={<ProtectedRoute><OnboardPM /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App; 