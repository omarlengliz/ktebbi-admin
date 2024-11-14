import axios from 'axios';

// Set up Axios instance with a base URL (replace with your actual API base URL)
const API = axios.create({
  baseURL: 'https://ktebbibackend.azurewebsites.net/api/books', // Example: replace with 'https://ktebbibackend.azurewebsites.net/api' if your backend runs locally
  headers: {
    'Content-Type': 'application/json',
  },
});

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
const bookService = {
  // Fetch all books
  getBooks: async () => {
    try {
    const response = await API.get('/getAllA');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch books:', error);
      throw error;
    }
  },

  // Fetch a single book by ID
  getBookById: async (id) => {
    try {
      const response = await API.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch book:', error);
      throw error;
    }
  },

  // Add a new book
  addBook: async (bookData) => {
    try {
      console.log(bookData);
  
      const formData = new FormData();
      formData.append('name', bookData.title);
      formData.append('genre', bookData.genre);
      formData.append('pages', bookData.chapters.length || 1); // Handle number of pages
      formData.append('pageContent', JSON.stringify(bookData.chapters));
      formData.append('language', bookData.language);
      
      // Append Blob or File for the image
      if (bookData.imageUrl instanceof Blob || bookData.imageUrl instanceof File) {
        formData.append('imageUrl', bookData.imageUrl); // File or Blob handling
      }
  
      console.log('FormData:', [...formData.entries()]); // Logging the FormData entries for debugging
  
      const response = await API.post('/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add book:', error);
      throw error;
    }
  },
  

  // Update an existing book
  updateBook: async (id, bookData) => {
    try {
      const response = await API.put(`/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error('Failed to update book:', error);
      throw error;
    }
  },

  // Delete a book by ID
  deleteBook: async (id) => {
    try {
      const response = await API.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete book:', error);
      throw error;
    }
  },
};

export default bookService;
