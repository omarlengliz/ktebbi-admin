import axios from 'axios';

// Set up Axios instance
const API = axios.create({
  baseURL: 'https://ktebbibackend.azurewebsites.net/api/stats', // Base URL for your API (replace with your backend API URL)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an interceptor for adding authorization tokens if needed

// Optional: Add a request interceptor for adding authorization tokens if you have authentication
API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Services for Book-related API calls
  const statsService = {
    // Fetch all books
    getStats: async () => {
      try {
        const response = await API.get('/getStats');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        throw error;
      }
    },
  
}
export default statsService;