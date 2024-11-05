import React, { useState } from 'react';
import { db, auth } from './firebase.js';  // If it's directly in the src folder.
import { collection, getDocs, query, where } from 'firebase/firestore';  // Import Firestore methods
import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate from react-router-dom
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';  // Import the CSS file

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle user login
  const handleLogin = async () => {
    try {
      let email;

      // Check if the identifier looks like an email
      if (identifier.includes('@')) {
        email = identifier; // Treat as email
      } else {
        // If it's not an email, query Firestore for the username
        const q = query(collection(db, 'users'), where('username', '==', identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setErrorMessage('Username not found.'); // Handle case where username does not exist
          return;
        }

        // Assuming the first document is the user we want
        const userDoc = querySnapshot.docs[0].data();
        email = userDoc.email; // Get the email from the user document
      }

      // Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      
      // Redirect to the dashboard after successful login
      navigate('/dashboard');
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
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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