import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase.js';  // If it's directly in the src folder.
import { collection, getDocs, query, where } from 'firebase/firestore';  // Import Firestore methods
import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate from react-router-dom
import './Homepage.css';  // Import the CSS file

function Homepage() {
    const [scrollText, setScrollText] = useState("Welcome to the Digital Art Gallery");
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
            navigate('/dashboard');
        }    
        else {
            navigate('/login');
        }
    } 
    useEffect(() => {
        const handleScroll = () => {
            const vhThreshold = window.innerHeight * 0.5;
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
                <h1>Exhibitions</h1>

            </div>
        </div>
    );
};

export default Homepage;