import React from 'react';
import { motion } from 'framer-motion';

export default function CommunityGuidelines() {
  const guidelines = [
    {
      title: "RESPECT & INCLUSIVITY",
      icon: "🤝",
      content: "Treat all members with kindness and respect. Discriminatory language, harassment, or offensive behavior will not be tolerated."
    },
    {
      title: "HONEST TRANSACTIONS",
      icon: "✅",
      content: "All listings should be truthful and accurate. Misrepresenting items or engaging in fraudulent activity will lead to permanent suspension."
    },
    {
      title: "SAFETY FIRST",
      icon: "🛡️",
      content: "Only meet in safe and public hostel spaces for exchanges. Avoid sharing sensitive personal information."
    },
    {
      title: "NO PROHIBITED ITEMS",
      icon: "⛔",
      content: "Illegal, hazardous, or restricted items are strictly forbidden. This includes weapons, drugs, and counterfeit goods."
    }
  ];

  return (
    <div className="relative bg-white min-h-screen mt-8">
      {/* Hero Section */}

      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] overflow-hidden"
      ><div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=100"
            alt="Modern Architecture"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-full flex flex-col items-center justify-center px-4"
        >
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-4">
            Community <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">Guidelines</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-gray-100 to-gray-300 mb-6"></div>
          <p className="text-xl text-gray-100 max-w-2xl text-center font-light">
            Building a Safe and Respectful Community Together
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative mx-auto px-6 py-16 container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white shadow-2xl  mx-auto p-12 rounded-xl max-w-5xl border border-white"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-black text-xl  mb-12 text-center"
          >
            At <span className="font-bold text-black">HOSTEL HUSTLE</span>, we
            believe in fostering a respectful, secure, and collaborative
            environment for all hostel residents.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group bg-white shadow-2xl p-8 rounded-xs border-black hover:bg-black color:white transition-all duration-300"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {guideline.icon}
                </div>
                <h2 className="text-xl font-bold mb-4 text-black group-hover:text-gray-200">
                  {guideline.title}
                </h2>
                <p className="text-black leading-relaxed group-hover:text-gray-300">
                  {guideline.content}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16 pt-8 border-t border-gray-700"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">
              TOGETHER, WE BUILD A BETTER COMMUNITY
            </h2>
            <p className="text-gray-400  text-lg leading-relaxed max-w-3xl mx-auto">
              By following these guidelines, we ensure that HOSTEL HUSTLE
              remains a safe, reliable, and enjoyable marketplace for all.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}