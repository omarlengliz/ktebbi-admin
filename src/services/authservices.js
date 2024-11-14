import axios from 'axios';

// Set up Axios instance
const API = axios.create({
  baseURL: 'https://ktebbibackend.azurewebsites.net/api/users', // Base URL for your API (replace with your backend API URL)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an interceptor for adding authorization tokens if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Authentication services
const authService = {
  // Register a new user
  register: async (userData) => {
    try {
        console.log(userData);
      const response = await API.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Login user
  login: async (loginData) => {
    try {
      const response = await API.post('/login/author', loginData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  sendOtp: async (email) => {
    try {
      const response = await API.post('/send-verification-code', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  // Verify OTP
  verifyOTP: async (otpData) => {
    try {
      const response = await API.post('/verify-code', otpData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      const response = await API.post('/resend-otp', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

export default authService;
