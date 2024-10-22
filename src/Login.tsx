import React, { useState } from 'react';
import { db } from './firebase.js';  // If it's directly in the src folder.
import { collection, addDoc } from 'firebase/firestore';  // Import Firestore methods

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  // Function to handle user registration
  const handleRegister = async () => {
    try {
      // Save user data to Firestore (username and password)
      await addDoc(collection(db, 'users'), {
        username: username,
        password: password,  // Store password directly
      });

      setSuccessMessage('User account successfully created!'); // Set success message
      setUsername(''); // Clear input fields
      setPassword(''); // Clear input fields
    } catch (error) {
      console.error('Error saving user data:', error);
      setSuccessMessage('Error creating account. Please try again.'); // Handle error message
    }
  };

  return (
    <div>
      <h1>Login Below</h1>
      <div>
        Username:
      </div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div>
        Password:
      </div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div>
        <button onClick={handleRegister}>Register</button>
      </div>

      {/* Display success message if it exists */}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Login;
