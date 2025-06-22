import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../utils/leaflet-fix.js';
import './pilots.css';

const dummyPilots = [
  { 
    id: 1, 
    name: 'John "Sky" Doe', 
    location: 'San Francisco, CA', 
    coordinates: { lat: 37.7749, lng: -122.4194 },
    rating: 4.9, 
    specialties: ['High-Rise', 'Commercial'], 
    flightHours: 1200, 
    insurance: 'Own', 
    coverageArea: 'Bay Area',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    drones: ['DJI Mavic 3 Pro', 'DJI Inspire 2', 'Custom Cleaning Drone']
  },
  { 
    id: 2, 
    name: 'Jane "Ace" Smith', 
    location: 'Austin, TX', 
    coordinates: { lat: 30.2672, lng: -97.7431 },
    rating: 5.0, 
    specialties: ['Residential', 'Solar Panels'], 
    flightHours: 850, 
    insurance: 'Marketplace Provided', 
    coverageArea: 'Travis County',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    drones: ['DJI Air 2S', 'Autel EVO II', 'Specialized Solar Cleaning Bot']
  },
  { 
    id: 3, 
    name: 'Mike "Rotor" Johnson', 
    location: 'Miami, FL', 
    coordinates: { lat: 25.7617, lng: -80.1918 },
    rating: 4.8, 
    specialties: ['Facade', 'Gutter Cleaning'], 
    flightHours: 2500, 
    insurance: 'Own', 
    coverageArea: 'South Florida',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    drones: ['DJI Phantom 4 Pro', 'Custom Gutter Cleaning Robot', 'Facade Access Drone']
  },
  { 
    id: 4, 
    name: 'Sarah "Glide" Williams', 
    location: 'San Jose, CA', 
    coordinates: { lat: 37.3382, lng: -121.8863 },
    rating: 4.9, 
    specialties: ['Industrial', 'Large-Scale Projects'], 
    flightHours: 3100, 
    insurance: 'Own', 
    coverageArea: 'Silicon Valley',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    drones: ['DJI Matrice 300 RTK', 'Industrial Cleaning Robot', 'Heavy Lift Drone']
  },
];

const Pilots = () => {
  const [pilots] = useState(dummyPilots);
  const [filteredPilots, setFilteredPilots] = useState(dummyPilots);
  const [filters, setFilters] = useState({
    searchTerm: '',
    minRating: 0,
    specialty: 'All',
    insurance: 'All',
  });

  const uniqueSpecialties = ['All', ...new Set(dummyPilots.flatMap(p => p.specialties))];

  useEffect(() => {
    let result = pilots
      .filter(pilot => 
        pilot.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pilot.location.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
      .filter(pilot => pilot.rating >= filters.minRating)
      .filter(pilot => filters.specialty === 'All' || pilot.specialties.includes(filters.specialty))
      .filter(pilot => filters.insurance === 'All' || pilot.insurance === filters.insurance);
    
    setFilteredPilots(result);
  }, [filters, pilots]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: name === 'minRating' ? parseFloat(value) : value,
    }));
  };
  
  const mapCenter = [39.8283, -98.5795]; // Centered on the US

  return (
    <div className="pilots-container">
      <div className="pilots-header">
        <h1>Pilot Directory</h1>
        <p>Find certified and insured drone operators for your project</p>
      </div>
      
      {/* Map Section */}
      <div className="pilots-map-section">
        <h2>Pilot Locations</h2>
        <div className="pilots-map">
          <MapContainer center={mapCenter} zoom={4} scrollWheelZoom={false} className="map-container">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPilots.map(pilot => (
              <Marker key={pilot.id} position={[pilot.coordinates.lat, pilot.coordinates.lng]}>
                <Popup>{pilot.name}<br />{pilot.location}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="pilots-content">
        <div className="filter-sidebar">
          <h2>Filters</h2>
          <div className="filter-group">
            <label htmlFor="searchTerm">Search by Name or Location</label>
            <input 
              type="text" 
              id="searchTerm" 
              name="searchTerm"
              placeholder="e.g., 'John Doe' or 'Miami, FL'"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="minRating">Minimum Rating: {filters.minRating.toFixed(1)} ★</label>
            <input 
              type="range" 
              id="minRating" 
              name="minRating"
              min="0"
              max="5"
              step="0.1"
              value={filters.minRating}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="specialty">Specialty</label>
            <select id="specialty" name="specialty" value={filters.specialty} onChange={handleFilterChange}>
              {uniqueSpecialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="insurance">Insurance</label>
            <select id="insurance" name="insurance" value={filters.insurance} onChange={handleFilterChange}>
              <option value="All">All</option>
              <option value="Own">Own</option>
              <option value="Marketplace Provided">Marketplace Provided</option>
            </select>
          </div>
        </div>
        <div className="pilot-list">
          {filteredPilots.length > 0 ? (
            filteredPilots.map(pilot => (
              <div key={pilot.id} className="pilot-card">
                <div className="pilot-card-header">
                  <div className="pilot-profile">
                    <img src={pilot.profilePhoto} alt={pilot.name} className="pilot-photo" />
                    <div className="pilot-info">
                      <h3>{pilot.name}</h3>
                      <span className="pilot-rating">{pilot.rating} ★</span>
                    </div>
                  </div>
                </div>
                <div className="pilot-card-body">
                  <div className="pilot-details">
                    <p><strong>Location:</strong> {pilot.location}</p>
                    <p><strong>Flight Hours:</strong> {pilot.flightHours.toLocaleString()}</p>
                    <p><strong>Insurance:</strong> {pilot.insurance}</p>
                    <p><strong>Coverage Area:</strong> {pilot.coverageArea}</p>
                    
                    <div className="pilot-drones">
                      <strong>Drones & Equipment:</strong>
                      <div className="drone-list">
                        {pilot.drones.map(drone => (
                          <span key={drone} className="drone-tag">{drone}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pilot-specialties">
                      <strong>Specialties:</strong>
                      <div className="specialty-list">
                        {pilot.specialties.map(spec => (
                          <span key={spec} className="specialty-tag">{spec}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <Link to={`/pilots/${pilot.id}`} className="pilot-cta">View Full Profile</Link>
              </div>
            ))
          ) : (
            <p className="no-results-message">No pilots match the current filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pilots; 