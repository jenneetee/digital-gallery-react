import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { auth } from './firebase';

const Navbar: React.FC = () => {
  const { user } = useAuth();
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
      <div style={leftContainerStyle}>
        {user ? (
          <>
            <strong style={{ color: 'grey', fontSize: '1.1rem' }}>{user.displayName}</strong>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
      <div style={centerContainerStyle}>
        <Link to="/homepage" style={linkStyle}>Homepage</Link>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/cart" style={linkStyle}>Cart</Link>
      </div>
    </nav>
  );
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#333',
  padding: '10px',
};

const leftContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
};

const centerContainerStyle = {
  position: 'absolute' as const,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '20px',
};

const linkStyle = {
  color: 'black',
  textDecoration: 'none',
  backgroundColor: 'white', // Set background color to white
  padding: '10px 20px',
  borderRadius: '5px',
  display: 'inline-block',
};

const buttonStyle = {
  backgroundColor: 'transparent', // Set background color to transparent
  color: 'white', // Set text color to white
  border: '1px solid white', // Optional: Add a border to make it more visible
  padding: '5px 10px', // Make the button smaller
  cursor: 'pointer',
  textDecoration: 'none',
  borderRadius: '5px',
};

export default Navbar;