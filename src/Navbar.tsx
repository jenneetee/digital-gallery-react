import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { auth } from './firebase';

const Navbar: React.FC = () => {
  const  { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        {user ? (
        <>
        <li style={liStyle}>
          <span style={linkStyle}>Currently LoggedIn as, {user.displayName}</span>
        </li>
        <li style={liStyle}>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        </li>
        <li style={liStyle}>
          <button onClick={handleLogout}>Logout</button>
        </li>
        </>
        ) : (
        <>
        <li style={liStyle}>
          <Link to="/login" style={linkStyle}>Login</Link>
        </li>
        <li style={liStyle}>
          <Link to="/register" style={linkStyle}>Register</Link>
        </li>
        </>)}
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