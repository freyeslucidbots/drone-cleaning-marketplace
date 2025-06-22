import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Placeholder pages
const Home = () => (
  <div className="App">
    <header className="app-header">
      <h1>Drone Cleaning Marketplace</h1>
      <p className="subtitle">
        Connect with certified drone operators for professional exterior cleaning services
      </p>
      <nav className="main-nav">
        <Link to="/auth/signin" className="nav-link">Sign In</Link>
        <Link to="/auth/signup" className="nav-link">Sign Up</Link>
        <Link to="/jobs" className="nav-link">Browse Jobs</Link>
        <Link to="/pilots" className="nav-link">Find Pilots</Link>
      </nav>
    </header>

    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Professional Drone Cleaning Services</h1>
        <p className="hero-subtitle">
          Connect property managers with certified drone operators for safe, efficient, and professional exterior cleaning services.
        </p>
        <Link to="/auth/signup" className="hero-cta">Get Started Today</Link>
      </div>
    </section>

    <main className="main-content">
      <div className="content-grid">
        <div className="info-section">
          <h2>For Property Managers</h2>
          <p>Post your cleaning projects and receive competitive bids from certified drone operators. Get professional results with transparent pricing.</p>
          <Link to="/onboarding/property-manager" className="cta-btn">Post a Job</Link>
        </div>
        
        <div className="info-section">
          <h2>For Drone Pilots</h2>
          <p>Join our marketplace of certified operators. Access exclusive jobs, build your portfolio, and grow your drone cleaning business.</p>
          <Link to="/onboarding/pilot" className="cta-btn">Become a Pilot</Link>
        </div>
        
        <div className="info-section">
          <h2>Lucid Suite Customers</h2>
          <p>Access exclusive jobs and priority bidding. Drive more Robot Operating Minutes (ROMs) with our integrated marketplace.</p>
          <Link to="/auth/signin" className="cta-btn">Sign In with Lucid</Link>
        </div>
      </div>
    </main>

    <section className="features-section">
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">✓</div>
          <h3>Certified Pilots</h3>
          <p>All operators are verified and certified for commercial drone operations</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Competitive Pricing</h3>
          <p>Get multiple bids and choose the best value for your cleaning projects</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Fully Insured</h3>
          <p>All pilots carry comprehensive insurance for your peace of mind</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast Service</h3>
          <p>Quick response times and efficient project completion</p>
        </div>
      </div>
    </section>

    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Drone Cleaning Marketplace &mdash; Powered by Lucid</p>
    </footer>
  </div>
);

const SignIn = () => (
  <div className="App">
    <div className="page-container">
      <h1 className="page-title">Sign In</h1>
      <div className="page-content">
        <p>Sign in form goes here.</p>
      </div>
    </div>
  </div>
);

const SignUp = () => (
  <div className="App">
    <div className="page-container">
      <h1 className="page-title">Sign Up</h1>
      <div className="page-content">
        <p>Sign up form goes here.</p>
      </div>
    </div>
  </div>
);

const OnboardPM = () => (
  <div className="App">
    <div className="page-container">
      <h1 className="page-title">Property Manager Onboarding</h1>
      <div className="page-content">
        <p>Onboarding steps for property managers.</p>
      </div>
    </div>
  </div>
);

const OnboardPilot = () => (
  <div className="App">
    <div className="page-container">
      <h1 className="page-title">Pilot Onboarding</h1>
      <div className="page-content">
        <p>Onboarding steps for pilots.</p>
      </div>
    </div>
  </div>
);

const Jobs = () => (
  <div className="App">
    <div className="page-container">
      <h1 className="page-title">Job Listings</h1>
      <div className="page-content">
        <p>Job posting and browsing UI goes here.</p>
      </div>
    </div>
  </div>
);

const Bids = () => (
  <div className="App">
    <div className="page-container">
      <h1 className="page-title">Bidding</h1>
      <div className="page-content">
        <p>Bidding UI goes here.</p>
      </div>
    </div>
  </div>
);

const Pilots = () => (
  <div className="App">
    <div className="page-container">
      <h1 className="page-title">Pilot Directory</h1>
      <div className="page-content">
        <p>Pilot directory UI goes here.</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/onboarding/property-manager" element={<OnboardPM />} />
      <Route path="/onboarding/pilot" element={<OnboardPilot />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/bids" element={<Bids />} />
      <Route path="/pilots" element={<Pilots />} />
    </Routes>
  );
}

export default App;
