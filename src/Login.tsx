import React, { useState } from 'react';
import { db } from './firebase.js';  // If it's directly in the src folder.
import { collection, getDocs, query, where } from 'firebase/firestore';  // Import Firestore methods
import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate from react-router-dom
import './Login.css';  // Import the CSS file

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle user login
  const handleLogin = async () => {
    try {
      // Query Firestore for the user with the given username and password
      const q = query(collection(db, 'users'), where('username', '==', username), where('password', '==', password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If no matching user is found, set error message
        setErrorMessage('Incorrect Username and Password');
      } else {
        // If a matching user is found, clear error message and proceed with login
        setErrorMessage('');
        // Redirect to the dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking user data:', error);
      setErrorMessage('Error logging in. Please try again.');
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h1>Login</h1>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="login-button" onClick={handleLogin}>Login</button>
        </form>
        {errorMessage && (
          <div>
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <Link to="/register">
              <button type="button" className="register-button-small">Register</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;