import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // assuming firebase.js initializes Firestore
import { collection, getDocs } from 'firebase/firestore';
import './ArtworkSelection.css';

function ArtworkSelection({ onSelectionChange }) {
  const [artworks, setArtworks] = useState<{ id: string; title: string; imageUrl: string }[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch artworks on component load
  useEffect(() => {
    const fetchArtworks = async () => {
        const querySnapshot = await getDocs(collection(db, 'artworks'));
        const artworksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,   // Ensure these fields are correctly retrieved
          imageUrl: doc.data().imageUrl,  // Ensure these fields exist in the document
        })) as { id: string; title: string; imageUrl: string }[]; // Type assertion
  
        setArtworks(artworksData);
      };
    fetchArtworks();
  }, []);

  // Filter artworks based on search query
  const filteredArtworks = artworks.filter(artwork =>
    artwork.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selection changes
  const handleSelectionChange = (artworkId) => {
    setSelectedArtworks(prevSelected => {
      const isSelected = prevSelected.includes(artworkId);
      const newSelected = isSelected
        ? prevSelected.filter(id => id !== artworkId) // Deselect if already selected
        : [...prevSelected, artworkId]; // Select if not selected

      onSelectionChange(newSelected); // Pass selected artworks up to parent component
      return newSelected;
    });
  };

  return (
    <div>
      <h3>Select Artworks for Exhibition</h3>
      <input
        type="text"
        placeholder="Search artworks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      /> <br /> <br />
      <div className="artwork-list">
        {filteredArtworks.map(artwork => (
          <div key={artwork.id} className="artwork-item">
            <input
              type="checkbox"
              checked={selectedArtworks.includes(artwork.id)}
              onChange={() => handleSelectionChange(artwork.id)}
            />
            <img src={artwork.imageUrl} alt={artwork.title} className="thumbnail" />
            <p>{artwork.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtworkSelection;