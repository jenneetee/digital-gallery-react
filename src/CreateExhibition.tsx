import React, { useState } from 'react';
import './Exhibitions.css';
import { db, auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { query, collection, addDoc, updateDoc, where, getDocs, getDoc } from 'firebase/firestore';
import ArtworkSelection from './ArtworkSelection';

function CreateExhibition () {
    const user = auth.currentUser;
    const [exhibitionName, setExhibitionName] = useState('');
    const [exhibitionDescription, setExhibitionDescription] = useState('');
    const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleArtworkSelectionChange = (selected: string[]) => {
        setSelectedArtworks(selected);
        console.log("Selected artworks for the exhibition:", selected);
    };

    const fetchUser = async () => {
        try {
            const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
            const querySnapshot = await getDocs(userDoc);
            if (querySnapshot.empty) {
                console.error('User document does not exist:', user.uid);
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

    const createExhibition = async () => {
        const userData = await fetchUser();
        if (userData) {
            const docRef = await addDoc(collection(db, 'exhibitions'), {
                uid: user.uid,
                exhibitionName: exhibitionName,
                artworks: selectedArtworks,
                creator: userData.displayName,
                description: exhibitionDescription,
                createdAt: new Date(),
            });
            await updateDoc(docRef, {
                exhibitionId: docRef.id,
            })
            navigate(`/exhibitions/${docRef.id}`)
        }
    };

    return (
        <div className='exhibitions-container'>
            <h1>Create Exhibition</h1>
            <h3>Exhibition Name:</h3>
            <input
                type="text"
                placeholder="Exhibition Name"
                value={exhibitionName}
                onChange={(e) => setExhibitionName(e.target.value)}
                required
            /> <br /> <br />
            <h3>Exhibition Description</h3>
            <textarea
                placeholder="Add a Description"
                value={exhibitionDescription}
                onChange={(e) => setExhibitionDescription(e.target.value)}
                required
            /> <br /> <br />
            <ArtworkSelection onSelectionChange={handleArtworkSelectionChange} />
            <p>Selected Artworks: {selectedArtworks.join(', ')}</p>
            <button type="button" className="button" onClick={createExhibition}>Create Exhibition</button>
        </div>
    )
}

export default CreateExhibition;

