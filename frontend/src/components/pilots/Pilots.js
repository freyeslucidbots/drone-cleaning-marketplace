import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './pilots.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const mockPilots = [
  {
    id: 1,
    name: 'John "Sky" Doe',
    rating: 4.9,
    location: 'San Francisco, CA',
    coords: [37.7749, -122.4194],
    flightHours: 1200,
    insurance: 'Own',
    coverageArea: 'Bay Area',
    drones: ['DJI Mavic 3 Pro', 'DJI Inspire 2', 'Custom Cleaning Drone'],
    specialties: ['High-Rise', 'Commercial'],
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Jane "Ace" Smith',
    rating: 5,
    location: 'Austin, TX',
    coords: [30.2672, -97.7431],
    flightHours: 850,
    insurance: 'Marketplace Provided',
    coverageArea: 'Travis County',
    drones: ['DJI Air 2S', 'Autel EVO II', 'Specialized Solar Cleaning Bot'],
    specialties: ['Solar Panels', 'Residential'],
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    name: 'Mike "Rotor" Johnson',
    rating: 4.8,
    location: 'Miami, FL',
    coords: [25.7617, -80.1918],
    flightHours: 2500,
    insurance: 'Own',
    coverageArea: 'South Florida',
    drones: ['DJI Phantom 4 Pro', 'Custom Gutter Cleaning Robot', 'Facade Access Drone'],
    specialties: ['Gutters', 'Facades'],
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 4,
    name: 'Sarah "Glide" Williams',
    rating: 4.9,
    location: 'San Jose, CA',
    coords: [37.3382, -121.8863],
    flightHours: 3100,
    insurance: 'Own',
    coverageArea: 'Silicon Valley',
    drones: ['DJI Matrice 300 RTK', 'Industrial Cleaning Robot', 'Heavy Lift Drone'],
    specialties: ['Industrial', 'Construction Sites'],
    avatar: 'https://i.pravatar.cc/150?img=4'
  }
];

const Pilots = () => {
  return (
    <div className="pilots-page">
      <div className="map-section">
        <h3>Pilot Locations</h3>
        <MapContainer center={[39.8283, -98.5795]} zoom={4} scrollWheelZoom={false} className="pilot-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockPilots.map(pilot => (
            <Marker key={pilot.id} position={pilot.coords}>
              <Popup>{pilot.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="directory-section">
        <div className="filters">
          <h4>Filters</h4>
          {/* Filter controls will go here */}
        </div>
        <div className="pilot-grid">
          {mockPilots.map(pilot => (
            <div key={pilot.id} className="pilot-card">
              <div className="pilot-card-header">
                <img src={pilot.avatar} alt={pilot.name} className="pilot-avatar" />
                <div className="pilot-info">
                  <span className="pilot-name">{pilot.name}</span>
                  <span className="pilot-rating">{pilot.rating} ★</span>
                </div>
              </div>
              <div className="pilot-card-body">
                <p><strong>Location:</strong> {pilot.location}</p>
                <p><strong>Flight Hours:</strong> {pilot.flightHours}</p>
                <p><strong>Insurance:</strong> {pilot.insurance}</p>
                <p><strong>Coverage Area:</strong> {pilot.coverageArea}</p>
                <div className="tags-section">
                  <strong>Drones & Equipment:</strong>
                  <div className="tags">
                    {pilot.drones.map(drone => <span key={drone} className="tag">{drone}</span>)}
                  </div>
                </div>
                <div className="tags-section">
                  <strong>Specialties:</strong>
                  <div className="tags">
                    {pilot.specialties.map(spec => <span key={spec} className="tag specialty-tag">{spec}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pilots; 