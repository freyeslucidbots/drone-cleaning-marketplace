import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0
  });

  // Mock data for demonstration
  const mockJobs = [
    {
      id: 1,
      title: 'High-rise Building Cleaning',
      location: 'Downtown Los Angeles',
      budget: '$2,500',
      status: 'open',
      postedDate: '2024-06-20'
    },
    {
      id: 2,
      title: 'Shopping Center Exterior',
      location: 'Beverly Hills',
      budget: '$1,800',
      status: 'in_progress',
      postedDate: '2024-06-18'
    },
    {
      id: 3,
      title: 'Office Complex Cleaning',
      location: 'Santa Monica',
      budget: '$3,200',
      status: 'completed',
      postedDate: '2024-06-15'
    }
  ];

  const mockBids = [
    {
      id: 1,
      jobTitle: 'High-rise Building Cleaning',
      amount: '$2,400',
      status: 'pending',
      submittedDate: '2024-06-21'
    },
    {
      id: 2,
      jobTitle: 'Shopping Center Exterior',
      amount: '$1,750',
      status: 'accepted',
      submittedDate: '2024-06-19'
    }
  ];

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalJobs: user?.role === 'property_manager' ? 12 : 8,
      activeJobs: user?.role === 'property_manager' ? 3 : 2,
      completedJobs: user?.role === 'property_manager' ? 9 : 6,
      totalEarnings: user?.role === 'pilot' ? '$15,400' : '$0'
    });
  }, [user]);

  const isPropertyManager = user?.role === 'property_manager';
  const isPilot = user?.role === 'pilot';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName || 'User'}!</h1>
        <p>Here's what's happening with your {isPropertyManager ? 'properties' : 'drone cleaning business'}.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{isPropertyManager ? 'Total Jobs Posted' : 'Jobs Applied'}</h3>
          <p className="stat-number">{stats.totalJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Active Jobs</h3>
          <p className="stat-number">{stats.activeJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completedJobs}</p>
        </div>
        {isPilot && (
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <p className="stat-number">{stats.totalEarnings}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          {isPropertyManager ? (
            <>
              <Link to="/jobs" className="action-btn primary">
                Post New Job
              </Link>
              <Link to="/jobs" className="action-btn secondary">
                View My Jobs
              </Link>
              <Link to="/pilots" className="action-btn secondary">
                Find Pilots
              </Link>
            </>
          ) : (
            <>
              <Link to="/jobs" className="action-btn primary">
                Find Jobs
              </Link>
              <Link to="/jobs" className="action-btn secondary">
                My Applications
              </Link>
              <Link to="/profile" className="action-btn secondary">
                Update Profile
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        
        {isPropertyManager ? (
          <div className="jobs-list">
            {mockJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className={`status ${job.status}`}>{job.status.replace('_', ' ')}</span>
                </div>
                <div className="job-details">
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Budget:</strong> {job.budget}</p>
                  <p><strong>Posted:</strong> {job.postedDate}</p>
                </div>
                <div className="job-actions">
                  <Link to={`/jobs/${job.id}`} className="btn-small">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bids-list">
            {mockBids.map(bid => (
              <div key={bid.id} className="bid-card">
                <div className="bid-header">
                  <h3>{bid.jobTitle}</h3>
                  <span className={`status ${bid.status}`}>{bid.status}</span>
                </div>
                <div className="bid-details">
                  <p><strong>Your Bid:</strong> {bid.amount}</p>
                  <p><strong>Submitted:</strong> {bid.submittedDate}</p>
                </div>
                <div className="bid-actions">
                  <Link to={`/jobs/${bid.id}`} className="btn-small">View Job</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <h2>Tips & Resources</h2>
        <div className="tips-grid">
          {isPropertyManager ? (
            <>
              <div className="tip-card">
                <h4>📋 Writing Great Job Descriptions</h4>
                <p>Include building details, access requirements, and specific cleaning needs to attract qualified pilots.</p>
              </div>
              <div className="tip-card">
                <h4>💰 Setting Competitive Budgets</h4>
                <p>Research local rates and consider building complexity when setting your budget.</p>
              </div>
              <div className="tip-card">
                <h4>✅ Vetting Pilots</h4>
                <p>Review pilot profiles, certifications, and past work before making your selection.</p>
              </div>
            </>
          ) : (
            <>
              <div className="tip-card">
                <h4>🎯 Winning More Bids</h4>
                <p>Submit detailed proposals with your approach, timeline, and competitive pricing.</p>
              </div>
              <div className="tip-card">
                <h4>📸 Building Your Portfolio</h4>
                <p>Upload high-quality before/after photos to showcase your work quality.</p>
              </div>
              <div className="tip-card">
                <h4>📱 Staying Active</h4>
                <p>Regularly check for new jobs and respond quickly to property manager inquiries.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 