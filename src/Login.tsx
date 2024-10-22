import React, { useState } from 'react';
import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';  // Import Firestore methods

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle user registration
  const handleRegister = async () => {
    try {
      // Create a unique user ID (for now, let's assume username is unique; you can use better methods)
      const userId = username;

      // Save user data to Firestore (create a document for this user)
      await setDoc(doc(db, 'users', userId), {
        username: username,
        password: password,  // Storing directly for now (not recommended for real apps)
      });

      setSuccessMessage('User successfully registered!');
      console.log('User data saved to Firestore');
    } catch (error) {
      console.error('Error saving user data:', error);
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

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Login;
