import React from 'react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const sections = [
    {
      title: "Our Mission",
      content: "Hostel Hustle is dedicated to revolutionizing how students exchange goods within their campus community. We provide a secure, efficient, and user-friendly platform for buying, selling, and trading items."
    },
    {
      title: "How It Works",
      isList: true,
      content: [
        "Sign up with your college email",
        "Browse items available in your hostel",
        "Connect with sellers directly",
        "Make secure transactions",
        "Rate your experience"
      ]
    },
    {
      title: "Our Values",
      content: "We believe in transparency, security, and community. Every feature is designed with students' needs in mind, ensuring a seamless experience for everyone."
    }
  ];

  return (
    <div className="relative bg-white min-h-screen mt-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=100"
            alt="Modern Architecture"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-full flex flex-col bg-gradient-to-b from-black/70 to-black items-center justify-center px-4 "
        >
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-4">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">Hostel Hustle</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-gray-100 to-gray-300 mb-6"></div>
          <p className="text-xl text-gray-100 max-w-2xl text-center font-light">
            Revolutionizing Student Marketplace Experience
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative mx-auto px-6 py-16 container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white shadow-xl backdrop-blur-md mx-auto p-12 rounded-xl max-w-5xl border border-gray-100"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="mb-12 last:mb-0 group hover:bg-gray-50 p-6 rounded-lg transition-all duration-300"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {section.title}
              </h2>
              {section.isList ? (
                <ul className="list-disc list-inside space-y-3 text-gray-600">
                  {section.content.map((item, i) => (
                    <li key={i} className="group-hover:text-gray-900 transition-colors duration-300">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                  {section.content}
                </p>
              )}
              {index !== sections.length - 1 && (
                <div className="border-b border-gray-100 mt-12"></div>
              )}
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div
            {...fadeIn}
            className="text-center mt-12 pt-8 border-t border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              For inquiries, collaborations, or support, contact us at{' '}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=hostelhustle77@gmail.com&su=Inquiry&body=Hello,%20I%20would%20like%20to%20enquire%20about..."
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
              >
                hostelhustle77@gmail.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}