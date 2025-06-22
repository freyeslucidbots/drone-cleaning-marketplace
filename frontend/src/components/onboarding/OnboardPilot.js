import React from 'react';
import './onboarding.css';

const OnboardPilot = () => {
  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Pilot Onboarding</h1>
        <p className="onboarding-subtitle">Complete your profile to start bidding on jobs</p>
        <form className="onboarding-form">
          <div className="input-group">
            <label htmlFor="businessName">Business Name (Optional)</label>
            <input type="text" id="businessName" placeholder="e.g., SkyHigh Cleaners" />
          </div>
          <div className="input-group">
            <label htmlFor="experience">Years of Experience</label>
            <input type="number" id="experience" placeholder="e.g., 5" />
          </div>
          <div className="input-group">
            <label htmlFor="radius">Service Radius (in miles)</label>
            <input type="number" id="radius" placeholder="e.g., 50" />
          </div>
          <div className="input-group">
            <label htmlFor="certification">FAA Part 107 Certification Number</label>
            <input type="text" id="certification" placeholder="Enter your certification number" required />
          </div>
          <div className="input-group">
            <label>Services Offered</label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="service" value="windows" /> Window Cleaning</label>
              <label><input type="checkbox" name="service" value="facade" /> Facade Cleaning</label>
              <label><input type="checkbox" name="service" value="roof" /> Roof Cleaning</label>
              <label><input type="checkbox" name="service" value="solar" /> Solar Panel Cleaning</label>
            </div>
          </div>
          <button type="submit" className="onboarding-button">Complete Profile</button>
        </form>
      </div>
    </div>
  );
};

export default OnboardPilot; 