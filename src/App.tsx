import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './Homepage';
import Login from './Login';      // Adjust the import based on your file structure
import Register from './Register'; // Adjust the import based on your file structure
import Payments from './Payments'; // Adjust the import based on your file structure
import Dashboard from './Dashboard'; // Adjust the import based on your file structure
import ProfileManagement from './ProfileManagement'; // Adjust the import based on your file structure
import Profile from './Profile';
import Gallery from './Gallery';
import Search from './Search';
import Navbar from './Navbar'; // Adjust the path based on your file structure
import { AuthProvider, useAuth } from './AuthContext';
import './App.css'; // Import the CSS file for styling

const App: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.25); // Set initial volume to 25%
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  //const { user } = useAuth();

  const playlist = [
    { src: 'background-music(overmydeadbody).mp3', title: 'Over My Dead Body' },
    { src: 'background-music(fashionkilla).mp3', title: 'Fashion Killa' },
    { src: 'background-music(ribs).mp3', title: 'Ribs' },
  ];

  // Function to shuffle the playlist
  const shufflePlaylist = (array: typeof playlist) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Shuffle the playlist and play the audio on component mount
  useEffect(() => {
    shufflePlaylist(playlist);
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set initial volume to 25%
      audioRef.current.play(); // Automatically play the music
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handlePrevSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="audio-controls">
          <button onClick={togglePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handlePrevSong}>Previous</button>
          <button onClick={handleNextSong}>Next</button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
          <div>Now Playing: {playlist[currentSongIndex].title}</div>
        </div>
        <audio ref={audioRef} autoPlay loop key={playlist[currentSongIndex].src}>
          <source src={playlist[currentSongIndex].src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <Routes>
          <Route path="/" element={<Navigate to="/homepage" />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedDashboard />}>
            <Route path="payments" element={<Payments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/profile-management" element={<ProfileManagement />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="search" element={<Search />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const ProtectedDashboard = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Navigate to="/login" />;
};


export default App;
