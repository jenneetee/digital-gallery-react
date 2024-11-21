import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, browserLocalPersistence } from './firebase'; // Import your Firebase auth instance
import { onAuthStateChanged, User } from 'firebase/auth';
// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  //name: string | null;
  loading: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set local persistence for Firebase authentication
    auth.setPersistence(browserLocalPersistence)
      .then(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user); // Update user state based on auth changes
          setLoading(false);
        });
        return () => unsubscribe(); // Clean up subscription on unmount
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};