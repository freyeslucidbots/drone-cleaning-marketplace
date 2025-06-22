import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './auth.css';

const AdminSignIn = () => {
  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <h1>Administrator Sign In</h1>
          <p>Please enter your administrator credentials.</p>
          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" className="auth-button">Sign In as Admin</button>
          </form>
          <div className="auth-footer">
            <p>Not an admin? <Link to="/auth/signin">Return to user sign-in</Link>.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminSignIn; 