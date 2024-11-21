import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase.js';  // If it's directly in the src folder.
import { collection, getDocs, query, where } from 'firebase/firestore';  // Import Firestore methods
import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate from react-router-dom
import Exhibitions from './Exhibitions'
import './Homepage.css';  // Import the CSS file

function Homepage() {
    const [scrollText, setScrollText] = useState("Welcome to the Digital Art Gallery");
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const user = auth.currentUser;
    const fetchUserData = async () => {
        if (user) {
            navigate('/dashboard');
        }    
        else {
            navigate('/login');
        }
    } 
    useEffect(() => {
        const handleScroll = () => {
            const vhThreshold = window.innerHeight * 0.33;
            // Check scroll position and update both scroll state and text
            setIsScrolled(window.scrollY > vhThreshold);
            if (window.scrollY > vhThreshold) {
                setScrollText("");
            } else {
                setScrollText("Welcome to the Digital Art Gallery");
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Call handleScroll immediately to check initial position on load
        handleScroll();

    }, []);
    return (
        <div className="homepage">
            <div className={`homepage-background-default ${isScrolled ? 'homepage-background-scrolled' : ''}`}>
                <div className={`default-layout ${isScrolled ? 'scrolled-layout' : ''}`}>
                    <h1>{scrollText}</h1>
                    <br />
                    <button type="button" className="homepage-button" onClick={fetchUserData}>Get started</button>
                    <br /><br />
                    <p>Scroll Down to see Exhibitions</p>
                </div>
            </div>
            <div className="homepage-container">
                {user ? (<Exhibitions></Exhibitions>) : 
                (
                    <div>
                        <h1>Exhibitions</h1>
                        <p>Sorry, you have to be Logged in to View Exhibitions</p>
                        <button type="button" className="button" onClick={fetchUserData}>Log In</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Homepage;