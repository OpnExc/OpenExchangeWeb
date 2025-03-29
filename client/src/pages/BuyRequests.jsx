import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Clock, ShoppingBag, CheckCircle, AlertCircle, XCircle, 
  User, Phone, Mail, MapPin, ChevronDown, ChevronUp, Check, X, ExternalLink
} from 'lucide-react';

const BuyRequests = () => {
  const [asSellerRequests, setAsSellerRequests] = useState([]);
  const [asBuyerRequests, setAsBuyerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('selling');
  const [processingId, setProcessingId] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [contactDetails, setContactDetails] = useState({});
  const [success, setSuccess] = useState(null);

  // Get token from localStorage
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
      console.error('Error parsing authentication token:', e);
      return null;
    }
  };

  // Get the current user ID from the token
  const getCurrentUserId = () => {
    try {
      const googleAuth = localStorage.getItem('google');
      const jwtAuth = localStorage.getItem('jwt');
      
      if (googleAuth) {
        const parsedAuth = JSON.parse(googleAuth);
        return parsedAuth.user?.id;
      } else if (jwtAuth) {
        const parsedAuth = JSON.parse(jwtAuth);
        return parsedAuth.user?.id;
      }
      return null;
    } catch (e) {
      console.error('Error getting user ID:', e);
      return null;
    }
  };
  
  const token = getToken();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) {
        setError('You must be logged in to view requests');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/requests', {
          headers: { 'Authorization': token }
        });

        const currentUserId = getCurrentUserId();
        
        // Split requests correctly based on user role
        const asSeller = response.data.filter(req => req.SellerID === currentUserId);
        const asBuyer = response.data.filter(req => req.BuyerID === currentUserId);
        
        // Fetch additional item details
        const enhancedSellerRequests = await Promise.all(asSeller.map(async (request) => {
          try {
            const itemResponse = await axios.get(`http://localhost:8080/items/${request.ItemID}`, {
              headers: { 'Authorization': token }
            });
            return { ...request, itemDetails: itemResponse.data };
          } catch (err) {
            console.error(`Error fetching item ${request.ItemID}:`, err);
            return { ...request, itemDetails: { Title: 'Unknown Item', Price: 0 } };
          }
        }));
        
        const enhancedBuyerRequests = await Promise.all(asBuyer.map(async (request) => {
          try {
            const itemResponse = await axios.get(`http://localhost:8080/items/${request.ItemID}`, {
              headers: { 'Authorization': token }
            });
            return { ...request, itemDetails: itemResponse.data };
          } catch (err) {
            console.error(`Error fetching item ${request.ItemID}:`, err);
            return { ...request, itemDetails: { Title: 'Unknown Item', Price: 0 } };
          }
        }));
        
        setAsSellerRequests(enhancedSellerRequests);
        setAsBuyerRequests(enhancedBuyerRequests);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to fetch requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleApprove = async (requestId) => {
    setProcessingId(requestId);
    try {
      const response = await axios.patch(
        `http://localhost:8080/requests/${requestId}/approve`,
        { status: 'approved' },
        { headers: { 'Authorization': token } }
      );
      
      // Update the request in the state
      const updatedRequests = asSellerRequests.map(req => 
        req.ID === requestId 
          ? { 
              ...req, 
              Status: 'approved',
              itemDetails: {
                ...req.itemDetails,
                Quantity: response.data.item.quantity,
                Status: response.data.item.status
              } 
            } 
          : req
      );
      
      setAsSellerRequests(updatedRequests);
      
      // Store contact details
      if (response.data.buyer_contact && response.data.seller_contact) {
        setContactDetails({
          ...contactDetails,
          [requestId]: {
            buyer: response.data.buyer_contact,
            seller: response.data.seller_contact
          }
        });
      }
      
      setSuccess({
        id: requestId,
        message: `Request approved successfully. ${response.data.item.status === 'sold' ? 'Item marked as sold.' : `Item quantity updated to ${response.data.item.quantity}.`}`
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      
    } catch (err) {
      console.error('Error approving request:', err);
      setError(err.response?.data?.error || 'Failed to approve request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    try {
      await axios.patch(
        `http://localhost:8080/requests/${requestId}/approve`,
        { status: 'rejected' },
        { headers: { 'Authorization': token } }
      );
      
      // Update the request in the state
      const updatedRequests = asSellerRequests.map(req => 
        req.ID === requestId 
          ? { ...req, Status: 'rejected' } 
          : req
      );
      
      setAsSellerRequests(updatedRequests);
      
      setSuccess({
        id: requestId,
        message: 'Request rejected successfully.'
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError(err.response?.data?.error || 'Failed to reject request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const toggleItemExpansion = (itemId) => {
    if (expandedItem === itemId) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error && !asSellerRequests.length && !asBuyerRequests.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          <div className="text-center">
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buy Requests</h1>
          <p className="mt-2 text-gray-600">Manage buy requests for your items and track your purchase requests</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'selling'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('selling')}
          >
            Requests for My Items
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'buying'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('buying')}
          >
            My Purchase Requests
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Requests content */}
        {activeTab === 'selling' ? (
          asSellerRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No buy requests yet</h3>
              <p className="text-gray-600 mb-6">
                When buyers request your items, they'll appear here for you to approve or reject.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {asSellerRequests.map(request => (
                <motion.div
                  key={request.ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Success message */}
                  {success && success.id === request.ID && (
                    <div className="bg-green-50 p-4 border-l-4 border-green-400">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                        <p className="text-green-700">{success.message}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Request Header */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                          {request.itemDetails?.Image ? (
                            <img 
                              src={request.itemDetails.Image} 
                              alt={request.itemDetails.Title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            {getStatusBadge(request.Status)}
                            <span className="ml-2 text-xs text-gray-500">
                              Request ID: #{request.ID}
                            </span>
                          </div>
                          <h3 className="mt-1 text-lg font-medium text-gray-900">
                            {request.itemDetails?.Title || "Unknown Item"}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Transaction Type: <span className="capitalize">{request.Type}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end mt-4 md:mt-0">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{request.itemDetails?.Price?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(request.CreatedAt)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons for pending requests */}
                    {request.Status === 'pending' && (
                      <div className="mt-6 flex space-x-3">
                        <button
                          onClick={() => handleApprove(request.ID)}
                          disabled={processingId === request.ID}
                          className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {processingId === request.ID ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Check className="mr-2 h-5 w-5" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(request.ID)}
                          disabled={processingId === request.ID}
                          className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2 px-4 rounded transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="mr-2 h-5 w-5" />
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {/* View details link */}
                    <div className="mt-6 text-right">
                      <button
                        onClick={() => toggleItemExpansion(request.ID)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end"
                      >
                        {expandedItem === request.ID ? (
                          <>
                            Hide Details
                            <ChevronUp className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            View Details
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedItem === request.ID && (
                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                      {/* Contact details for approved requests */}
                      {request.Status === 'approved' && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="text-blue-700 font-medium mb-3 flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                Buyer Information
                              </h4>
                              {contactDetails[request.ID]?.buyer ? (
                                <ul className="space-y-2">
                                  <li className="flex items-center">
                                    <User className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{contactDetails[request.ID].buyer.name}</span>
                                  </li>
                                  <li className="flex items-center">
                                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{contactDetails[request.ID].buyer.email}</span>
                                  </li>
                                  <li className="flex items-center">
                                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{contactDetails[request.ID].buyer.phone || "Not provided"}</span>
                                  </li>
                                  <li className="flex items-center">
                                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>Hostel: {contactDetails[request.ID].buyer.hostel}</span>
                                  </li>
                                </ul>
                              ) : (
                                <p className="text-gray-500 italic">Loading contact details...</p>
                              )}
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="text-blue-700 font-medium mb-3 flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                Your Information (Shared with Buyer)
                              </h4>
                              {contactDetails[request.ID]?.seller ? (
                                <ul className="space-y-2">
                                  <li className="flex items-center">
                                    <User className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{contactDetails[request.ID].seller.name}</span>
                                  </li>
                                  <li className="flex items-center">
                                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{contactDetails[request.ID].seller.email}</span>
                                  </li>
                                  <li className="flex items-center">
                                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{contactDetails[request.ID].seller.phone || "Not provided"}</span>
                                  </li>
                                  <li className="flex items-center">
                                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>Hostel: {contactDetails[request.ID].seller.hostel}</span>
                                  </li>
                                </ul>
                              ) : (
                                <p className="text-gray-500 italic">Loading contact details...</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                            <p className="text-sm text-yellow-700">
                              Please contact each other to arrange the transaction. Remember to meet in a public place and follow campus guidelines for safe transactions.
                            </p>
                          </div>
                        </>
                      )}
                      
                      {/* Request details */}
                      <div className={`${request.Status === 'approved' ? 'mt-6' : ''}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Item:</span>
                              <span className="font-medium">{request.itemDetails?.Title}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium">₹{request.itemDetails?.Price?.toFixed(2) || "0.00"}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium">{request.itemDetails?.Quantity || 1}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="font-medium capitalize">{request.Status}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Request Date:</span>
                              <span className="font-medium">{formatDate(request.CreatedAt)}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )
        ) : (
          // My Purchase Requests tab content
          asBuyerRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase requests yet</h3>
              <p className="text-gray-600 mb-6">
                When you request to buy items, they'll appear here so you can track their status.
              </p>
              <a 
                href="/app" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
              >
                Browse Marketplace
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {asBuyerRequests.map(request => (
                <motion.div
                  key={request.ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Request Header */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                          {request.itemDetails?.Image ? (
                            <img 
                              src={request.itemDetails.Image} 
                              alt={request.itemDetails.Title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            {getStatusBadge(request.Status)}
                            <span className="ml-2 text-xs text-gray-500">
                              Request ID: #{request.ID}
                            </span>
                          </div>
                          <h3 className="mt-1 text-lg font-medium text-gray-900">
                            {request.itemDetails?.Title || "Unknown Item"}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Transaction Type: <span className="capitalize">{request.Type}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end mt-4 md:mt-0">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{request.itemDetails?.Price?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(request.CreatedAt)}
                        </div>
                      </div>
                    </div>
                    
                    {/* View details link */}
                    <div className="mt-6 text-right">
                      <button
                        onClick={() => toggleItemExpansion(request.ID)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end"
                      >
                        {expandedItem === request.ID ? (
                          <>
                            Hide Details
                            <ChevronUp className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            View Details
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedItem === request.ID && (
                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                      {/* Contact details for approved requests */}
                      {request.Status === 'approved' && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                            <h4 className="text-blue-700 font-medium mb-3 flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Seller Information
                            </h4>
                            
                            <a
                              href="/app/orderHistory"
                              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm mt-2"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View In Order History
                            </a>
                            <p className="text-gray-600 text-sm mt-3">
                              For your convenience, contact details are available in the Order History section.
                            </p>
                          </div>
                        </>
                      )}
                      
                      {/* Request details */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Item:</span>
                              <span className="font-medium">{request.itemDetails?.Title}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium">₹{request.itemDetails?.Price?.toFixed(2) || "0.00"}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium">{request.itemDetails?.Quantity || 1}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="font-medium capitalize">{request.Status}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-gray-600">Request Date:</span>
                              <span className="font-medium">{formatDate(request.CreatedAt)}</span>
                            </li>
                          </ul>
                        </div>
                        
                        {request.Status === 'pending' && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-700">
                              Your request is pending. The seller will be notified and can either approve or reject this request.
                            </p>
                          </div>
                        )}
                        
                        {request.Status === 'rejected' && (
                          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                            <p className="text-sm text-red-700">
                              Sorry, your request was rejected by the seller. The item might no longer be available or the seller is not interested in this transaction.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BuyRequests;