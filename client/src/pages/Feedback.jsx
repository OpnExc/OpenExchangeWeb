import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Star, Shield } from 'lucide-react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    rating: 5,
    category: 'general',
    contact_back: false
    // Removed name and email fields
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const setRating = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Send request to backend without authentication
      await axios.post('http://localhost:8080/feedback', formData);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        subject: '',
        message: '',
        rating: 5,
        category: 'general',
        contact_back: false
      });
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Feedback</h1>
          <p className="text-gray-600">We'd love to hear your thoughts about the platform!</p>
        </div>
        
        {/* Anonymous Badge */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center">
          <Shield className="h-6 w-6 text-blue-500 mr-2" />
          <div>
            <p className="text-blue-800 font-medium">100% Anonymous Feedback</p>
            <p className="text-blue-600 text-sm">Your feedback is completely anonymous. We don't collect any personal information.</p>
          </div>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {success ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your feedback has been successfully submitted. We appreciate your input!
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-black hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-none transition duration-200"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="subject">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's your feedback about?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="complaint">Complaint</option>
                    <option value="praise">Praise</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none mr-1"
                      >
                        {star <= formData.rating ? (
                          <Star className="h-8 w-8 text-yellow-400 fill-current" />
                        ) : (
                          <Star className="h-8 w-8 text-gray-300" />
                        )}
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600">{formData.rating}/5</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[150px]"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please provide details about your feedback..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-center justify-end">
                  <button
                    className="bg-black hover:bg-black text-white font-medium px-6 py-3 rounded-none transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⟳</span>
                        Sending...
                      </>
                    ) : (
                      'Submit Anonymous Feedback'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              We value your feedback and will use it to improve our platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
