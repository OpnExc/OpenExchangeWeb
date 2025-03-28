import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BiLock, BiLoaderAlt, BiError } from 'react-icons/bi';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

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

  useEffect(() => {
    // Extract token from URL
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    
    if (!tokenFromUrl) {
      setError("No reset token provided.");
      setValidatingToken(false);
      return;
    }
    
    setToken(tokenFromUrl);
    
    // Validate the token
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

  // Loading state
  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-white text-2xl font-bold">Reset Password</h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center py-12">
              <BiLoaderAlt className="animate-spin text-blue-600 text-5xl mb-4" />
              <p className="text-gray-600">Validating your reset token...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-white text-2xl font-bold">Invalid Token</h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center py-12">
              <BiError className="text-red-500 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reset Link Invalid</h3>
              <p className="text-gray-600 text-center mb-6">
                {error || "This password reset link is invalid or has expired."}
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center"
              >
                <FiArrowLeft className="mr-2" />
                Return to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-white text-2xl font-bold">Password Reset</h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center py-12">
              <FiCheckCircle className="text-green-500 text-6xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-600 text-center mb-6">
                Your password has been reset successfully.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center"
              >
                Login with New Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-white text-2xl font-bold">Set New Password</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Please enter your new password below.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="relative">
                  <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 p-3 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <BiLoaderAlt className="animate-spin mr-2" size={20} />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  <FiArrowLeft className="mr-1" />
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