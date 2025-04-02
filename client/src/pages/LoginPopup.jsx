import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { BiEnvelope, BiLock, BiLoaderAlt, BiShow, BiHide } from 'react-icons/bi';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Signup from "./Signup"; // Add this import
import ForgotPassword from "./ForgotPassword";

function LoginPopup({ onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Field validation
    if (!email && !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password,
      });
      setIsSubmitted(true);
      localStorage.setItem('jwt', JSON.stringify({
        token: response.data,
        type: 'jwt'
      }));
      window.dispatchEvent(new Event('authStateChanged'));
      setTimeout(() => {
        onClose();
        window.location.href = "/app/home";
      }, 1500);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await axios.post('http://localhost:8080/google-auth', {
        token: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });

      setIsSubmitted(true);
      localStorage.setItem('google', JSON.stringify(response.data));
      console.log("This is google one : ",response.data);
      // Add this after successful Google login
      window.dispatchEvent(new Event('authStateChanged'));
      setTimeout(() => {
        onClose(); // Close the popup
        window.location.href = "/app/home";
      }, 1500);
    } catch (error) {
      setLoading(false);
      setError('Google authentication failed. Please try again.');
      console.error('Google auth error:', error);
    }
  };

  const handleGoogleFailure = () => {
    setError('Google sign-in was unsuccessful. Please try again.');
  };

  if (showSignup) {
    return (
      <Signup 
        onClose={onClose} 
        switchToLogin={() => setShowSignup(false)}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword 
        onClose={onClose}
        switchToLogin={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-50"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm "  onClick={onClose}></div>
      <div 
        className="relative z-10 bg-white rounded-none shadow-2xl"
        style={{ 
          width: '500px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div className="p-8 ">
          <div className="absolute top-4 right-8">
            <button 
              onClick={onClose} 
              className="text-gray-600 text-2xl font-bold hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-black mb-2 font-bold text-3xl">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleUserLogin} className="space-y-6 max-w-sm mx-auto"> 
            <div className="group relative">
              <BiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-white/60 border ${
                  error && !email ? 'border-red-500' : 'border-gray-300'
                } rounded-xs focus:outline-none focus:ring-2 ${
                  error && !email ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="group relative">
              <BiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 bg-white/60 border ${
                  error && !password ? 'border-red-500' : 'border-gray-300'
                } rounded-xs focus:outline-none focus:ring-2 ${
                  error && !password ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <BiShow className="w-5 h-5" />
                ) : (
                  <BiHide className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 p-3 border-red-500 border-l-4 rounded-lg">
                <p className="flex items-center text-red-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 9 9 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <label className="group flex items-center text-gray-600 cursor-pointer">
                <div className="relative mr-2 w-5 h-5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="checked:bg-blue-500 border-2 border-gray-300 checked:border-blue-500 rounded-none focus:outline-none w-5 h-5 transition-colors appearance-none"
                  />
                </div>
                <span className="group-hover:text-blue-600 text-sm transition-colors">Remember me</span>
              </label>
              <a
                onClick={() => setShowForgotPassword(true)}
                className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 text-sm transition-all cursor-pointer"
              >
                Forgot password?
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <button
              type="submit"
              className="relative bg-black shadow-lg hover:shadow-xl px-6 py-3 rounded-xs w-full max-w-sm overflow-hidden font-medium text-white transition-all duration-300" 
              disabled={loading || isSubmitted}
            >
              <span className="z-10 relative flex justify-center items-center gap-2">
                {loading ? (
                  <div className="inline-flex">
                    <BiLoaderAlt className="text-xl" />
                  </div>
                ) : isSubmitted ? (
                  <div className="inline-flex justify-center items-center gap-2 text-white">
                    <FiCheckCircle className="text-xl" />
                    Success!
                  </div>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="text-lg" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="relative mt-8 text-center">
            <div className="right-0 left-0 absolute bg-gradient-to-r from-transparent via-gray-300/50 to-transparent h-px"></div>
            <span className="inline-block relative bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-gray-600">
              Don't have an account?{" "}
              <span className="inline-block">
                <button
                  onClick={() => setShowSignup(true)}
                  className="font-medium text-blue-600 hover:text-blue-700 decoration-2 decoration-blue-400/30 hover:decoration-blue-500/50 underline underline-offset-2 transition-colors"
                >
                  Register here
                </button>
              </span>
            </span>
          </div>

          <div className="mt-8">
            <div className="relative flex justify-center items-center mb-6">
              <div className="right-0 left-0 absolute bg-gradient-to-r from-transparent via-gray-300/50 to-transparent h-px"></div>
              <span className="relative bg-white/30 backdrop-blur-sm px-4 py-1 rounded-full text-gray-500 text-sm">
                Or continue with
              </span>
            </div>

            <div className="flex justify-center items-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-70 blur-md rounded-full"></div>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  className="z-10 relative"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPopup;
