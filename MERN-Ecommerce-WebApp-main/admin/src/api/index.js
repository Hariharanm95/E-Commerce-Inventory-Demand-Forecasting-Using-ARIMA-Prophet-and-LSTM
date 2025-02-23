import axios from "axios";

// Get token safely
const getToken = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("persist:rootAdmin"));
    const currentUser = userData ? JSON.parse(userData.user).currentUser : null;
    return currentUser?.token || null;
  } catch (error) {
    console.error("Error reading token from localStorage:", error);
    return null;
  }
};

// Create API instance without token initially
const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// Function to update token dynamically
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// Set the token initially (if available)
const token = getToken();
if (token) {
  setAuthToken(token);
}

export default API;
