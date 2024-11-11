import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, auth } from './firebase';  // Ensure this is correctly imported
import { collection, doc, getDoc, getDocs, addDoc, query, where, updateDoc } from 'firebase/firestore';
import { useCart } from './CartContent';
import './ArtworkDetail.css';

function ArtworkDetail() {
    const { id } = useParams<{ id: string }>();
    const [artwork, setArtwork] = useState<any>(null);
    const [profilePicture, setProfilePicture] = useState('');
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        if (!id) {
            console.log('No artwork ID provided.');
            return;
        }    

        const fetchArtwork = async () => {
            const docRef = doc(db, 'artworks', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const artworkData = docSnap.data();
                setArtwork(artworkData);
                if (artworkData.uid) {
                    fetchUser(artworkData.uid);
                }
            } else {
                console.log('No such document!');
            }
        };

        const fetchComments = async () => {
            const commentsCollection = collection(db, 'artworks', id, 'comments');
            const commentsSnapshot = await getDocs(commentsCollection);
            const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(commentsData);
        };

        const fetchUser = async (userId) => {
            try {
                const userDoc = query(collection(db, 'users'), where('uid', '==', userId));
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
                    setProfilePicture(userData.profilePicture);
                }
                else {
                    console.log("User Null");
                }
            } catch {
                console.error("Error fetching document:", error);
            }
        }
        fetchArtwork();
        fetchComments();
    }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) {
            console.log('No artwork ID provided.');
            return;
        }    

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
            const commentsCollection = collection(db, 'artworks', id, 'comments');

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data(); // Fetches the entire document data as an object
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

    return (
        <div className="artwork-detail">
            {artwork && (
                <>
                    <h1>{artwork.title}</h1>
                    <img src={artwork.imageUrl} alt={artwork.title} />
                    <p>{artwork.description}</p>
                    <div className="artist-detail">
                        <h4>Artist: <br /> <img src={profilePicture} className="profile-artist" />  
                            <Link to={`/profile/${artwork.uid}`}> 
                                {artwork.artist} 
                            </Link>
                        </h4>
                    </div>

                    <br></br>
                    <hr></hr>
                    <h3>${artwork.price.toFixed(2)}</h3>
                    {id ? (<button onClick={() => addToCart(id)}>Send to Cart</button>) : (<></>)}

                    <br></br>
                    <hr></hr>
                    <h2>Comments</h2>
                    <div className="comments-section">
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
                </>
            )}
        </div>
    );
}

export default ArtworkDetail;
