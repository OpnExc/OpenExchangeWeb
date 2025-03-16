import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 min-h-screen overflow-hidden">
      {/* Background decorative elements to match Welcome page */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-40 pointer-events-none [mask-image:linear-gradient(0deg,white,transparent)]"></div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
        className="top-20 right-20 absolute bg-pink-200 blur-3xl rounded-full w-96 h-96 animate-blob mix-blend-multiply filter"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="top-40 -left-20 absolute bg-sky-200 blur-3xl rounded-full w-96 h-96 animate-blob animation-delay-2000 mix-blend-multiply filter"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5, delay: 0.6 }}
        className="right-32 -bottom-20 absolute bg-yellow-200 blur-3xl rounded-full w-96 h-96 animate-blob animation-delay-4000 mix-blend-multiply filter"
      ></motion.div>
      
      {/* Navigation header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="z-10 relative bg-white/30 backdrop-blur-sm px-6 py-4 border-white/30 border-b"
      >
        <div className="flex justify-between items-center mx-auto container">
          <motion.h2
            whileHover={{ scale: 1.05 }}
            className="bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 font-bold text-transparent text-2xl"
          >
            OpenExchange
          </motion.h2>
          <div className="flex space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Home
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg px-6 py-2 rounded-full text-white transition-all duration-300"
            >
              Login
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <div className="relative mx-auto px-4 py-16 container">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-white/20 shadow-2xl backdrop-blur-md mx-auto p-10 border border-white/30 rounded-3xl max-w-4xl"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 font-bold text-4xl md:text-5xl text-center"
          >
            <span className="bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-transparent">
              About OpenExchange
            </span>
          </motion.h1>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.section variants={slideUp}>
              <h2 className="mb-4 font-semibold text-gray-800 text-2xl">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                OpenExchange was founded with a simple yet powerful vision: to create a seamless platform that connects students in hostels, enabling them to share resources, exchange items, and build a stronger community. We believe that by facilitating these connections, we can make hostel living more sustainable, affordable, and enjoyable for everyone.
              </p>
            </motion.section>
            
            <motion.section variants={slideUp}>
              <h2 className="mb-4 font-semibold text-gray-800 text-2xl">What We Offer</h2>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="gap-6 grid grid-cols-1 md:grid-cols-3"
              >
                <motion.div 
                  variants={slideUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={cardHover}
                  className="bg-gradient-to-br from-blue-400/20 to-blue-500/20 p-6 border border-white/30 rounded-xl"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="mb-3 text-4xl"
                  >
                    🏠
                  </motion.div>
                  <h3 className="mb-2 font-medium text-gray-800 text-xl">Hostel Services</h3>
                  <p className="text-gray-600">
                    Find and book the perfect hostel accommodation with our comprehensive listing service. Compare amenities, locations, and prices to make the best choice.
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={slideUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={cardHover}
                  className="bg-gradient-to-br from-purple-400/20 to-purple-500/20 p-6 border border-white/30 rounded-xl"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="mb-3 text-4xl"
                  >
                    💡
                  </motion.div>
                  <h3 className="mb-2 font-medium text-gray-800 text-xl">Item Exchange</h3>
                  <p className="text-gray-600">
                    Our marketplace allows students to buy, sell, or rent items within the community. From textbooks to furniture, find what you need or give items a second life.
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={slideUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={cardHover}
                  className="bg-gradient-to-br from-pink-400/20 to-pink-500/20 p-6 border border-white/30 rounded-xl"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="mb-3 text-4xl"
                  >
                    🤝
                  </motion.div>
                  <h3 className="mb-2 font-medium text-gray-800 text-xl">Community</h3>
                  <p className="text-gray-600">
                    Connect with fellow students, share resources, organize events, and build lasting friendships through our community features.
                  </p>
                </motion.div>
              </motion.div>
            </motion.section>
            
            <motion.section variants={slideUp}>
              <h2 className="mb-4 font-semibold text-gray-800 text-2xl">How It Works</h2>
              <motion.ol 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <motion.li variants={slideUp} className="flex items-start">
                  <span className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 mr-3 rounded-full w-8 h-8 text-white shrink-0">1</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Create an Account</h3>
                    <p className="text-gray-600">Sign up with your email or student credentials to join our platform.</p>
                  </div>
                </motion.li>
                <motion.li variants={slideUp} className="flex items-start">
                  <span className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 mr-3 rounded-full w-8 h-8 text-white shrink-0">2</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Explore Services</h3>
                    <p className="text-gray-600">Browse hostel listings, items for sale, or connect with other students.</p>
                  </div>
                </motion.li>
                <motion.li variants={slideUp} className="flex items-start">
                  <span className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 mr-3 rounded-full w-8 h-8 text-white shrink-0">3</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Connect and Exchange</h3>
                    <p className="text-gray-600">Use our secure chat system to communicate and arrange exchanges or services.</p>
                  </div>
                </motion.li>
              </motion.ol>
            </motion.section>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex md:flex-row flex-col justify-center items-center gap-6 mt-12"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="group hover:bg-blue-600 hover:shadow-lg px-8 py-4 border-2 border-blue-600 rounded-full w-full md:w-auto font-semibold text-blue-600 hover:text-white text-lg active:scale-95 transition-all duration-300"
            >
              Back to Home
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] px-8 py-4 rounded-full w-full md:w-auto font-semibold text-white text-lg active:scale-95 transition-all duration-300"
            >
              Join Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;