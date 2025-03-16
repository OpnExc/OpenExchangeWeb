import React, { useState } from "react";
import Pic from '../../assets/Pic.png';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { BiEnvelope, BiLock, BiLoaderAlt } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      setTimeout(() => {
        navigate('/app/hostels');
      }, 1500);
    } catch(error) {
      setLoading(false);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 min-h-screen overflow-hidden"
    >
      {/* Animated background blobs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="top-20 right-20 absolute bg-pink-200 opacity-40 blur-3xl rounded-full w-96 h-96 mix-blend-multiply"
      />
      <motion.div 
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="top-40 -left-20 absolute bg-sky-200 opacity-40 blur-3xl rounded-full w-96 h-96 mix-blend-multiply"
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="right-32 -bottom-20 absolute bg-yellow-200 opacity-40 blur-3xl rounded-full w-96 h-96 mix-blend-multiply"
      />

      <div className="relative flex justify-center items-center px-4 min-h-screen">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex bg-white/20 shadow-2xl backdrop-blur-md border border-white/30 rounded-3xl w-full max-w-6xl overflow-hidden"
        >
          {/* Left side - Image */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center items-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 w-1/2"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={Pic}
              alt="Login Illustration" 
              className="rounded-2xl max-h-[500px] object-contain" 
            />
          </motion.div>

          {/* Right side - Form */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-12 w-1/2"
          >
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-8 font-bold text-transparent text-3xl"
            >
              Welcome Back
            </motion.h2>

            <form onSubmit={handleUserLogin} className="space-y-6">
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative"
              >
                <BiEnvelope className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2 transform" />
                <motion.input 
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-white/50 backdrop-blur-sm p-4 pl-12 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" 
                />
              </motion.div>

              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="relative"
              >
                <BiLock className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2 transform" />
                <motion.input 
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-white/50 backdrop-blur-sm p-4 pl-12 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" 
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex justify-between items-center"
              >
                <label className="group flex items-center text-gray-700 cursor-pointer">
                  <motion.input 
                    whileHover={{ scale: 1.1 }}
                    type="checkbox" 
                    className="mr-2 rounded" 
                  />
                  <span className="group-hover:text-blue-600 transition-colors">Remember me</span>
                </label>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </motion.a>
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl w-full overflow-hidden text-white transition-all duration-300"
                disabled={loading || isSubmitted}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <BiLoaderAlt className="text-xl" />
                  </motion.div>
                ) : isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500"
                  >
                    ✓ Success!
                  </motion.div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <span className="text-gray-700">Don't have an account? </span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <Link to="/Signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Register here
                </Link>
              </motion.span>
            </motion.div>

            {/* Social Login Section */}
            <div className="space-y-4 mt-8">
              {['Google', 'Facebook'].map((provider, index) => (
                <motion.button
                  key={provider}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + (index * 0.1) }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex justify-center items-center gap-3 bg-white/50 backdrop-blur-sm py-4 border border-white/30 rounded-xl w-full transition-all duration-300"
                >
                  <img 
                    src={`https://upload.wikimedia.org/wikipedia/commons/${
                      provider === 'Google' 
                        ? 'thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'
                        : '5/51/Facebook_f_logo_%282019%29.svg'
                    }`} 
                    alt={`${provider} Logo`} 
                    className="w-5 h-5" 
                  />
                  <span className="text-gray-700">Continue with {provider}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Login;
