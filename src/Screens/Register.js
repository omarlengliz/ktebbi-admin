import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authservices';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      agreeTerms: false,
      role:"author"
    });
    const [loading, setLoading] = useState(false); // For loading state
    const navigate = useNavigate(); // For navigation
  
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validation for empty fields
      if (!formData.firstName) {
        toast.error('First name is required');
        return;
      }
  
      if (!formData.lastName) {
        toast.error('Last name is required');
        return;
      }
  
      if (!formData.username) {
        toast.error('Username is required');
        return;
      }
  
      if (!formData.email) {
        toast.error('Email is required');
        return;
      }
  
      // Validate email format
      if (!validateEmail(formData.email)) {
        toast.error('Invalid email address');
        return;
      }
  
      if (!formData.phone) {
        toast.error('Phone number is required');
        return;
      }
  
      if (!formData.password) {
        toast.error('Password is required');
        return;
      }
  
      if (!formData.agreeTerms) {
        toast.error('You must agree to the terms and conditions');
        return;
      }
  
      setLoading(true);
  
      try {
        // Assuming you have a register function in your authService
        const response = await authService.register({
          firstname: formData.firstName,
          lastname: formData.lastName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
            role: formData.role
        });
  
        toast.success('Registration successful! Check your email for the OTP.');
  
        // Navigate to OTP screen and pass the email as state
        authService.sendOtp(formData.email).then(() => {
          localStorage.setItem('email', formData.email);
          navigate('/otp');
        });
      } catch (error) {
        toast.error('Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <User className="absolute right-3 top-2.5 text-gray-400 z-20" size={18} />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  <User className="absolute right-3 top-2.5 text-gray-400 z-20" size={18} />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <User className="absolute right-3 top-2.5 text-gray-400 z-20" size={18} />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Mail className="absolute right-3 top-2.5 text-gray-400 z-20" size={18} />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <Phone className="absolute right-3 top-2.5 text-gray-400 z-20" size={18} />
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
                  autoComplete="new-password"
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

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agreeTerms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a> and <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms of Use</a>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already Have an Account?{' '}
            <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
