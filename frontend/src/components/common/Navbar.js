import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DroneClean
        </Link>
        <div className="navbar-links">
          <Link to="/jobs" className="nav-link">
            Browse Jobs
          </Link>
          <Link to="/pilots" className="nav-link">
            Find a Pilot
          </Link>
        </div>
        <div className="navbar-auth">
          <Link to="/signin" className="nav-link">
            Sign In
          </Link>
          <Link to="/signup" className="btn nav-btn">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 