import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  SearchX, AlertCircle, ArrowLeft, Clock, CheckCircle, 
  XCircle, DollarSign, Calendar, MoreHorizontal, User, CheckSquare
} from 'lucide-react';

const API_URL = 'http://localhost:8080';

const MyServiceRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

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

  useEffect(() => {
    const fetchMyRequests = async () => {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('You must be logged in to view your service requests');
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${API_URL}/my-service-requests`, {
          headers: {
            'Authorization': token
          }
        });
        
        if (Array.isArray(response.data)) {
          setRequests(response.data);
        }
      } catch (err) {
        console.error('Error fetching service requests:', err);
        setError('Failed to load your service requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="mr-1 h-3 w-3" />
            Open
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const handleCancelRequest = async (requestId) => {
    setActionInProgress(requestId);
    setActionMessage(null);
    
    const token = getToken();
    if (!token) {
      setError('You must be logged in to cancel a request');
      setActionInProgress(null);
      return;
    }
    
    try {
      await axios.patch(
        `${API_URL}/service-requests/${requestId}/cancel`,
        {},
        {
          headers: {
            'Authorization': token
          }
        }
      );
      
      // Update the state to reflect the change
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'cancelled' } : req
        )
      );
      
      setActionMessage({
        type: 'success',
        text: 'Service request cancelled successfully!'
      });
      
    } catch (err) {
      console.error('Error cancelling service request:', err);
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to cancel request. Please try again.'
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    setActionInProgress(requestId);
    setActionMessage(null);
    
    const token = getToken();
    if (!token) {
      setError('You must be logged in to complete a request');
      setActionInProgress(null);
      return;
    }
    
    try {
      await axios.patch(
        `${API_URL}/service-requests/${requestId}/complete`,
        {},
        {
          headers: {
            'Authorization': token
          }
        }
      );
      
      // Update the state to reflect the change
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'completed' } : req
        )
      );
      
      setActionMessage({
        type: 'success',
        text: 'Service request marked as completed!'
      });
      
    } catch (err) {
      console.error('Error completing service request:', err);
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to complete request. Please try again.'
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-28 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-gray-900">My Service Requests</h1>
            <p className="text-gray-600 mt-1">Manage the services you've requested</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Action message */}
        {actionMessage && (
          <div className={`mb-6 ${
            actionMessage.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          } border rounded-lg p-4 flex items-center`}>
            {actionMessage.type === 'success' 
              ? <CheckCircle className="text-green-500 mr-3 flex-shrink-0" />
              : <AlertCircle className="text-red-500 mr-3 flex-shrink-0" />
            }
            <p className={actionMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {actionMessage.text}
            </p>
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <SearchX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't requested any services yet</h3>
            <p className="text-gray-600 mb-6">
              Need help with something? Create a service request and get connected with skilled providers.
            </p>
            <a
              href="/app/service/request"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Request a service
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map(request => (
              <motion.div
                key={request.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                          {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                    </div>
                    {request.budget > 0 && (
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <DollarSign className="h-5 w-5 text-gray-700" />
                        <span>₹{request.budget}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{request.description}</p>
                  
                  {/* Provider details (if request is accepted) */}
                  {request.status === 'in-progress' && request.provider && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800 flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" />
                        Service Provider
                      </h4>
                      <p className="text-blue-700">{request.provider_name}</p>
                      <p className="text-blue-700">{request.provider_contact}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-1 mb-3 sm:mb-0">
                      {request.deadline && (
                        <div className="flex items-center text-sm text-amber-600">
                          <Calendar className="mr-1.5 h-4 w-4" />
                          Due by: {formatDate(request.deadline)}
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1.5 h-3 w-3" />
                        Created on {formatDate(request.created_at)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {request.status === 'open' && (
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleCancelRequest(request.id)}
                          disabled={actionInProgress === request.id}
                        >
                          {actionInProgress === request.id ? (
                            <>
                              <div className="animate-spin mr-1.5 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1.5 h-4 w-4" />
                              Cancel Request
                            </>
                          )}
                        </button>
                      )}
                      {request.status === 'in-progress' && (
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleCompleteRequest(request.id)}
                          disabled={actionInProgress === request.id}
                        >
                          {actionInProgress === request.id ? (
                            <>
                              <div className="animate-spin mr-1.5 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckSquare className="mr-1.5 h-4 w-4" />
                              Mark as Completed
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create New Request Button */}
        {requests.length > 0 && (
          <div className="mt-8 flex justify-center">
            <a
              href="/app/service/request"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Request Another Service
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServiceRequests;