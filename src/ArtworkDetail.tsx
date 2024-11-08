import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';  // Ensure this is correctly imported
import { collection, doc, getDoc, getDocs, addDoc } from 'firebase/firestore';
import './ArtworkDetail.css';

function ArtworkDetail() {
    const { id } = useParams<{ id: string }>();
    const [artwork, setArtwork] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchArtwork = async () => {
            const docRef = doc(db, 'artworks', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setArtwork(docSnap.data());
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

        fetchArtwork();
        fetchComments();
    }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Add a new comment
            const commentsCollection = collection(db, 'artworks', id, 'comments');
            await addDoc(commentsCollection, {
                username,
                text: commentText,
                createdAt: new Date() // Optional: Add a timestamp
            });

            // Reset form fields
            setCommentText('');
            setUsername('');

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
                    <h4>Artist: {artwork.artist}</h4>

                    <br></br>
                    <hr></hr>
                    <h2>Comments</h2>
                    <div className="comments-section">
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <strong>{comment.username}:</strong>
                                <p>{comment.text}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            placeholder="Your Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
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
