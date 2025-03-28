import React from 'react';
import { motion } from 'framer-motion';

function ContactSupport() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-white text-black mt-8 min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=100"
            alt="Support Banner"
            className="w-full h-full object-cover filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-full flex flex-col items-center justify-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            Connect with <span className="text-gray-400">Us</span>
          </h1>
          <div className="w-24 h-1 bg-white mb-6"></div>
          <p className="text-xl text-gray-200 max-w-2xl text-center">
            We're Here to Help You
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative mx-auto px-6 py-16 container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-900 shadow-2xl backdrop-blur-md mx-auto p-12 rounded-none max-w-4xl border border-gray-800"
        >
          <motion.p {...fadeIn} className="text-gray-300 text-lg mb-12 text-center">
            At <span className="font-bold text-white">HOSTEL HUSTLE</span>, we value our community and strive to provide the best support possible. If you have any questions, issues, or need assistance, feel free to reach out to us.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeIn} className="group hover:bg-gray-800/50 p-6 rounded-none transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-3xl mr-3">📧</span> Email Support
              </h2>
              <p className="text-gray-400 group-hover:text-gray-300">
                Reach out to us at{' '}
                <a href="mailto:hostelhustle77@gmail.com" className="text-gray-300 hover:text-white underline">
                  hostelhustle77@gmail.com
                </a>
              </p>
            </motion.div>

            <motion.div {...fadeIn} className="group hover:bg-gray-800/50 p-6 rounded-none transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-3xl mr-3">📞</span> Call Us
              </h2>
              <p className="text-gray-400 group-hover:text-gray-300">
                Our support team is available at{' '}
                <span className="text-white">+91 XXXXXXXXXX</span>
              </p>
            </motion.div>

            <motion.div {...fadeIn} className="group hover:bg-gray-800/50 p-6 rounded-none transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-3xl mr-3">💬</span> Live Chat
              </h2>
              <p className="text-gray-400 group-hover:text-gray-300">
                Use the live chat feature on our website for instant support
              </p>
            </motion.div>

            <motion.div {...fadeIn} className="group hover:bg-gray-800/50 p-6 rounded-none transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-3xl mr-3">📍</span> Visit Us
              </h2>
              <p className="text-gray-400 group-hover:text-gray-300">
                Find us at <span className="text-white">Hostel Block A, Room 102</span>
              </p>
            </motion.div>
          </div>

          <motion.div {...fadeIn} className="text-center mt-12 pt-8 border-t border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              WE'RE HERE FOR YOU!
            </h2>
            <p className="text-gray-400">
              Our team is dedicated to ensuring a smooth and hassle-free experience for all users. Don't hesitate to get in touch!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
export default ContactSupport;