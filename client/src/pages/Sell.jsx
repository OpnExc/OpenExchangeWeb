import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginPopup from './LoginPopup';
import { ArrowRight, ShoppingBag, Shield, Clock, TrendingUp } from 'lucide-react';
import sellImage from '../../assets/sell.png';
import ctaImage from '../../assets/sell2.png';

const Sell = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const googleAuth = localStorage.getItem('google');
    const jwtAuth = localStorage.getItem('jwt');
    setIsLoggedIn(!!googleAuth || !!jwtAuth);
  }, []);

  const handleSignUpClick = () => {
    const googleAuth = localStorage.getItem('google');
    const jwtAuth = localStorage.getItem('jwt');
    
    if (googleAuth || jwtAuth) {
      navigate('/app/listItem');
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    navigate('/app/listItem');
  };

  return (
    <div className="min-h-screen bg-white mt-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[80vh] overflow-hidden"
      >
        <div className="absolute h-150 inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=3450&q=100"
            alt="Marketplace"
            className="w-full h-full object-contain opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black"></div>
        </div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-full flex flex-col items-center justify-center px-4 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl mx-auto">
            <div className="flex-1 text-left">
              <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
                Start Selling on <br/><span className="text-gray-200">Hostel Hustle</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-xl">
                Turn your unused items into opportunities. Join the trusted marketplace for hostel residents.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignUpClick}
                className="group bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center"
              >
                {isLoggedIn ? 'Start Selling' : 'Sign Up to Sell'}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
            <div className=" pl-6">
              <img 
                src={sellImage}
                alt="Sell on Hostel Hustle" 
                className="w-96 max-w-lg h-96 rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="pt-10 pb-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="bg-black p-8 rounded-xl border border-gray-900 hover:border-gray-800 transition-all group">
              <TrendingUp className="w-12 h-12 mb-6 text-white group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4 text-white">Quick Sales</h3>
              <p className="text-gray-300">
                Connect with buyers in your hostel community and sell items quickly.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl border border-gray-900 hover:border-gray-800 transition-all group">
              <Shield className="w-12 h-12 mb-6 text-white group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4 text-white">Secure Transactions</h3>
              <p className="text-gray-300">
                Our platform ensures safe and transparent transactions.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl border border-gray-900 hover:border-gray-800 transition-all group">
              <Clock className="w-12 h-12 mb-6 text-white group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4 text-white">24/7 Support</h3>
              <p className="text-gray-300">
                Get assistance anytime you need with our dedicated support team.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="pt-0 pb-15 px-4 bg-[#F1FAFC]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className=" text-center md:text-left">
            <h2 className="text-4xl font-bold mb-6 text-black">Ready to Start Selling?</h2>
            <p className="text-gray-600  mb-8 text-lg">
              Join thousands of students who are already selling on Hostel Hustle.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignUpClick}
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-all duration-300"
            >
              Get Started Now
            </motion.button>
          </div>
          <div className=" pl-16flex-1">
            <motion.img 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              src={ctaImage}
              alt="Start Selling"
              className="w-full pl-36 max-w-lg h-auto rounded-lg shadow-2xl"
            />
          </div>
        </motion.div>
      </div>

      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-white/30" 
            onClick={() => setShowLoginPopup(false)}
          />
          <div className="relative z-50">
            <LoginPopup 
              onClose={() => setShowLoginPopup(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sell;
