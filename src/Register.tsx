import React, { useState } from 'react';
import { db, auth } from './firebase.js';  // If it's directly in the src folder.
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';  // Import Firestore methods
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import './Register.css';  // Import the CSS file

function Register() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  // Function to handle user registration
  const handleRegister = async () => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setErrorMessage('Email already exists');
        return;
      }
      // Check if the username already exists
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If username already exists, set error message
        setErrorMessage('Username Already Exists');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await updateProfile(user, {
          displayName: displayName,
        });
      } catch (error) {
        console.error('Error setting display name:', error);
        setErrorMessage('Could not set display name. Please try again.');
        return; // Exit if update fails
      }

      // Save user data to Firestore (username and password)
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: email,
        displayName: displayName,
        username: username,
        password: password,  // Store password directly
        createdAt: new Date(),
      });

      setSuccessMessage('User account successfully created!'); // Set success message
      setErrorMessage(''); // Clear error message
      setEmail('');
      setDisplayName('');
      setUsername(''); // Clear input fields
      setPassword(''); // Clear input fields

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving user data:', error);
      if (error instanceof FirebaseError) {
        // Handle specific Firebase errors
        if (error.code === 'auth/weak-password') {
          setErrorMessage('Password should be at least 6 characters.');
        } else if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('Email already exists'); // Specific error for email
        } else {
          setErrorMessage('Error creating account. Please try again.');
        }
      } else {
        // Handle any other errors
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-background">
      <div className="register-container">
        <h1>Register</h1>
        <form>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> <br />
          <input
            type="text"
            placeholder="Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          /> <br />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /> <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> <br />
          <button type="button" className="button" onClick={handleRegister}>Register</button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>
    </div>
  );
}

export default Register;