import axios from 'axios';

// Set up Axios instance
const API = axios.create({
  baseURL: 'https://ktebbibackend.azurewebsites.net/api/users', // Base URL for your API (replace with your backend API URL)
  headers: {
    'Content-Type': 'application/json',
  },
});
const API2= axios.create({
  baseURL: 'https://ktebbibackend.azurewebsites.net/api/ratings', // Base URL for your API (replace with your backend API URL)
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
  const userService = {
    // Fetch all books
    getUsers: async () => {
      try {
        const response = await API.get('/getAll');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },
    deleteUser: async (userId) => {
      try {
        const response = await API.delete(`/profile/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Failed to delete user:', error);
        throw error;
      }
    } , 
    getHistory: async (userId) => {
      try {
        const response = await API2.get(`/users/${userId}/badwords-history`);
        return response.data;
      } catch (error) {
        console.error('Failed to block user:', error);
        throw error;
      }
    }, 
    blockUser : async(userId) =>{
      try {
        const response = await API.put(`/block/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Failed to block user:', error);
        throw error;
      }
    }, 
    

}
export default userService;