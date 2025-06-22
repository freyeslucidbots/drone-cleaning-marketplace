import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './header.css';
import logo from '../../lucid-bots-logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <img src={logo} alt="Lucid Bots" className="logo" />
          </Link>
        </div>

        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/jobs" className="nav-link">Jobs</Link>
          <Link to="/pilots" className="nav-link">Pilots</Link>
          {user && (
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <button 
                className="user-menu-button"
                onClick={toggleUserMenu}
              >
                <span className="user-avatar">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-name">{user.firstName || 'User'}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p><strong>{user.firstName} {user.lastName}</strong></p>
                    <p className="user-email">{user.email}</p>
                    <p className="user-role">{user.role?.replace('_', ' ')}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  {user.role === 'pilot' && (
                    <Link to="/subscription" className="dropdown-item">Subscription</Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signin" className="btn-secondary">Sign In</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </div>
          )}

          <button 
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 