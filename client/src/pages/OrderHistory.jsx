import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Clock, ShoppingBag, CheckCircle, AlertCircle, XCircle, 
  User, Phone, Mail, MapPin, ChevronDown, ChevronUp 
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // Get token from localStorage
        const googleAuth = localStorage.getItem('google');
        const jwtAuth = localStorage.getItem('jwt');
        
        let token;
        if (googleAuth) {
          const parsedAuth = JSON.parse(googleAuth);
          token = parsedAuth.token;
        } else if (jwtAuth) {
          const parsedAuth = JSON.parse(jwtAuth);
          token = parsedAuth.token.token || parsedAuth.token;
        }
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await axios.get('http://localhost:8080/orders/history', {
          headers: { 'Authorization': token }
        });
        
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError(err.response?.data?.error || 'Failed to fetch your order history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderHistory();
  }, []);

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

  // Toggle expanded order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-24 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-24 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Purchase History</h1>
          <p className="mt-2 text-gray-600">View all your past and pending orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't made any purchases yet. Explore our marketplace to find items!
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
            {orders.map(order => (
              <motion.div
                key={order.ID}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <div 
                  onClick={() => toggleOrderDetails(order.ID)}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                      {order.item_image ? (
                        <img 
                          src={order.item_image} 
                          alt={order.item_title} 
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
                        {getStatusBadge(order.Status)}
                        <span className="ml-2 text-xs text-gray-500">
                          Order ID: #{order.ID}
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-medium text-gray-900">{order.item_title}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-1">{order.item_description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end mt-4 sm:mt-0">
                    <div className="text-lg font-bold text-gray-900">₹{order.item_price}</div>
                    <div className="text-sm text-gray-500">{formatDate(order.order_date)}</div>
                    {expandedOrderId === order.ID ? 
                      <ChevronUp className="mt-2 h-5 w-5 text-gray-400" /> : 
                      <ChevronDown className="mt-2 h-5 w-5 text-gray-400" />
                    }
                  </div>
                </div>
                
                {/* Expanded Order Details */}
                {expandedOrderId === order.ID && (
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                        <ul className="space-y-2 text-sm">
                          <li>
                            <span className="text-gray-600">Status:</span> 
                            <span className="ml-2 font-medium">{order.Status}</span>
                          </li>
                          <li>
                            <span className="text-gray-600">Order Date:</span> 
                            <span className="ml-2 font-medium">{formatDate(order.order_date)}</span>
                          </li>
                          <li>
                            <span className="text-gray-600">Transaction Type:</span> 
                            <span className="ml-2 font-medium capitalize">{order.Type}</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Seller Information</h4>
                        {order.Status === 'approved' ? (
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <User className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{order.seller_name}</span>
                            </li>
                            {order.seller_phone && (
                              <li className="flex items-center">
                                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{order.seller_phone}</span>
                              </li>
                            )}
                            {order.seller_email && (
                              <li className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{order.seller_email}</span>
                              </li>
                            )}
                            <li className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <span>Hostel: {order.seller_hostel}</span>
                            </li>
                          </ul>
                        ) : (
                          <div className="text-sm text-gray-600 italic">
                            <p>Seller contact information will be visible once the order is approved.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Item Details */}
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-2">Item Details</h4>
                      <p className="text-sm text-gray-700">{order.item_description}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;