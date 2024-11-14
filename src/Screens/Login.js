import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';  // Assuming you're using React Router for navigation
import authService from '../services/authservices';

const Login = () => {
  const navigate = useNavigate();  // React Router hook for navigation
  if(localStorage.getItem("user" ) && localStorage.getItem("token")){
    navigate('/admin/dashboard');
  }

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);  // Loading state for form submission

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error('Email is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Invalid email address');
      return;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return;
    }

    setLoading(true);  // Set loading state to true when form is submitted

    try {
      // Call authService.login to authenticate the user
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Store the JWT token in localStorage or sessionStorage
      console.log(typeof response.data);
      localStorage.setItem('user',JSON.stringify (response.data.user));
      localStorage.setItem('token', response.data.token);


      // Display success toast
      toast.success('Login successful');
      if(response.data.user.role === 'admin'){
        navigate('/admin/dashboard');
      }else if(response.data.user.role === 'author'){
        navigate('/author/dashboard');
      }else{
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        toast.error('You are not authorized to login');
      }

      // Navigate to the dashboard or home page after successful login
    } catch (error) {
      // Display error message from the server or default error message
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);  // Stop loading state once the request completes
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="mb-6">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Mail className="absolute right-3 top-2.5 text-gray-400 z-20" size={18} />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}  // Disable the button while loading
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
