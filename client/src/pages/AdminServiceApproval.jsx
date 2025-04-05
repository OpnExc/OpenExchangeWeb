import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config'; // Add this import
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BookOpen, 
  DollarSign, 
  User, 
  Tag,
  Clock
} from 'lucide-react';


const API_URL = config.API_URL;

const AdminServiceApproval = () => {
  const navigate = useNavigate();
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
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
    const fetchPendingServices = async () => {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('You must be logged in as an admin to view pending services');
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${API_URL}/admin/services`, {
          headers: {
            'Authorization': token
          }
        });
        
        if (Array.isArray(response.data)) {
          setPendingServices(response.data);
        }
      } catch (err) {
        console.error('Error fetching pending services:', err);
        if (err.response?.status === 403) {
          setError('You do not have permission to access this page. Admin access required.');
        } else {
          setError('Failed to load pending services. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingServices();
  }, []);

  const handleApproveService = async (serviceId) => {
    setProcessingId(serviceId);
    setActionMessage(null);
    
    const token = getToken();
    if (!token) {
      setError('You must be logged in as an admin to approve services');
      setProcessingId(null);
      return;
    }
    
    try {
      await axios.patch(
        `${API_URL}/admin/services/${serviceId}/approve`,
        {},
        {
          headers: {
            'Authorization': token
          }
        }
      );
      
      // Remove the approved service from the list
      setPendingServices(prev => prev.filter(service => service.id !== serviceId));
      
      setActionMessage({
        type: 'success',
        text: 'Service approved successfully!'
      });
      
    } catch (err) {
      console.error('Error approving service:', err);
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to approve service. Please try again.'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectionModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const closeRejectionModal = () => {
    setShowRejectionModal(false);
    setSelectedServiceId(null);
    setRejectionReason('');
  };

  const handleRejectService = async () => {
    if (!selectedServiceId) return;
    
    setProcessingId(selectedServiceId);
    setActionMessage(null);
    
    const token = getToken();
    if (!token) {
      setError('You must be logged in as an admin to reject services');
      setProcessingId(null);
      closeRejectionModal();
      return;
    }
    
    try {
      await axios.patch(
        `${API_URL}/admin/services/${selectedServiceId}/reject`,
        { 
          reason: rejectionReason.trim() || 'Your service does not meet our community guidelines.' 
        },
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Remove the rejected service from the list
      setPendingServices(prev => prev.filter(service => service.id !== selectedServiceId));
      
      setActionMessage({
        type: 'success',
        text: 'Service rejected successfully!'
      });
      
      closeRejectionModal();
      
    } catch (err) {
      console.error('Error rejecting service:', err);
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to reject service. Please try again.'
      });
      closeRejectionModal();
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            onClick={() => navigate('/app/admin')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Service Approval</h1>
            <p className="text-gray-600 mt-1">Review and approve pending service offerings</p>
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

        {/* Pending Services List */}
        {pendingServices.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending services</h3>
            <p className="text-gray-600">
              There are currently no services awaiting approval.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 mb-4">
              <Clock className="inline-block h-4 w-4 mr-1 mb-1" />
              Showing {pendingServices.length} pending service{pendingServices.length !== 1 ? 's' : ''} awaiting review
            </p>
            
            {pendingServices.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                          <Tag className="inline-block h-3 w-3 mr-1" />
                          {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending Review
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    </div>
                    <div className="flex items-center text-lg font-bold text-gray-900">
                      <DollarSign className="h-5 w-5 text-gray-700" />
                      <span>₹{service.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 text-sm text-gray-500">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <User className="h-4 w-4 mr-1.5" />
                      <span>Offered by: {service.provider || service.user?.name}</span>
                      <span className="mx-2">•</span>
                      <span>Hostel: {service.hostel || service.user?.hostel?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5" />
                      <span>Submitted on {formatDate(service.created_at)}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-end items-center pt-4 border-t border-gray-100 space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => openRejectionModal(service.id)}
                      disabled={processingId === service.id}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === service.id ? (
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveService(service.id)}
                      disabled={processingId === service.id}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === service.id ? (
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Return to Admin Dashboard */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/app/admin')}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Return to Admin Dashboard
          </button>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Service</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this service. This will be shared with the service provider.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., 'This service violates our community guidelines.' or 'More details needed about service qualifications.'"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeRejectionModal}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectService}
                disabled={processingId === selectedServiceId}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
              >
                {processingId === selectedServiceId ? (
                  <div className="inline-flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  "Confirm Rejection"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServiceApproval;