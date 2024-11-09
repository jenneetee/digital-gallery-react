// Gallery.tsx
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, where, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Gallery.css';

interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  artist: string;
  uid: string;
  createdAt: Date;
}

const Gallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const clientId = import.meta.env.VITE_IMGUR_CLIENT_ID;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'artworks'));
        const artworksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Artwork
      ));
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
      const imageFileUrl = await handleArtworkUpload(); // Awaiting the returned image URL
      if (!imageFileUrl) {
        console.error('Failed to upload image.');
        return;
      }
      const user = auth.currentUser;
      const userId = user.uid;
      const newArtwork = { title, description, imageUrl: imageFileUrl, artist: user.displayName, uid: userId, createdAt: new Date() };
      const docRef = await addDoc(collection(db, 'artworks'), newArtwork);
      const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(userDoc);
      if (querySnapshot.empty) {
        console.error('User document does not exist:', userId);
        setError('User document does not exist.');
        return;
      }

      const userDocRef = querySnapshot.docs[0].ref;

      setTitle('');
      setDescription('');
      const userArtworkRef = await addDoc(collection(userDocRef, 'artwork'), newArtwork);
      console.log('Added artwork to user-specific artwork subcollection:', userArtworkRef.id);
      setArtworks((prevArtworks) => [
        ...prevArtworks,
        { id: docRef.id, ...newArtwork },
      ]);

      console.log("Sent");
    } catch (error) {
      console.error('Error uploading artwork:', error);
    }
  };
  
  const handleArtworkUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
      try {
        // Make API call to Imgur
        const response = await axios.post('https://api.imgur.com/3/upload', formData, {
            headers: {
                'Authorization': 'Client-ID ' + clientId,
                'Content-Type': 'multipart/form-data',
            },
        });

        const fileUrl = response.data.data.link; // Get the image URL from the response

        return fileUrl;

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        setError("An unexpected error occurred.");
      }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
          <input type="file" onChange={handleFileChange} required/>
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
