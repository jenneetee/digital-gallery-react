import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './Search.css'; // Import the CSS file for styling

const Search: React.FC = () => {
  const [searchTermArtwork, setSearchTermArtwork] = useState('');
  const [searchTermUser, setSearchTermUser] = useState('');
  const [resultArtwork, setResultArtwork] = useState<any[]>([]);
  const [resultUser, setResultUser] = useState<any[]>([]);

  const handleSearchChangeArtwork = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTermArtwork(event.target.value);
  };

  const handleSearchChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermUser(event.target.value);
  };

  const searchArtwork = async () => {
      if (!searchTermArtwork.trim()) {
        setResultArtwork([]); // Ensure results clear if input is empty
        return;
      }
      const lowerCaseSearch = searchTermArtwork.toLowerCase();
      try {
          const q = collection(db, 'artworks');
          const querySnapshot = await getDocs(q);
          const searchResults = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as { id: string; title: string; imageUrl: string }))
            .filter(doc => doc.title.toLowerCase().includes(lowerCaseSearch));
          setResultArtwork(searchResults);
      } catch (error) {
          console.error('Error fetching search results:', error);
      }
  };

  const searchUser = async () => {
    if (!searchTermUser.trim()) {
      setResultUser([]); // Ensure results clear if input is empty
      return;
    }
    const lowerCaseSearch = searchTermUser.toLowerCase();
    try {
        const q = collection(db, 'users');
        const querySnapshot = await getDocs(q);
        const searchResults = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as { id: string; displayName: string; username: string }))
          .filter(doc => 
            (doc.displayName?.toLowerCase().includes(lowerCaseSearch)) ||
            (doc.username?.toLowerCase().includes(lowerCaseSearch)));
        setResultUser(searchResults);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
      setResultArtwork([]);
      if (searchTermArtwork) {
          searchArtwork();
      } else {
          setResultArtwork([]); // Clear results if searchTerm is empty
      }
      setResultUser([]);
      if (searchTermUser) {
        searchUser();
      } else {
          setResultUser([]); // Clear results if searchTerm is empty
      }
  }, [searchTermArtwork, searchTermUser]);

  return (
      <div className='search-container'>
          <h1>Search</h1>
          <h3>Artworks</h3>
          <input
              type="text"
              placeholder="Search artworks"
              value={searchTermArtwork}
              onChange={handleSearchChangeArtwork}
          />
          <div>
              {resultArtwork.map(result => (
                  <div key={result.id}>
                      <strong>{result.title}</strong> <br />
                      <Link to={`/artwork/${result.id}`}> 
                        <>
                          <img src={result.imageUrl} alt={result.title} width="100" />
                        </>
                      </Link>
                  </div>
              ))}
          </div> <hr />
          <h3>Users</h3>
          <input
              type="text"
              placeholder="Search users"
              value={searchTermUser}
              onChange={handleSearchChangeUser}
          />
          {resultUser.map(result => (
              <div key={result.id}>
                  <Link to={`/profile/${result.uid}`}> 
                    <>
                      <strong>{result.displayName}@{result.username}</strong>
                    </>
                  </Link>
              </div>
          ))}
      </div>
  );
};

export default Search;