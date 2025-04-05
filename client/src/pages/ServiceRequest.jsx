import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, CheckCircle, Calendar, DollarSign, Tag, ArrowLeft, Clock } from 'lucide-react';
import config from '../config'; // Add this import

const API_URL = config.API_URL;

const ServiceRequest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('academic');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Categories for selection (same as in ServiceMarketplace)
  const categories = ['academic', 'technical', 'creative', 'errands', 'other'];
  
  // Get token from localStorage
  const getToken = () => {
    try {
      // Check for JWT token first
      const jwtData = localStorage.getItem('jwt');
      if (jwtData) {
        const jwtToken = JSON.parse(jwtData);
        return jwtToken.token.token;
      }

      // Check for Google token if JWT token not found
      const googleData = localStorage.getItem('google');
      if (googleData) {
        const googleToken = JSON.parse(googleData);
        return googleToken.token;
      }

      return null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  // Calculate min date for deadline (today)
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    const token = getToken();
    if (!token) {
      setError('You must be logged in to request a service');
      setLoading(false);
      return;
    }
    
    try {
      const requestData = {
        title,
        description,
        category,
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline || null
      };
      
      const response = await axios.post(
        `${API_URL}/service-requests`, 
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setBudget('');
      setCategory('academic');
      setDeadline('');
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/app/services');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating service request:', err);
      setError(err.response?.data?.error || 'Failed to create service request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-0 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/app/services')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Request a Service</h1>
            <p className="text-gray-600 mt-1">Tell us what you need help with</p>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="text-green-500 mr-3 flex-shrink-0" />
            <p className="text-green-700">Your service request has been posted! You'll be redirected shortly.</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Service request form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Request Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Need help with Statistics homework, Looking for website developer"
                  className="pl-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (₹) <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Your budget for this service"
                    min="0"
                    step="0.01"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Leave blank if you're flexible or want to discuss pricing</p>
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={today}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">When do you need this service completed by?</p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Describe what you need in detail. Be specific about requirements, expectations, and any other relevant information."
                  className="pl-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3"
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none transition-colors ${
                    (loading || success) && 'opacity-70 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                      Posted!
                    </>
                  ) : (
                    'Post Request'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Information card */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200 max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-blue-800 mb-2">How it works</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 rounded-full w-5 h-5 text-blue-800 mr-2 mt-0.5">1</span>
              <span>Post your service request with clear details about what you need.</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 rounded-full w-5 h-5 text-blue-800 mr-2 mt-0.5">2</span>
              <span>Service providers can browse requests and choose to accept yours.</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 rounded-full w-5 h-5 text-blue-800 mr-2 mt-0.5">3</span>
              <span>When a provider accepts, you'll both receive contact details to discuss further.</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 rounded-full w-5 h-5 text-blue-800 mr-2 mt-0.5">4</span>
              <span>Once the service is completed to your satisfaction, mark it as complete.</span>
            </li>
          </ul>
          
          <div className="mt-4 flex items-center border-t border-blue-200 pt-4 text-sm text-blue-700">
            <Clock className="text-blue-600 mr-2 h-5 w-5" />
            <span>Service requests remain open for 30 days unless completed or canceled.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;
