import axios from 'axios';

// Set up Axios instance
const API = axios.create({
  baseURL: 'https://ktebbibackend.azurewebsites.net/api/genres', // Base URL for your API (replace with your backend API URL)
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
  const genreServices = {
    // Fetch all books
    getGenres: async () => {
      try {
        const response = await API.get('/getAll');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch genres:', error);
        throw error;
      }
    },
     addGenre:async (genreData) =>  {
      try {
        const response = await API.post('/add', genreData);
        console.log(response);
        return response.data;
      } catch (error) {
        console.error('Failed to add genre:', error);
        throw error;
      }
    },
    deleteGenre:async (id) =>  {
      try {
        const response = await API.delete(`/delete/${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        console.error('Failed to delete genre:', error);
        throw error;
      }
    }

}
export default genreServices;