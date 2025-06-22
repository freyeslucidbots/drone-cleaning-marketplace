import React from 'react';
import './onboarding.css';

const OnboardPM = () => {
  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Property Manager Onboarding</h1>
        <p className="onboarding-subtitle">Complete your profile to post jobs</p>
        <form className="onboarding-form">
          <div className="input-group">
            <label htmlFor="companyName">Company Name (Optional)</label>
            <input type="text" id="companyName" placeholder="e.g., Real Estate Holdings Inc." />
          </div>
          <div className="input-group">
            <label htmlFor="address">Company Address</label>
            <input type="text" id="address" placeholder="123 Main St" required />
          </div>
          <div className="input-group">
            <label htmlFor="city">City</label>
            <input type="text" id="city" placeholder="Anytown" required />
          </div>
          <div className="input-group">
            <label htmlFor="state">State</label>
            <input type="text" id="state" placeholder="CA" required />
          </div>
          <div className="input-group">
            <label htmlFor="zip">Zip Code</label>
            <input type="text" id="zip" placeholder="12345" required />
          </div>
          <button type="submit" className="onboarding-button">Save and Continue</button>
        </form>
      </div>
    </div>
  );
};

export default OnboardPM; 