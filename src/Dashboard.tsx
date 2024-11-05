import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <Link to="buy-art" className="dashboard-tab">Buy Art</Link>
        <Link to="payments" className="dashboard-tab">Payment Details</Link>
        <Link to="sell-art" className="dashboard-tab">Sell Art</Link>
        <Link to="account-settings" className="dashboard-tab">Account Settings</Link>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;