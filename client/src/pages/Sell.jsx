import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginPopup from './LoginPopup';
import { ArrowRight, ShoppingBag, Shield, Clock, TrendingUp } from 'lucide-react';

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



  // ...existing authentication code...

  return (
    <div className="min-h-screen bg-white mt-8 text-white">
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
        className="w-full h-60 object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black"></div>
    </div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-full flex flex-col items-center justify-center px-4 text-center"
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight text-white">
            Start Selling on <span className="text-gray-200">Hostel Hustle</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mb-8">
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
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
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
      <div className="py-20 px-4 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6 text-black">Ready to Start Selling?</h2>
          <p className="text-gray-600 mb-8 text-lg">
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
        </motion.div>
      </div>

      {showLoginPopup && (
        <LoginPopup 
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={() => {
            setShowLoginPopup(false);
            navigate('/app/listItem');
          }}
        />
      )}
    </div>
  );
};

export default Sell;