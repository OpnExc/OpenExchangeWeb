import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BiLock, BiLoaderAlt, BiError } from 'react-icons/bi';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import pic from '../../assets/pic.png';
import { BiShow, BiHide } from 'react-icons/bi';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    
    if (!tokenFromUrl) {
      setError("No reset token provided.");
      setValidatingToken(false);
      return;
    }
    
    setToken(tokenFromUrl);
    
    const validateToken = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/validate-reset-token?token=${tokenFromUrl}`);
        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setError("Invalid or expired reset token.");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Token validation failed.");
      } finally {
        setValidatingToken(false);
      }
    };
    
    validateToken();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    
    try {
      await axios.post("http://localhost:8080/reset-password", {
        token,
        password
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl bg-white shadow-lg min-h-[600px]">
          <div className="hidden lg:block lg:w-1/2 relative">
            <img
              src={pic}
              alt="Reset Password"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="p-12 flex items-center justify-center h-full">
              <div className="text-center">
                <BiLoaderAlt className="animate-spin text-black text-3xl mx-auto mb-4" />
                <p className="text-gray-600">Validating your reset token...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl bg-white shadow-lg min-h-[600px]">
          <div className="hidden lg:block lg:w-1/2 relative">
            <img
              src={pic}
              alt="Reset Password"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="p-12 flex items-center justify-center h-full">
              <div className="text-center">
                <BiError className="text-red-500 text-3xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Reset Link Invalid</h3>
                <p className="text-gray-600 text-center mb-6">
                  {error || "This password reset link is invalid or has expired."}
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-black hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-sm inline-flex items-center text-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FiArrowLeft className="mr-2 text-5xl" />
                  Return to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl bg-white shadow-lg min-h-[600px]">
          <div className="hidden lg:block lg:w-1/2 relative">
            <img
              src={pic}
              alt="Reset Password"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="p-12 flex items-center justify-center h-full">
              <div className="text-center">
                <FiCheckCircle className="text-green-500 text-3xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
                <p className="text-gray-600 text-center mb-6">
                  Your password has been reset successfully.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-black hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-sm inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Login with New Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-6xl bg-white shadow-lg min-h-[600px]">
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={pic}
            alt="Reset Password"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Set New Password
              </h2>
              <p className="text-gray-600">
                Please enter your new password below.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border-l-4 border-red-500">
                  <p className="flex items-center">
                    <BiError className="mr-2" />
                    {error}
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 px-4 rounded-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <BiLoaderAlt className="animate-spin mr-2" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-sm text-gray-600 hover:text-black inline-flex items-center"
                >
                  <FiArrowLeft className="mr-2" />
                  Return to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
