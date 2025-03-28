import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const checkAuth = () => {
    const googleAuth = localStorage.getItem('google');
    const jwtAuth = localStorage.getItem('jwt');
    
    if (googleAuth) {
      const parsedAuth = JSON.parse(googleAuth);
      setToken(parsedAuth.token);
    } else if (jwtAuth) {
      const parsedAuth = JSON.parse(jwtAuth);
      setToken(parsedAuth.token.token);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/requests/${requestId}/approve`,
        { status: 'approved' },  // Add status in request body
        { 
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setRequests(requests.map(request => 
          request.ID === requestId 
            ? { ...request, Status: 'approved' }
            : request
        ));
        alert('Request approved successfully');
      }
    } catch (error) {
      console.error('Error approving request:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to approve request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/requests/${requestId}/approve`,
        { status: 'rejected' },
        { 
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setRequests(requests.map(request => 
          request.ID === requestId 
            ? { ...request, Status: 'rejected' }
            : request
        ));
        alert('Request rejected successfully');
      }
    } catch (error) {
      console.error('Error rejecting request:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to reject request. Please try again.');
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://localhost:8080/requests',
          { 
            headers: { 
              'Authorization': token,
              'Content-Type': 'application/json'
            }
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    if (token) {
      fetchRequests();
    }
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading requests...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!requests.length) return <div className="p-10 text-center">No requests found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Requests for my products</h1>
      <div className="grid gap-4">
        {requests.map((request) => (
          <div 
            key={request.ID} 
            className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                {request.Item?.Images && request.Item.Images.length > 0 ? (
                  <img
                    src={`http://localhost:8080${request.Item.Images[0]}`}
                    alt={request.Item.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{request.Item?.Title}</h3>
                <div className="flex items-center gap-4">
                  <p className="text-gray-600">
                    Type: <span className="capitalize">{request.Type}</span>
                  </p>
                  <p className="text-gray-600">
                    Status: 
                    <span className={`capitalize font-medium ml-1 ${
                      request.Status === 'approved' ? 'text-green-600' :
                      request.Status === 'rejected' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {request.Status}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Requested on: {new Date(request.CreatedAt).toLocaleDateString()}
                  </p>
                </div>
                {request.Type === 'exchange' && request.OfferedItem && (
                  <p className="text-sm text-gray-600 mt-1">
                    Offered: {request.OfferedItem.Title}
                  </p>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            {request.Status === 'pending' && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleApproveRequest(request.ID)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectRequest(request.ID)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellRequests;
