import React, { useState } from 'react';
import { db } from './firebase.js';  // If it's directly in the src folder.
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';  // Import Firestore methods
import './Register.css';  // Import the CSS file

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  // Function to handle user registration
  const handleRegister = async () => {
    try {
      // Check if the username already exists
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If username already exists, set error message
        setErrorMessage('Account Already Exists');
        return;
      }

      // Save user data to Firestore (username and password)
      await addDoc(collection(db, 'users'), {
        username: username,
        password: password,  // Store password directly
      });

      setSuccessMessage('User account successfully created!'); // Set success message
      setErrorMessage(''); // Clear error message
      setUsername(''); // Clear input fields
      setPassword(''); // Clear input fields
    } catch (error) {
      console.error('Error saving user data:', error);
      setErrorMessage('Error creating account. Please try again.'); // Handle error message
    }
  };

  return (
    <div className="register-background">
      <div className="register-container">
        <h1>Register</h1>
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
          <button type="button" className="button" onClick={handleRegister}>Register</button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>
    </div>
  );
}

export default Register;