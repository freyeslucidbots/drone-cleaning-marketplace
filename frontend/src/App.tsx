import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MainLayout from './components/layout/MainLayout';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import Jobs from './components/jobs/Jobs';
import Pilots from './components/pilots/Pilots';
import OnboardPilot from './components/onboarding/OnboardPilot';
import OnboardPM from './components/onboarding/OnboardPM';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<MainLayout />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/pilots" element={<Pilots />} />
              <Route path="/onboard/pilot" element={<OnboardPilot />} />
              <Route path="/onboard/pm" element={<OnboardPM />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 