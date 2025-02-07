import { useState, useEffect } from 'react';
import { isAuthenticated, getUser, getToken } from '../utils/auth';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    // Update state when local storage changes (e.g., user logs in/out)
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
      setUser(getUser());
      setToken(getToken());
    };

    // Listen for storage events (triggered by other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Initial state
    handleStorageChange();

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    isLoggedIn,
    user,
    token,
  };
};

export default useAuth;