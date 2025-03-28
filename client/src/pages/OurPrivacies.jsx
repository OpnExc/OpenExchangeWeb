import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const sections = [
    {
      title: "1. INFORMATION WE COLLECT",
      content: "We collect information you provide when signing up, listing items, or interacting with other users. This includes your name, email, hostel details, and transaction history."
    },
    {
      title: "2. HOW WE USE YOUR INFORMATION",
      content: "Your data is used to enhance your experience, facilitate transactions, and ensure the security of our platform. We do not sell or share your personal information with third parties."
    },
    {
      title: "3. DATA SECURITY",
      content: "We implement strong security measures to protect your data from unauthorized access, misuse, or loss. Always keep your account credentials secure."
    },
    {
      title: "4. COOKIES & TRACKING",
      content: "We use cookies to enhance site performance and user experience. You can manage your cookie preferences through your browser settings."
    },
    {
      title: "5. POLICY UPDATES",
      content: "We may update this policy from time to time. Continued use of HOSTEL HUSTLE after updates constitutes acceptance of the new terms."
    }
  ];

  return (
    <div className="relative bg-white min-h-screen mt-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=100"
            alt="Privacy"
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
            Privacy <span className="text-gray-400">Policy</span>
          </h1>
          <div className="w-24 h-1 bg-white mb-6"></div>
          <p className="text-xl text-gray-200 max-w-2xl text-center">
            Protecting Your Information and Ensuring Transparency
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative mx-auto px-6 py-16 container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-900 shadow-2xl backdrop-blur-md mx-auto p-12 rounded-xl max-w-4xl border border-gray-800"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-lg leading-relaxed mb-12 text-center"
          >
            At <span className="font-bold text-white">HOSTEL HUSTLE</span>, we are committed to safeguarding your privacy. This Privacy Policy explains how we collect, use, and protect your personal information while using our platform.
          </motion.p>

          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="mb-12 last:mb-0 group hover:bg-gray-800/50 p-6 rounded-lg transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {section.title}
              </h2>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {section.content}
              </p>
              {index !== sections.length - 1 && (
                <div className="border-b border-gray-700 mt-8"></div>
              )}
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div
            {...fadeIn}
            className="text-center mt-12 pt-8 border-t border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Have Questions?
            </h2>
            <p className="text-gray-400">
              For any privacy-related inquiries, contact us at{' '}
              <a
                href="mailto:hostelhustle77@gmail.com"
                className="text-gray-300 hover:text-white underline transition-colors duration-300"
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