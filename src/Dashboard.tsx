import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <Link to="profile" className="dashboard-tab">Profile</Link>
        <Link to="payments" className="dashboard-tab">Payment Details</Link>
        <Link to="gallery" className="dashboard-tab">Gallery</Link>
        <Link to="search" className="dashboard-tab">Search</Link>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;