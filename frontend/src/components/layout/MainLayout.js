import React from 'react';
import { Link } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <h2>Professional Drone Cleaning Services</h2>
        <p>Connect property managers with certified drone operators for safe, efficient, and professional exterior cleaning services.</p>
        <Link to="/signup" className="btn btn-primary">Get Started Today</Link>
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

export default MainLayout; 