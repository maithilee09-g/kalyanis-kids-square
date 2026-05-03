// Centralized API configuration
// During development, it uses localhost. 
// In production, you can set the REACT_APP_API_URL environment variable.

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export default API_URL;
