import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Exhibitions.css';
import { db } from './firebase.js';
import { collection, getDocs, getDoc, doc as firestoreDoc } from 'firebase/firestore';
import ArtworkSelection from './ArtworkSelection';

const Exhibitions: React.FC = () => {
    const [exhibitions, setExhibitions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    interface ExhibitionData {
        id: string;
        exhibitionName: string;
        creator: string;
        description?: string;
        artworks?: string[];
        firstArtwork?: {
            title: string;
            imageUrl: string;
        };
    }

    // Fetch exhibitions from Firestore
    const fetchExhibitions = async () => {
        try {
            const exhibitionCollectionRef = collection(db, 'exhibitions');
            const exhibitionSnapshot = await getDocs(exhibitionCollectionRef);
            const exhibitionList = await Promise.all(
                exhibitionSnapshot.docs.map(async (snapshot) => {
                    const exhibitionData = snapshot.data() as ExhibitionData;
                    exhibitionData.id = snapshot.id;
                    const firstArtworkId = exhibitionData.artworks?.[0];
                    
                    if (firstArtworkId) {
                        const artworkDoc = await getDoc(firestoreDoc(db, 'artworks', firstArtworkId));
                        if (artworkDoc.exists()) {
                            exhibitionData.firstArtwork = artworkDoc.data() as { title: string; imageUrl: string };
                        }
                    }
                    return exhibitionData;
                })
            );
            setExhibitions(exhibitionList);
        } catch (err) {
            setError('Error fetching exhibitions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExhibitions();
    }, []);

    if (loading) {
        return <div>Loading exhibitions...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='exhibitions-container'>
            <h1>Exhibitions</h1>
            <Link to="create" className="exhibition-link"><button type="button" className="button">Create Exhibition</button></Link> <br /> <br />
            <div className="exhibition-list">
                {exhibitions.map((exhibition) => (
                    <Link to={`/exhibitions/${exhibition.exhibitionId}`}>
                        <div className="exhibition-item" key={exhibition.id}>
                            <h4>{exhibition.exhibitionName}</h4>
                            <p>Creator: {exhibition.creator}</p>
                            <p>Description: {exhibition.description}</p>     
                                <img src={exhibition.firstArtwork.imageUrl} alt={exhibition.firstArtwork.title} className="first-artwork" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Exhibitions;



