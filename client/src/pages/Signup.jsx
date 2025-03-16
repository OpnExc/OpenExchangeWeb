import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserSign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    let fullName = firstName + " " + lastName;
    let data = {
      Name: fullName,
      Email: email,
      Password: password
    };

    if(password.length < 8){
      setError('Password should be at least 8 characters');
      setIsLoading(false)
      return;
    }
    
    try {
      let response = await axios.post("http://localhost:8080/signup", data);
      console.log("success");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      navigate("/Home");
    } catch (e) {
      console.log("error : ", e);
      setError("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        delay: 0.3 
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.97 }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-100 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <motion.div 
        className="flex bg-white shadow-2xl rounded-xl w-full max-w-4xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left side - Image with motion */}
        <motion.div 
          className="hidden md:block relative md:w-1/2"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="z-10 absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-800/90"></div>
          <img
            src="https://images.unsplash.com/photo-1634363657957-d91ac22d230a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA=="
            alt="Signup Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <motion.div 
            className="z-20 absolute inset-0 flex flex-col justify-center items-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h1 
              className="mb-6 font-bold text-white text-3xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Welcome!
            </motion.h1>
            <motion.p 
              className="mb-8 text-white text-lg text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Join our community and discover amazing features.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Right side - Form with motion */}
        <motion.div 
          className="p-8 w-full md:w-1/2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="mb-6 text-center"
            variants={itemVariants}
          >
            <h2 className="font-extrabold text-gray-900 text-3xl">Create Your Account</h2>
            <p className="mt-2 text-gray-600 text-sm">
              Start your journey with us today
            </p>
          </motion.div>

          {error && (
            <motion.div 
              className="bg-red-100 mb-4 p-3 border border-red-400 rounded text-red-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleUserSign} className="space-y-5">
            <motion.div 
              className="gap-4 grid grid-cols-1 sm:grid-cols-2"
              variants={itemVariants}
            >
              <div>
                <label htmlFor="firstName" className="block mb-1 font-medium text-gray-700 text-sm">
                  First Name
                </label>
                <motion.input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-all"
                  placeholder="John"
                  whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.3)" }}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 font-medium text-gray-700 text-sm">
                  Last Name
                </label>
                <motion.input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-all"
                  placeholder="Doe"
                  whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.3)" }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700 text-sm">
                Email Address
              </label>
              <motion.input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-all"
                placeholder="john@example.com"
                whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.3)" }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700 text-sm">
                Password
              </label>
              <motion.input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-all"
                placeholder="••••••••"
                whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.3)" }}
              />
              <p className="mt-1 text-gray-500 text-xs">
                Password should be at least 8 characters
              </p>
            </motion.div>

            <motion.div 
              className="flex items-center"
              variants={itemVariants}
            >
              <motion.input
                id="newsletter"
                type="checkbox"
                className="border-gray-300 rounded focus:ring-blue-500 w-4 h-4 text-blue-600"
                whileHover={{ scale: 1.1 }}
              />
              <label htmlFor="newsletter" className="block ml-2 text-gray-700 text-sm">
                Subscribe to our newsletter
              </label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="flex justify-center bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 shadow-sm px-4 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full font-medium text-white text-lg transition-all"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isLoading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Signing up...
                </motion.span>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          <motion.div 
            className="mt-6 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <motion.span
                whileHover={{ color: "#2563EB" }}
              >
                <Link
                  to="/Login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in instead
                </Link>
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signup;