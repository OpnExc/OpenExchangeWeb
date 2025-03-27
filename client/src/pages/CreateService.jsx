import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, CheckCircle, Briefcase, DollarSign, Tag, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:8080';

const CreateService = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('academic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Categories for selection
  const categories = ['academic', 'technical', 'creative', 'errands', 'other'];
  
  // Get token from localStorage
  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user ? user.token : null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form
    if (!title.trim() || !description.trim() || !price) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    const token = getToken();
    if (!token) {
      setError('You must be logged in to offer a service');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        `${API_URL}/services`, 
        {
          title,
          description,
          price: parseFloat(price),
          category
        },
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
      setPrice('');
      setCategory('academic');
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/app/service-marketplace');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err.response?.data?.error || 'Failed to create service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-28 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/app/service-marketplace')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Offer a Service</h1>
            <p className="text-gray-600 mt-1">Share your skills with the community</p>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="text-green-500 mr-3 flex-shrink-0" />
            <p className="text-green-700">Your service has been submitted for review! You'll be redirected shortly.</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Service creation form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Math Tutoring, Web Development, Essay Editing"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                  />
                </div>
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
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
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

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                  />
                </div>
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
                  rows={4}
                  placeholder="Describe your service, your qualifications, and what customers can expect"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
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
                      Submitted!
                    </>
                  ) : (
                    'Offer Service'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Information card */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200 max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-blue-800 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 rounded-full w-5 h-5 text-blue-800 mr-2 mt-0.5">1</span>
              <span>Your service will be reviewed by moderators to ensure it meets our community guidelines.</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 rounded-full w-5 h-5 text-blue-800 mr-2 mt-0.5">2</span>
              <span>Once approved, your service will be visible to all users in the marketplace.</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 rounded-full w-5 h-5 text-blue-800 mr-2 mt-0.5">3</span>
              <span>You'll be notified when someone wants to use your service, and you can choose to accept or decline.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateService;