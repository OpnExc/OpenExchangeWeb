import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Briefcase, AlertCircle, ArrowLeft, Clock, CheckCircle, 
  XCircle, DollarSign, Tag, Eye, Edit, Trash
} from 'lucide-react';

const API_URL = 'http://localhost:8080';

const MyServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchMyServices = async () => {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('You must be logged in to view your services');
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${API_URL}/my-services`, {
          headers: {
            'Authorization': token
          }
        });
        console.log('Fetched services:', response.data);
        
        if (Array.isArray(response.data)) {
          setServices(response.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load your services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyServices();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
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

  // Loading state
  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-0 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600 mt-1">Manage the services you offer</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Services List */}
        {services.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't offered any services yet</h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first service offering to share your skills with the community.
            </p>
            <a
              href="/app/service/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Offer a service
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map(service => (
              <motion.div
                key={service.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                          <Tag className="inline-block h-3 w-3 mr-1" />
                          {service.category 
                            ? service.category.charAt(0).toUpperCase() + service.category.slice(1)
                            : 'Uncategorized'
                          }
                        </span>
                        {getStatusBadge(service.status)}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    </div>
                    <div className="flex items-center text-lg font-bold text-gray-900">
                      <DollarSign className="h-5 w-5 text-gray-700" />
                      <span>₹{service.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-3 sm:mb-0">
                      <Clock className="inline-block h-4 w-4 mr-1" />
                      Created on {new Date(service.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      {service.status === 'approved' && (
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          onClick={() => navigate(`/app/service-marketplace`)}
                        >
                          <Eye size={16} className="mr-1.5" />
                          View in Marketplace
                        </button>
                      )}
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-black hover:bg-gray-800 focus:outline-none"
                        onClick={() => {
                          // Would typically navigate to an edit page
                          // For now, just show an alert
                          alert(`Edit functionality for "${service.title}" would go here`);
                        }}
                      >
                        <Edit size={16} className="mr-1.5" />
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        onClick={() => {
                          // Would typically show confirmation and delete
                          // For now, just show an alert
                          alert(`Delete functionality for "${service.title}" would go here`);
                        }}
                      >
                        <Trash size={16} className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {service.status === 'rejected' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                      <p className="font-medium mb-1">Reason for rejection:</p>
                      <p>{service.rejection_reason || "No specific reason provided. It may have violated our community guidelines."}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Service Button (only shown if user has at least one service) */}
        {services.length > 0 && (
          <div className="mt-8 flex justify-center">
            <a
              href="/app/service/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              <Briefcase className="mr-2 -ml-1 h-5 w-5" />
              Offer Another Service
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
