import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from './firebase.js';
import { doc, collection, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';  // Firestore methods
import './Profile.css';

const Profile: React.FC = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

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
                console.log("User data:", userData);

                // To access specific fields, use userData.fieldName
                setName(userData.displayName); // Replace 'name' with the specific field name
                setUsername(userData.username);
                if (userData.profilePicture) {
                    setProfilePicture(userData.profilePicture); // Set profile picture URL
                } else {
                    try {
                        await updateDoc(userDocRef, {
                            profilePicture: "https://i.imgur.com/Cx5PiKp.png", // Save the Imgur URL in Firestore
                        });
                        setProfilePicture("https://i.imgur.com/Cx5PiKp.png"); // Update the local state
                    } catch (error) {
                        console.error("Error updating profile picture:", error);
                    }
                }
                return userData;
            } else {
                console.log("User Null");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    }
    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="profile-container">
        <h1>Profile</h1>
        <img src={profilePicture} alt="Profile" className="profile-img" />
        <h3>{name}</h3>
        <p>@{username}</p>
        <Link to="./profile-management" >Edit Profile</Link>
        <br /><br />
        <h2>Artwork</h2>
        <br />
        <h3>Comments</h3>
        <div>
        </div>
        </div>
    );
};

export default Profile;
