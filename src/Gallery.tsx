import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Gallery.css';

function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [artist, setArtist] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'artworks'));
        const artworksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtworks(artworksData);
      } catch (error) {
        console.error('Error fetching artwork data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newArtwork = { title, description, imageUrl, artist };
      const docRef = await addDoc(collection(db, 'artworks'), newArtwork);

      setTitle('');
      setDescription('');
      setImageUrl('');
      setArtist('');
      setArtworks((prevArtworks) => [
        ...prevArtworks,
        { id: docRef.id, ...newArtwork },
      ]);
    } catch (error) {
      console.error('Error uploading artwork:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="gallery">
      <h1>Artwork Gallery</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="gallery-grid">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="gallery-item-wrapper">
              <Link to={`/artwork/${artwork.id}`}>
                <div className="gallery-item">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="artwork-image"
                  />
                </div>
                <h2 className="artwork-title">{artwork.title}</h2>
                <p className="artwork-artist">By: {artwork.artist}</p>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Sidebar for the upload form */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Upload New Artwork</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="text"
            placeholder="Artist's Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Artwork Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Artwork Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          <button type="submit">Upload Artwork</button>
        </form>
      </div>

      {/* Button to toggle the sidebar */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Upload'}
      </button>
    </div>
  );
}

export default Gallery;
