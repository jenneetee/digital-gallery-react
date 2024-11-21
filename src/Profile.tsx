import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth, db } from './firebase.js';
import { collection, addDoc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';  // Firestore methods
import './Profile.css';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [artwork, setArtwork] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [notNull, setNotNull] = useState(true);
    const user = auth.currentUser;

    const fetchUserData = async () => {
        try {
            const userId = id;
            const userDoc = query(collection(db, 'users'), where('uid', '==', userId));
            const querySnapshot = await getDocs(userDoc);
            if (querySnapshot.empty) {
                console.error('User document does not exist:', userId);
                setNotNull(false);
                return;
            }
            const userDocRef = querySnapshot.docs[0].ref;
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data(); // Fetches the entire document data as an object

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
                fetchArtwork();
                fetchComments(userDocRef);
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
    const fetchArtwork = async () => {
        const userId = id;
        if (!userId) { // Check for undefined userId before fetching artwork
            console.error('No user ID provided for artwork');
            return;
        }
        const artworkCollection = query(collection(db, 'artworks'), where('uid', '==', userId)) ;
        const artworkSnapshot = await getDocs(artworkCollection);
        const artworkData = artworkSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtwork(artworkData);
    };

    const fetchComments = async (userDocRef) => {
        const userId = id;
        if (!userId) { // Check for undefined userId before fetching artwork
            console.error('No user ID provided for artwork');
            return;
        }
        const commentsCollection = collection(db, 'users', userDocRef.id, 'comments');
        const commentsSnapshot = await getDocs(commentsCollection);
        const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) {
            console.log('No user ID provided.');
            return;
        }    

        try {
            const userDoc1 = query(collection(db, 'users'), where('uid', '==', id));
            const userDoc2 = query(collection(db, 'users'), where('uid', '==', user.uid));
            const querySnapshot1 = await getDocs(userDoc1);
            if (querySnapshot1.empty) {
                console.error('User document does not exist:', id);
                return;
            }
            const querySnapshot2 = await getDocs(userDoc2);
            if (querySnapshot2.empty) {
                console.error('User document does not exist:', id);
                return;
            }
            const userDocRef1 = querySnapshot1.docs[0].ref;
            const commentsCollection = collection(db, 'users', userDocRef1.id, 'comments');
            const userDocRef2 = querySnapshot2.docs[0].ref;
            const userDocSnap2 = await getDoc(userDocRef2);

            if (userDocSnap2.exists()) {
                const userData = userDocSnap2.data(); // Fetches the entire document data as an object
                console.log("User data:", userData);
                await addDoc(commentsCollection, {
                    uid: user.uid,
                    name: user.displayName,
                    username: userData.username,
                    text: commentText,
                    createdAt: new Date() // Optional: Add a timestamp
                });
            }
            // Reset form fields
            setCommentText('');

            // Refresh comments
            const commentsSnapshot = await getDocs(commentsCollection);
            const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(commentsData);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    return (
        <div className="profile-container">
        <h1>Profile</h1>
        {loading ? (
        <div className="loading">Loading...</div> // Show loading message
        ) : (
            <>
                {notNull ? (
                <>
                <img src={profilePicture} alt="Profile" className="profile-img" />
                <h3>{name}</h3>
                <p>@{username}</p>
                {user.uid == id ? (
                    <>
                        <Link to="./profile-management" ><button type="button" className="button">Edit Profile</button></Link> <br /><br />
                    </>) : 
                    (<></>)}
                <h2>Artwork</h2>
                <hr />
                <div className="profile-artwork-list">
                    {artwork.map((artworkItem) => (
                        <div key={artworkItem.id} className="profile-artwork">
                            <Link to={`/artwork/${artworkItem.id}`}>
                                <img
                                    src={artworkItem.imageUrl}
                                    alt={artworkItem.title}
                                    className="profile-artwork-image"
                                />
                            </Link>
                        </div>
                    ))}
                </div> <br />
                <h2>Comments</h2>
                <hr />
                <div className="comments">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <Link to={`/profile/${comment.uid}`}> 
                                <span>
                                    <strong>{comment.name}@{comment.username}:</strong> 
                                </span>
                            </Link>
                            <p>{comment.text}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleCommentSubmit}>
                        <textarea
                            placeholder="Add a comment"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            required
                        />
                        <button type="submit">Submit Comment</button>
                    </form>
                </>) :
                (<><p>Sorry, the user you're searching for cannot be found.</p></>)}
            </>
        )}
        </div>
    );
};

export default Profile;
