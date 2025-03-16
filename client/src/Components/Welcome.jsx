import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
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

  return (
    <div className="relative bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 min-h-screen overflow-hidden">
      {/* Enhanced background decorative elements */}
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

      <div className="relative flex flex-col justify-center items-center mx-auto px-4 py-16 min-h-screen container">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="space-y-12 bg-white/20 shadow-2xl backdrop-blur-md mx-auto p-10 border border-white/30 rounded-3xl max-w-4xl text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-extrabold text-6xl md:text-7xl"
          >
            <span className="bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-transparent animate-gradient-x">
              Welcome to OpenExchange
            </span>
          </motion.h1>
          
          <motion.p 
            variants={slideUp}
            className="font-light text-gray-700 text-xl md:text-2xl leading-relaxed"
          >
            Your one-stop platform for hostel services and item exchange
          </motion.p>

          <motion.div 
            variants={staggerContainer}
            className="flex md:flex-row flex-col justify-center items-center gap-6"
          >
            <motion.button 
              variants={slideUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] px-8 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300"
            >
              <span className="z-10 relative">Get Started</span>
            </motion.button>
            <motion.button 
              variants={slideUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/about')}
              className="group hover:bg-blue-600 hover:shadow-lg px-8 py-4 border-2 border-blue-600 rounded-full font-semibold text-blue-600 hover:text-white text-lg transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="gap-8 grid grid-cols-1 md:grid-cols-3 mt-16"
          >
            {[
              { icon: "🏠", title: "Hostel Services", desc: "Find and book the perfect hostel accommodation", color: "from-blue-400/20 to-blue-500/20" },
              { icon: "💡", title: "Item Exchange", desc: "Buy, sell, or rent items within the community", color: "from-purple-400/20 to-purple-500/20" },
              { icon: "🤝", title: "Community", desc: "Connect with students and share resources", color: "from-pink-400/20 to-pink-500/20" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className={`group bg-gradient-to-br ${item.color} backdrop-blur-md p-8 border border-white/30 rounded-2xl transition-all duration-300`}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mb-4 text-5xl"
                >
                  {item.icon}
                </motion.div>
                <h3 className="mb-3 font-semibold text-gray-800 text-xl">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;