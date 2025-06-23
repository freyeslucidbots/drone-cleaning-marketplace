import React from 'react';
import './jobs.css';

const mockJobs = [
  {
    id: 1,
    title: 'High-Rise Window Cleaning',
    location: 'Downtown, San Francisco',
    budget: 2500,
    posted: '2 days ago',
    description: 'Seeking a certified pilot for a 30-story commercial building. Must have experience with high-rise operations and facade cleaning drones.',
    tags: ['Commercial', 'High-Rise', 'Urgent']
  },
  {
    id: 2,
    title: 'Solar Panel Cleaning for Tech Campus',
    location: 'Silicon Valley, CA',
    budget: 4000,
    posted: '5 days ago',
    description: 'Large-scale solar panel cleaning project across a multi-building tech campus. Requires specialized solar panel cleaning bots.',
    tags: ['Solar Panels', 'Large-Scale', 'Tech Campus']
  },
  {
    id: 3,
    title: 'Residential Roof & Gutter Wash',
    location: 'Austin, TX',
    budget: 500,
    posted: '1 week ago',
    description: 'Standard roof and gutter cleaning for a 2-story residential home. Soft wash system preferred.',
    tags: ['Residential', 'Roof Cleaning', 'Gutters']
  },
  {
    id: 4,
    title: 'Stadium Exterior Cleaning',
    location: 'Miami, FL',
    budget: 15000,
    posted: '1 week ago',
    description: 'Full exterior wash of a major sports stadium. Requires a team of pilots and heavy-duty cleaning drones.',
    tags: ['Commercial', 'Stadium', 'Large-Scale']
  }
];

const Jobs = () => {
  return (
    <div className="jobs-page">
      <div className="filters">
        <h4>Filters</h4>
        {/* Filter controls will go here */}
      </div>
      <div className="job-listings">
        {mockJobs.map(job => (
          <div key={job.id} className="job-card">
            <div className="job-card-header">
              <h3 className="job-title">{job.title}</h3>
              <span className="job-budget">${job.budget}</span>
            </div>
            <p className="job-location">{job.location}</p>
            <p className="job-description">{job.description}</p>
            <div className="job-card-footer">
              <div className="job-tags">
                {job.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
              <span className="job-posted">{job.posted}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs; 