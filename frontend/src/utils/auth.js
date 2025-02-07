// auth.js (Frontend Utility - authentication helper functions)

// Function to check if the user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user); // Returns true if both token and user are present
  };
  
  // Function to get the user data from local storage
  export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Returns parsed user object or null
  };
  
  // Function to get the JWT token from local storage
  export const getToken = () => {
    return localStorage.getItem('token') || null; // Returns token or null
  };
  
  // You might also add a function to check if the user is an admin
  export const isAdmin = () => {
    const user = getUser();
    return user ? user.isAdmin : false; // Returns true if user is admin, false otherwise
  };