import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">DroneClean</Link>
      </div>
      <nav>
        <Link to="/jobs">Jobs</Link>
        <Link to="/pilots">Find a Pilot</Link>
        <Link to="/signin">Sign In</Link>
        <Link to="/signup" className="signup-button">Sign Up</Link>
      </nav>
    </header>
  );
};

export default Header; 