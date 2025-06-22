import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Drone Cleaning Marketplace &mdash; Powered by Lucid</p>
        <div className="footer-links">
          <Link to="/admin/login" className="footer-link">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 