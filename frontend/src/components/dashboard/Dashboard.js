import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscription status for pilots
      if (user.role === 'pilot') {
        const subResponse = await fetch('http://localhost:5000/api/subscriptions/status', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (subResponse.ok) {
          const subData = await subResponse.json();
          setSubscription(subData);
        }
      }

      // Fetch jobs for property managers
      if (user.role === 'property_manager') {
        const jobsResponse = await fetch('http://localhost:5000/api/jobs', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData);
        }
      }

      // Fetch bids for both roles
      const bidsResponse = await fetch('http://localhost:5000/api/bids', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        setBids(bidsData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionUpgrade = async (planId) => {
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/dashboard?canceled=true`
        })
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName || 'User'}!</h1>
        <p className="dashboard-subtitle">
          {user?.role === 'pilot' ? 'Pilot Dashboard' : 'Property Manager Dashboard'}
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Subscription Status for Pilots */}
        {user?.role === 'pilot' && (
          <div className="dashboard-card subscription-card">
            <h3>Subscription Status</h3>
            {subscription ? (
              <div className="subscription-info">
                <div className={`subscription-badge ${subscription.status}`}>
                  {subscription.status.toUpperCase()}
                </div>
                <p>Plan: {subscription.status}</p>
                {subscription.expiry && (
                  <p>Expires: {new Date(subscription.expiry).toLocaleDateString()}</p>
                )}
                <p>Status: {subscription.isActive ? 'Active' : 'Inactive'}</p>
                
                {subscription.status === 'free' && (
                  <button 
                    className="upgrade-btn"
                    onClick={() => handleSubscriptionUpgrade('basic')}
                  >
                    Upgrade to Basic
                  </button>
                )}
              </div>
            ) : (
              <p>Loading subscription...</p>
            )}
          </div>
        )}

        {/* Recent Jobs for Property Managers */}
        {user?.role === 'property_manager' && (
          <div className="dashboard-card">
            <h3>Recent Jobs</h3>
            {jobs.length > 0 ? (
              <div className="jobs-list">
                {jobs.slice(0, 5).map(job => (
                  <div key={job.id} className="job-item">
                    <h4>{job.title}</h4>
                    <p>Status: {job.status}</p>
                    <p>Budget: ${job.budget}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No jobs posted yet.</p>
            )}
            <button className="btn-primary">Post New Job</button>
          </div>
        )}

        {/* Recent Bids */}
        <div className="dashboard-card">
          <h3>Recent Bids</h3>
          {bids.length > 0 ? (
            <div className="bids-list">
              {bids.slice(0, 5).map(bid => (
                <div key={bid.id} className="bid-item">
                  <h4>{bid.job?.title}</h4>
                  <p>Amount: ${bid.amount}</p>
                  <p>Status: {bid.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No bids yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            {user?.role === 'property_manager' && (
              <>
                <button className="btn-secondary">Post New Job</button>
                <button className="btn-secondary">View All Jobs</button>
                <button className="btn-secondary">Find Pilots</button>
              </>
            )}
            {user?.role === 'pilot' && (
              <>
                <button className="btn-secondary">Browse Jobs</button>
                <button className="btn-secondary">Update Profile</button>
                <button className="btn-secondary">View Earnings</button>
              </>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="dashboard-card">
          <h3>Account Status</h3>
          <div className="account-status">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role?.replace('_', ' ')}</p>
            <p><strong>Status:</strong> {user?.isActive ? 'Active' : 'Inactive'}</p>
            {user?.company && (
              <p><strong>Company:</strong> {user.company}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 