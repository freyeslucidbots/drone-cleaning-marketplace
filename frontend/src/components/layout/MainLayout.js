import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 