import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="new-header">
      <div className="header-content">
        <h1>Drone Cleaning Marketplace</h1>
        <p>Connect with certified drone operators for professional exterior cleaning services</p>
        <div className="header-buttons">
          <Link to="/signin" className="btn">Sign In</Link>
          <Link to="/signup" className="btn">Sign Up</Link>
          <Link to="/jobs" className="btn">Browse Jobs</Link>
          <Link to="/pilots" className="btn">Find Pilots</Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 