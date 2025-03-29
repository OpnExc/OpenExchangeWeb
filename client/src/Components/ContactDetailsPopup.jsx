import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Phone, X, CheckCircle, AlertTriangle } from 'lucide-react';

const ContactDetailsPopup = ({ onClose, onUpdateSuccess, currentContact }) => {
  const [phone, setPhone] = useState(currentContact || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get token function
  const getToken = () => {
    try {
      const googleAuth = localStorage.getItem('google');
      const jwtAuth = localStorage.getItem('jwt');
      
      if (googleAuth) {
        const parsedAuth = JSON.parse(googleAuth);
        return parsedAuth.token;
      } else if (jwtAuth) {
        const parsedAuth = JSON.parse(jwtAuth);
        return parsedAuth.token.token || parsedAuth.token;
      }
      return null;
    } catch (e) {
      console.error('Error retrieving token:', e);
      return null;
    }
  };

  // Handle phone input change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  // Update contact details
  const updateContactDetails = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      await axios.patch(
        'http://localhost:8080/user',
        { contact_details: phone },
        { headers: { 'Authorization': token } }
      );

      setSuccess(true);
      setTimeout(() => {
        onUpdateSuccess(phone);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update contact details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateContactDetails();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white shadow-2xl"
        style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="p-8">
          {!success && (
            <div className="absolute top-4 right-4">
              <button 
                onClick={onClose} 
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="text-green-500 text-5xl" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Details Updated!</h3>
              <p className="text-gray-600 mb-8">
                Your contact details have been successfully updated.
              </p>
              <div className="bg-gray-50 p-4 inline-block">
                <p className="flex items-center justify-center text-gray-800">
                  <Phone className="mr-2 h-5 w-5" />
                  <span className="font-medium">{phone}</span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-black mb-2 font-bold text-3xl">
                  Update Contact Details
                </h2>
                <p className="text-gray-600">
                  Please provide your phone number for transaction communications
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
                <div className="group relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    required
                    maxLength={10}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 p-3 border-red-500 border-l-4">
                    <p className="flex items-center text-red-500 text-sm">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      {error}
                    </p>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-800">
                    Your contact number will only be shared with the other party when a transaction is approved. We will never share it with third parties.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length !== 10}
                  className="relative bg-black px-6 py-3 w-full overflow-hidden font-medium text-white transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <span className="z-10 relative flex justify-center items-center gap-2">
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Update Contact Details'
                    )}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactDetailsPopup;