import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BiUser, BiEnvelope, BiLock, BiPhone, BiBuilding, BiLoaderAlt, BiShow, BiHide } from 'react-icons/bi';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';

function SignupPopup({ onClose, switchToLogin }) {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [hostel, setHostel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Load the Google API script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Initialize Google Sign-In when the script loads
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "93651837969-9gkvrarqjqv6eqkd5477mppsqjs1865o.apps.googleusercontent.com",
          callback: handleGoogleSignIn,
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = async (response) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Extract the ID token
      const token = response.credential;
      
      // Get user info from the token
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Send token to the backend
      const googleResponse = await axios.post("http://localhost:8080/google-auth", {
        token: token,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      });
      
      // Store token in localStorage
      localStorage.setItem("google", googleResponse.data.token);
      
      // Navigate to the hostels page
      navigate("/app/hostels");
    } catch (e) {
      console.error("Google sign-in error:", e);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      hostel_id: 1
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
      setSignupSuccess(true);
      
      // Show success message briefly before switching to login
      setTimeout(() => {
        switchToLogin(); // Switch to login popup
      }, 1500);
      
    } catch (e) {
      console.log("error : ", e);
      setError("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div 
        className="relative z-10 bg-white rounded-none shadow-2xl"
        style={{ 
          width: '500px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div className="p-8">
          <div className="absolute top-4 right-8">
            <button 
              onClick={onClose}
              className="text-gray-600 text-2xl font-bold hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-black mb-2 font-bold text-3xl">
              Create Account
            </h2>
            <p className="text-gray-600">Start your journey with us today</p>
          </div>

          {error && (
            <div className="bg-red-50 mb-4 p-3 border-red-500 border-l-4 rounded-lg">
              <p className="flex items-center text-red-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {signupSuccess && (
            <div className="bg-green-50 mb-4 p-3 border-green-500 border-l-4 rounded-lg">
              <p className="flex items-center text-green-500 text-sm">
                <FiCheckCircle className="mr-1 w-4 h-4" />
                Signup successful! Redirecting to login...
              </p>
            </div>
          )}

          <form onSubmit={handleUserSign} className="space-y-4 max-w-sm mx-auto">
            <div className="gap-4 grid grid-cols-2">
              <div className="group relative">
                <BiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="group relative">
                <BiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="group relative">
              <BiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="group relative">
              <BiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <BiShow className="w-5 h-5" />
                ) : (
                  <BiHide className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="group relative">
              <BiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="group relative">
              <BiBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
              <input
                type="number"
                placeholder="Hostel"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || signupSuccess}
              className="relative bg-black shadow-lg hover:shadow-xl px-6 py-3 rounded-none w-full overflow-hidden font-medium text-white transition-all duration-300"
            >
              <span className="z-10 relative flex justify-center items-center gap-2">
                {isLoading ? (
                  <div className="inline-flex">
                    <BiLoaderAlt className="animate-spin text-xl" />
                  </div>
                ) : signupSuccess ? (
                  <>
                    <FiCheckCircle className="text-xl" />
                    Success!
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="text-lg" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="relative mt-8 text-center">
            <div className="right-0 left-0 absolute bg-gradient-to-r from-transparent via-gray-300/50 to-transparent h-px"></div>
            <span className="inline-block relative bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 decoration-2 decoration-blue-400/30 hover:decoration-blue-500/50 underline underline-offset-2 transition-colors">
                Sign in here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPopup;
