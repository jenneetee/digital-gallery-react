import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';  // Firestore method
import './Exhibition.css';
function Exhibition() {
    const { id } = useParams<{ id: string }>();
    const [exhibitionName, setExhibitionName] = useState('');
    const [exhibitionUser, setExhibitionUser] = useState('');
    const [exhibitionUID, setExhibitionUID] = useState('');
    const [exhibitionDescription, setExhibitionDescription] = useState('');
    const [exhibitionProfilePicture, setExhibitionProfilePicture] = useState('');
    const [artworkArray, setArtworkArray] = useState<any[]>([]);
    const [artwork, setArtwork] = useState<any>(null);
    const [error, setError] = useState('');
    const fetchArtwork = async (aid) => {
        const docRef = doc(db, 'artworks', aid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const artworkData = docSnap.data();
            let artistProfilePicture = '';
            let id = aid;
            setArtwork(artworkData);
            if (artworkData.uid) {
                const artistData = await fetchUser(artworkData.uid);
                if (artistData) {
                    artistProfilePicture = artistData.profilePicture;
                }
            }
            return { ...artworkData, artistProfilePicture, id };
        } else {
            console.log('No such document!');
            return null;
        }
    };

    const fetchUser = async (userId) => {
        try {
            const userDoc = query(collection(db, 'users'), where('uid', '==', userId));
            const querySnapshot = await getDocs(userDoc);
            if (querySnapshot.empty) {
                console.error('User document does not exist:', userId);
                return null;
            }
            const userDocRef = querySnapshot.docs[0].ref;
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data(); // Fetches the entire document data as an object
                console.log("User data:", userData);
                return userData;
            }
            else {
                console.log("User Null");
                return null;
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            return null;
        }
    }

    const getExhibition = async () => {
        try {
            if (id) {
                const exhibitionRef = doc(db, 'exhibitions', id);
                const exhibitionSnap = await getDoc(exhibitionRef);
                if (exhibitionSnap.exists()) {
                    const exhibitionData = exhibitionSnap.data();
                    const exhibitionAuthor = await fetchUser(exhibitionData.uid);
                    if (exhibitionAuthor) {
                        setExhibitionUser(exhibitionAuthor.displayName);
                        setExhibitionProfilePicture(exhibitionAuthor.profilePicture);
                    }
                    setExhibitionUID(exhibitionData.uid);
                    setExhibitionName(exhibitionData.exhibitionName);
                    setExhibitionDescription(exhibitionData.description);
                    const artworkPromises = exhibitionData.artworks.map((aid) => fetchArtwork(aid));
                    const artworks = await Promise.all(artworkPromises);
                    setArtworkArray(artworks.filter((artwork) => artwork !== null));
                    console.log("Artworks Array:", artworks.filter((artwork) => artwork !== null));
                }
                else {
                    console.error("Error fetching document:", error);
                }
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }    
    }

    useEffect(() => {
        getExhibition();
    }, [id]);

    return (
        <div>
            <h1>{exhibitionName}</h1>
            <h3>Description: <br /> </h3> <p>{exhibitionDescription}</p>
            <h3>Creator: <br /> </h3> <img src={exhibitionProfilePicture} className="profile-exhibition" />  
                <Link to={`/profile/${exhibitionUID}`}> 
                    {exhibitionUser} 
                </Link> <br />
            <div className="artwork-list">
                {artworkArray.map((artwork) => (
                    <div className="artwork-detail" key={artwork.id}>
                        <h1>{artwork.title}</h1>
                        <Link to={`/artwork/${artwork.id}`}><img src={artwork.imageUrl} alt={artwork.title} /></Link>
                        <p>{artwork.description}</p>
                        <div className="artist-detail">
                            <h4>Artist: <br /> <img src={artwork.artistProfilePicture} className="profile-artist" />  
                                <Link to={`/profile/${artwork.uid}`}> 
                                    {artwork.artist} 
                                </Link>
                            </h4>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Exhibition;