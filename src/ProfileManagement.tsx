import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase.js';
import axios from 'axios';
import { doc, collection, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';  // Firestore methods
import { EmailAuthProvider, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential } from 'firebase/auth';
import './ProfileManagement.css'; // Import the CSS file for styling

const ProfileManagement: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const clientId = import.meta.env.VITE_IMGUR_CLIENT_ID;
  const fetchUserData = async () => {
    try {
        const user = auth.currentUser;
        const userId = user.uid;

        const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(userDoc);
        if (querySnapshot.empty) {
            console.error('User document does not exist:', userId);
            return;
        }
        const userDocRef = querySnapshot.docs[0].ref;
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data(); // Fetches the entire document data as an object

            // To access specific fields, use userData.fieldName
            setName(userData.displayName); // Replace 'name' with the specific field name
            setUsername(userData.username);
            setEmail(userData.email); // Replace 'email' with the specific field name
            setPassword(userData.password);
            setProfilePicture(userData.profilePicture);

            return userData;
        } else {
            console.log("User Null");
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
}

  const reauthenticate = async (user, password) => {
    const credential = EmailAuthProvider.credential(user.email, password);

    try {
      await reauthenticateWithCredential(user, credential);
      console.log('User reauthenticated');
      return true;
    } catch (error) {
      console.error('Re-authentication failed:', error);
      return false;
    }
  }

  const checkAvailability = async () => {
    try {
      const user = auth.currentUser;
      console.log(user);
      // Check if the username is already taken by another user
      const usernameQuery = query(collection(db, 'users'), where('username', '==', username), where('uid', '!=', user.uid));
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty) {
        setError("Username is already taken.");
        return false;
      }

      // Check if the email is already taken by another user
      const emailQuery = query(collection(db, 'users'), where('email', '==', email), where('uid', '!=', user.uid));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        setError("Email is already in use.");
        return false;
      }

      setError(""); // Clear any previous error messages
      return true;
    } catch (error) {
      console.error("Error checking availability:", error);
      setError("An error occurred while checking availability.");
      return false;
    }
  };

  const updateUserData = async () => {
    if (file) {
      await handleProfilePictureUpload();
    }

    const isAvailable = await checkAvailability();
    if (!isAvailable) {
      return;
    }

    try {
      const user = auth.currentUser;
      const reauthenticated = await reauthenticate(user, password);
      if (!reauthenticated) {
        setError("Re-authentication required.");
        return;
      }  

      if (username) {
        await updateProfile(user, { displayName: name });
      }
    
      // Update email in Firebase Auth
      if (email) {
        await updateEmail(user, email);
      }
    
      // Update password in Firebase Auth
      if (password) {
        await updatePassword(user, password);
      }

      const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(userDoc);
      
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        
        await updateDoc(userDocRef, {
          displayName: name,
          username: username,
          email: email,
          password: password,
        });

        console.log("User data updated successfully");
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
      try {
        // Make API call to Imgur
        const response = await axios.post('https://api.imgur.com/3/upload', formData, {
            headers: {
                'Authorization': 'Client-ID ' + clientId,
                'Content-Type': 'multipart/form-data',
            },
        });

        const imageUrl = response.data.data.link; // Get the image URL from the response

        console.log('Uploaded Image URL:', imageUrl);

        // Update Firestore with the Imgur image URL
        const user = auth.currentUser;
        const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(userDoc);
        
        if (!querySnapshot.empty) {
          const userDocRef = querySnapshot.docs[0].ref;
          await updateDoc(userDocRef, {
            profilePicture: imageUrl, // Save the Imgur URL in Firestore
        });
        }

        setProfilePicture(imageUrl); // Update state with the new profile picture URL
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        setError("An unexpected error occurred.");
      }
};

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
      fetchUserData();
  }, []);


  return (
    <div className="profilemanagement-container">
      <h1>Profile Management</h1>
      {loading ? (
        <div className="loading">Loading...</div> // Show loading message
      ) : (
        <>
          <div>
            <label>Profile Picture:</label> <br />
            <img src={profilePicture} alt="Profile" className="profile-img" /> <br /> <br />
            <input type="file" onChange={handleFileChange} />
          </div> <br />
          <div>
            <label>Name: </label> <br />
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Username: </label> <br />
            @<input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Email: </label> <br />
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password: </label> <br />
            <input value={'•'.repeat(password.length)} onChange={(e) => setPassword(e.target.value)} />
          </div> <br />

          <button onClick={updateUserData}>Update Profile</button>
        </>
      )}
    </div>
  );
};

export default ProfileManagement;