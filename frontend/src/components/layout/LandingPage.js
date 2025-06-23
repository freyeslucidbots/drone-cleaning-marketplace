import React from 'react';
import { Link } from 'react-router-dom';
import './layout/MainLayout.css'; // We can reuse the same CSS

const LandingPage = () => {
  const heroStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/hero-image.jpg)`
  };

  return (
    <div className="landing-page">
      <section className="hero-section" style={heroStyle}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Your Property, Our Priority</h1>
          <p>Connecting property managers with elite drone pilots for unparalleled exterior cleaning.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            <Link to="/jobs" className="btn btn-secondary">Browse Jobs</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>For Property Managers</h3>
          <p>Post your cleaning projects and receive competitive bids from certified drone operators. Get professional results with transparent pricing.</p>
          <Link to="/jobs" className="btn btn-secondary">Post a Job</Link>
        </div>
        <div className="feature-card">
          <h3>For Drone Pilots</h3>
          <p>Join Lucid Bots marketplace of certified operators. Access exclusive jobs, build your portfolio, and grow your drone cleaning business.</p>
          <Link to="/signup" className="btn btn-secondary">Become a Pilot</Link>
        </div>
        <div className="feature-card">
          <h3>Lucid Suite Customers</h3>
          <p>Access exclusive jobs and priority bidding. Drive more Robot Operating Minutes (ROMs) with our integrated marketplace.</p>
          <Link to="/signin" className="btn btn-secondary">Sign in with Lucid</Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 