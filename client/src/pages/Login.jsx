import React, { useState, useEffect } from "react";
import Pic from '../../assets/Pic.png';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { BiEnvelope, BiLock, BiLoaderAlt } from 'react-icons/bi';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleUserLogin = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password,
      });
      setIsSubmitted(true);
      // Store token or user info in localStorage if needed
      localStorage.setItem('user', JSON.stringify(response.data));
      setTimeout(() => {
        navigate('/app/hostels');
      }, 1500);
    } catch(error) {
      setLoading(false);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      // Decode the JWT token from Google
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);

      // Send the token to your backend for verification and registration if needed
      const response = await axios.post('http://localhost:8080/google-auth', {
        token: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });

      // Handle successful login
      setIsSubmitted(true);
      localStorage.setItem('user', JSON.stringify(response.data));
      setTimeout(() => {
        navigate('/app/item-listings');
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex justify-center items-center bg-gradient-to-br from-sky-100 via-rose-100 to-amber-100 min-h-screen overflow-hidden"
    >
      {/* Enhanced animated background blobs */}
      <motion.div 
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 0],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="top-20 right-20 absolute bg-pink-300 opacity-30 blur-3xl rounded-full w-96 h-96 mix-blend-multiply"
      />
      <motion.div 
        animate={{
          scale: [1.2, 0.8, 1.2],
          rotate: [90, -90, 90],
          x: [0, -30, 0],
          y: [0, 50, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="top-40 -left-20 absolute bg-sky-300 opacity-30 blur-3xl rounded-full w-96 h-96 mix-blend-multiply"
      />
      <motion.div 
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, -180, 0],
          x: [0, -20, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="right-32 -bottom-20 absolute bg-yellow-300 opacity-30 blur-3xl rounded-full w-96 h-96 mix-blend-multiply"
      />
      <motion.div 
        animate={{
          scale: [0.9, 1.3, 0.9],
          rotate: [45, -45, 45],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bottom-1/4 left-1/4 absolute bg-purple-300 opacity-20 blur-3xl rounded-full w-72 h-72 mix-blend-multiply"
      />

      <div className="relative px-4 py-8 w-full max-w-6xl">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex bg-white/10 shadow-2xl backdrop-blur-md border border-white/40 rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 40px 0 rgba(255, 255, 255, 0.3) inset" }}
        >
          {/* Left side - Image with enhanced styling */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="hidden relative md:flex justify-center items-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 w-1/2 overflow-hidden"
          >
            <div className="z-0 absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
            
            {/* Decorative elements */}
            <motion.div 
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute opacity-20 w-full h-full"
              style={{ 
                background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)"
              }}
            />
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="z-10 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl rotate-6 scale-105 transform"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/20 to-purple-500/20 rounded-2xl -rotate-4 scale-105 transform"></div>
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                src={Pic}
                alt="Login Illustration" 
                className="z-10 relative shadow-lg rounded-2xl max-h-[500px] object-contain" 
                style={{ filter: "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))" }}
              />
            </motion.div>
          </motion.div>

          {/* Right side - Enhanced Form */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="p-8 md:p-12 w-full md:w-1/2"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mb-8 md:text-left text-center"
            >
              <h2 className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 font-bold text-transparent text-4xl">
                Welcome Back
              </h2>
              <p className="opacity-80 text-gray-600">Sign in to continue your journey</p>
            </motion.div>

            <form onSubmit={handleUserLogin} className="space-y-6">
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="group relative"
              >
                <BiEnvelope className="top-1/2 left-4 absolute text-gray-400 group-focus-within:text-blue-500 text-lg transition-colors -translate-y-1/2 duration-200 transform" />
                <motion.input 
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-white/60 shadow-sm backdrop-blur-sm p-4 pl-12 border border-white/40 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full transition-all duration-200" 
                />
              </motion.div>

              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="group relative"
              >
                <BiLock className="top-1/2 left-4 absolute text-gray-400 group-focus-within:text-blue-500 text-lg transition-colors -translate-y-1/2 duration-200 transform" />
                <motion.input 
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-white/60 shadow-sm backdrop-blur-sm p-4 pl-12 border border-white/40 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full transition-all duration-200" 
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 p-3 border-red-500 border-l-4 rounded-lg"
                  >
                    <p className="flex items-center text-red-500 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex justify-between items-center"
              >
                <label className="group flex items-center text-gray-600 cursor-pointer">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}  
                    className="relative mr-2 w-5 h-5"
                  >
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="checked:bg-blue-500 border-2 border-gray-300 checked:border-blue-500 rounded-md focus:outline-none w-5 h-5 transition-colors appearance-none" 
                    />
                    {rememberMe && (
                      <motion.svg 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="top-0 left-0 absolute w-5 h-5 text-white" 
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                  <span className="group-hover:text-blue-600 text-sm transition-colors">Remember me</span>
                </label>
                <motion.a 
                  whileHover={{ scale: 1.05, x: 2 }}
                  href="#" 
                  className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 text-sm transition-all"
                >
                  Forgot password?
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg hover:shadow-xl px-6 py-4 rounded-xl w-full overflow-hidden font-medium text-white transition-all duration-300"
                disabled={loading || isSubmitted}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"
                />
                <span className="z-10 relative flex justify-center items-center gap-2">
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-flex"
                    >
                      <BiLoaderAlt className="text-xl" />
                    </motion.div>
                  ) : isSubmitted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex justify-center items-center gap-2 text-white"
                    >
                      <FiCheckCircle className="text-xl" />
                      Success!
                    </motion.div>
                  ) : (
                    <>
                      Sign In
                      <FiArrowRight className="text-lg" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Enhanced Signup Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="relative mt-8 text-center"
            >
              <div className="right-0 left-0 absolute bg-gradient-to-r from-transparent via-gray-300/50 to-transparent h-px"></div>
              <span className="inline-block relative bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-gray-600">
                Don't have an account?{" "}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <Link to="/Signup" className="font-medium text-blue-600 hover:text-blue-700 decoration-2 decoration-blue-400/30 hover:decoration-blue-500/50 underline underline-offset-2 transition-colors">
                    Register here
                  </Link>
                </motion.span>
              </span>
            </motion.div>

            {/* Enhanced Social Login Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mt-8"
            >
              <div className="relative flex justify-center items-center mb-6">
                <div className="right-0 left-0 absolute bg-gradient-to-r from-transparent via-gray-300/50 to-transparent h-px"></div>
                <span className="relative bg-white/30 backdrop-blur-sm px-4 py-1 rounded-full text-gray-500 text-sm">
                  Or continue with
                </span>
              </div>
              
              <div className="flex justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-70 blur-md rounded-full"></div>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="continue_with"
                    shape="pill"
                    className="z-10 relative"
                  />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Extra decorative elements */}
            <motion.div
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="-right-10 -bottom-10 absolute bg-gradient-to-tr from-purple-500/10 to-pink-500/10 blur-xl rounded-full w-40 h-40"
            />
            
          </motion.div>
        </motion.div>
      </div>

      {/* Additional floating decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="top-10 left-10 absolute bg-blue-400 rounded-full w-3 h-3"
        style={{
          boxShadow: "0 0 20px 2px rgba(59, 130, 246, 0.3)",
          animation: "pulse 4s infinite"
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="top-20 right-32 absolute bg-purple-400 rounded-full w-2 h-2"
        style={{
          boxShadow: "0 0 15px 2px rgba(139, 92, 246, 0.3)",
          animation: "pulse 3s infinite"
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="bottom-16 left-1/4 absolute bg-pink-400 rounded-full w-2 h-2"
        style={{
          boxShadow: "0 0 15px 2px rgba(236, 72, 153, 0.3)",
          animation: "pulse 5s infinite"
        }}
      />
            
      {/* Add a subtle particle effect via CSS */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </motion.div>
  );
}

export default Login;