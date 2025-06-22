import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './jobs.css';

const dummyJobs = [
  { id: 1, title: 'Window Cleaning for Downtown High-Rise', location: 'San Francisco, CA', budget: 5000, propertyType: 'Commercial' },
  { id: 2, title: 'Facade and Gutter Cleaning for Office Park', location: 'Austin, TX', budget: 7500, propertyType: 'Commercial' },
  { id: 3, title: 'Solar Panel Cleaning for Tech Campus', location: 'San Jose, CA', budget: 12000, propertyType: 'Industrial' },
  { id: 4, title: 'Full Exterior Wash for Luxury Apartments', location: 'Miami, FL', budget: 9000, propertyType: 'Residential' },
];

const Jobs = () => {
  const [jobs] = useState(dummyJobs);
  const [filteredJobs, setFilteredJobs] = useState(dummyJobs);
  const [filters, setFilters] = useState({
    searchTerm: '',
    maxBudget: 20000,
    propertyType: 'All',
  });

  const uniquePropertyTypes = ['All', ...new Set(dummyJobs.map(j => j.propertyType))];

  useEffect(() => {
    let result = jobs
      .filter(job => 
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
      .filter(job => job.budget <= filters.maxBudget)
      .filter(job => filters.propertyType === 'All' || job.propertyType === filters.propertyType);
    
    setFilteredJobs(result);
  }, [filters, jobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: name === 'maxBudget' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Job Listings</h1>
        <p>Browse and bid on available drone cleaning projects</p>
      </div>
      <div className="jobs-content">
        <div className="filter-sidebar">
          <h2>Filters</h2>
          <div className="filter-group">
            <label htmlFor="searchTerm">Search by Title or Location</label>
            <input 
              type="text" 
              id="searchTerm" 
              name="searchTerm"
              placeholder="e.g., 'High-Rise' or 'Austin, TX'"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="maxBudget">Max Budget: ${filters.maxBudget.toLocaleString()}</label>
            <input 
              type="range" 
              id="maxBudget" 
              name="maxBudget"
              min="1000"
              max="20000"
              step="500"
              value={filters.maxBudget}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="propertyType">Property Type</label>
            <select id="propertyType" name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
              {uniquePropertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>
        <div className="job-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Budget:</strong> ${job.budget.toLocaleString()}</p>
                <p><strong>Property Type:</strong> {job.propertyType}</p>
                <Link to={`/jobs/${job.id}`} className="job-cta">View Details & Bid</Link>
              </div>
            ))
          ) : (
            <p className="no-results-message">No jobs match the current filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs; 