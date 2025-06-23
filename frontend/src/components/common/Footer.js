import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Lucid Bots. All rights reserved.</p>
    </footer>
  );
};

export default Footer; 