import React, { useState } from "react";
import axios from "axios";
import { BiEnvelope, BiLoaderAlt, BiLeftArrowAlt } from 'react-icons/bi';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import config from '../config';

function ForgotPassword({ onClose, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${config.API_URL}/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white rounded-none shadow-2xl" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="p-8">
          <div className="absolute top-4 right-8">
            <button 
              onClick={onClose} 
              className="text-gray-600 text-2xl font-bold hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          {!success ? (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-black mb-2 font-bold text-3xl">
                  Reset Password
                </h2>
                <p className="text-gray-600">
                  Enter your email address and we'll send you instructions to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
                <div className="group relative">
                  <BiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 p-3 border-red-500 border-l-4 rounded-lg">
                    <p className="flex items-center text-red-500 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative bg-black shadow-lg hover:shadow-xl px-6 py-3 rounded-xs w-full overflow-hidden font-medium text-white transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <BiLoaderAlt className="animate-spin mr-2" size={20} />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Sent!</h3>
              <p className="text-gray-600 mb-6">
                We've sent a recovery link to <span className="font-medium">{email}</span>. 
                Please check your inbox and follow the instructions.
              </p>
              <button
                onClick={switchToLogin}
                className="bg-black hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-xs inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <BiLeftArrowAlt className="mr-2" size={20} />
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
