import axios from 'axios';

// Create an axios instance with the base URL from an environment variable,
// falling back to your default if not set.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://delta-ai-backend.onrender.com',
});

// Request interceptor to modify the request config if needed
api.interceptors.request.use(
  config => {
    // You can modify the request config here if needed
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Log or handle errors globally here
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
