import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-container">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 