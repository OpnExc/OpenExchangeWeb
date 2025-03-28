import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Filter, AlertCircle, Calendar, Clock, CheckCircle, DollarSign, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:8080';

const ServiceRequests = () => {
  const navigate = useNavigate();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [processingId, setProcessingId] = useState(null);
  const [success, setSuccess] = useState(null);

  // Categories for filtering (same as in ServiceMarketplace)
  const categories = ['all', 'academic', 'technical', 'creative', 'errands', 'other'];

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

  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/service-requests`);
        if (Array.isArray(response.data)) {
          setServiceRequests(response.data);
          setFilteredRequests(response.data);
        }
      } catch (err) {
        console.error('Error fetching service requests:', err);
        setError('Failed to load service requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  // Filter requests by search query and category
  useEffect(() => {
    let result = [...serviceRequests];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(request => 
        request.title.toLowerCase().includes(query) || 
        request.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(request => request.category.toLowerCase() === categoryFilter);
    }
    
    setFilteredRequests(result);
  }, [searchQuery, categoryFilter, serviceRequests]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAcceptRequest = async (requestId) => {
    setProcessingId(requestId);
    setError(null);
    setSuccess(null);
    
    const token = getToken();
    if (!token) {
      setError('You must be logged in to accept a service request');
      setProcessingId(null);
      return;
    }
    
    try {
      const response = await axios.patch(
        `${API_URL}/service-requests/${requestId}/accept`,
        {},
        {
          headers: {
            'Authorization': token
          }
        }
      );
      
      setSuccess({
        id: requestId,
        message: 'Request accepted! Contact details have been shared.',
        contact: response.data.requester_contact
      });
      
      // Remove the accepted request from the list after a delay
      setTimeout(() => {
        setServiceRequests(prev => prev.filter(request => request.id !== requestId));
      }, 5000);
      
    } catch (err) {
      console.error('Error accepting service request:', err);
      setError(err.response?.data?.error || 'Failed to accept request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100  min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100  min-h-screen">
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
            <h1 className="text-4xl font-bold text-gray-900">Service Requests</h1>
            <p className="text-gray-600 mt-1">Browse requests from users who need your services</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Filter className="text-gray-400 flex-shrink-0" />
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    categoryFilter === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Request Listings */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || categoryFilter !== 'all'
                ? "No service requests match your search criteria."
                : "There are no open service requests at the moment."}
            </p>
            {searchQuery || categoryFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
              >
                Clear filters
              </button>
            ) : (
              <a
                href="/app/service/request"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
              >
                Create a request
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map(request => (
              <motion.div
                key={request.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300 relative"
              >
                {/* Success message overlay */}
                {success && success.id === request.id && (
                  <div className="absolute inset-0 bg-green-50/95 flex flex-col items-center justify-center p-6 z-10">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-medium text-green-800 mb-2 text-center">{success.message}</h3>
                    <div className="mt-2 p-4 bg-white rounded-lg border border-green-200 w-full">
                      <p className="text-sm text-green-800 font-medium">Contact Information:</p>
                      <p className="text-sm text-green-700">{success.contact}</p>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full mb-2">
                        {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                    </div>
                    {request.budget && (
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>Budget: ₹{request.budget}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">{request.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 text-sm text-gray-500">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <span>Requested by: {request.requester}</span>
                      <span className="mx-2">•</span>
                      <span>Hostel: {request.hostel}</span>
                    </div>
                    {request.deadline && (
                      <div className="flex items-center text-amber-600 font-medium">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Due by: {formatDate(request.deadline)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-3 sm:mb-0">
                      <Clock className="inline-block h-3 w-3 mr-1" />
                      Posted on {formatDate(request.createdAt)}
                    </div>
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={processingId === request.id}
                      className={`w-full sm:w-auto inline-flex justify-center items-center rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none ${
                        processingId === request.id ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingId === request.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Accept Request'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Offer Service Button */}
        <div className="mt-12 flex justify-center">
          <a
            href="/app/service/create"
            className="bg-white text-black px-6 py-3 rounded-lg font-medium border border-black hover:bg-gray-100 transition-colors"
          >
            Offer Your Own Service
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequests;
