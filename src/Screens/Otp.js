import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // To navigate after OTP verification
import authService from '../services/authservices';
const OTP = () => {
  const userEmail = localStorage.getItem('email') || '';
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();  // React Router hook for navigation

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== '') {
      if (index < 3) {
        inputRefs.current[index + 1].focus();
      } else {
        inputRefs.current[index].blur();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      if (index > 0 && otp[index] === '') {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      setLoading(true);
      try {
        // Call authService.verifyOTP to verify the entered OTP
        const response = await authService.verifyOTP({ email: userEmail, verificationCode: otpValue });
        toast.success('OTP Verified successfully!');
        console.log(response);
        // Redirect to dashboard or another page after successful verification
        navigate('/login');
      } catch (error) {
        toast.error('Failed to verify OTP. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all OTP digits');
    }
  };

  const handleResendOTP = async () => {
    try {
      // Call authService.resendOTP to resend the OTP to the user's email
      await authService.resendOTP(userEmail);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <button className="text-indigo-600 hover:text-indigo-800" onClick={() => navigate(-1)}>
              <ArrowLeft className="inline-block mr-2" size={20} />
              Back
            </button>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Enter Verification Code
          </h2>
          <div className="flex items-center justify-center mb-6">
            <Mail className="text-gray-400 mr-2" size={20} />
            <p className="text-sm text-gray-600">
              {userEmail ? `Code sent to ${userEmail}` : 'Check your email for the code'}
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={handleResendOTP}
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
