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
  const [phone, setPhone] = useState("");
  const [hostel, setHostel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserSign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    let fullName = firstName + " " + lastName;
    let data = {
      name: fullName,
      email: email,
      password: password,
      contact_details: phone,
      hostel_id : 1
    };

    if (password.length < 8) {
      setError('Password should be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      let response = await axios.post("http://localhost:8080/signup", data);
      console.log("success");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setPhone("");
      setHostel("");
      navigate("/app/hostels");
    } catch (e) {
      console.log("error : ", e);
      setError("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-100 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <motion.div 
        className="flex bg-white shadow-2xl rounded-xl w-full max-w-4xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="p-8 w-full md:w-1/2"
          initial="hidden"
          animate="visible"
        >
          <h2 className="font-extrabold text-gray-900 text-3xl mb-4">Create Your Account</h2>
          <p className="text-gray-600 text-sm mb-6">Start your journey with us today</p>

          {error && (
            <div className="bg-red-100 mb-4 p-3 border border-red-400 rounded text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleUserSign} className="space-y-5">
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block mb-1 font-medium text-gray-700 text-sm">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg w-full"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 font-medium text-gray-700 text-sm">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700 text-sm">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg w-full"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700 text-sm">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 font-medium text-gray-700 text-sm">Phone Number</label>
              <input
                id="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg w-full"
                placeholder="123-456-7890"
              />
            </div>
            <div>
              <label htmlFor="hostel" className="block mb-1 font-medium text-gray-700 text-sm">hostel</label>
              <input
                id="hostel"
                type="number"
                required
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg w-full"
                placeholder="123 Main St"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg w-full text-white"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
            <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                  >
                    <span className="text-gray-700">Already have an account! </span>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="inline-block"
                    >
                      <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Login here
                      </Link>
                    </motion.span>
                  </motion.div>
          </form>
        </motion.div>
        <div className="hidden md:block relative md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1634363657957-d91ac22d230a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA=="
            alt="Signup Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
