import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link to="/" style={linkStyle}>Login</Link>
        </li>
        <li style={liStyle}>
          <Link to="/payments" style={linkStyle}>Payments</Link>
        </li>
        <li style={liStyle}>
          <Link to="/register" style={linkStyle}>Register</Link>
        </li>
      </ul>
    </nav>
  );
};

// Optional: You can add styles using CSS or inline styles
const navStyle: React.CSSProperties = {
  backgroundColor: '#333',
  padding: '10px',
};

const ulStyle: React.CSSProperties = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
};

const liStyle: React.CSSProperties = {
  marginRight: '20px',
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
};

export default Navbar;