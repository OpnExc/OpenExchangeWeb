import React, { act, useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Image as ImageIcon } from 'lucide-react';  
import config from '../config';

const AdminApproval = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch pending items
  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const userStr = localStorage.getItem("google");
        if (!userStr) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const { token } = JSON.parse(userStr);
        
        const response = await axios.get(`${config.API_URL}/admin/items`, {
          headers: {
            Authorization: token, 
          },
        });
        
        setPendingItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to fetch pending items. Make sure you have admin access.");
        setLoading(false);
      }
    };

    fetchPendingItems();
  }, []);

  // Approve an item
  const handleApprove = async (id) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("google"));
      
      await axios.patch(`${config.API_URL}/admin/items/${id}/approve`, {}, {
        headers: {
          Authorization: token,
        },
      });
      setPendingItems(pendingItems.filter((item) => item.ID !== id));
    } catch (err) {
      console.error("Error approving item:", err);
      setError("Failed to approve the item. Please try again.");
    }
  };

  // Reject an item
  const handleReject = async (id) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("google"));
      
      await axios.patch(`${config.API_URL}/admin/items/${id}/reject`, {}, {
        headers: {
          Authorization: token,
        },
      });
      setPendingItems(pendingItems.filter((item) => item.ID !== id));
    } catch (err) {
      console.error("Error rejecting item:", err);
      setError("Failed to reject the item. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="relative bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 pt-28 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent mb-8">
          Pending Items for Approval
        </h1>
        {pendingItems.length === 0 ? (
          <p className="text-center text-gray-600">No pending items to approve.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingItems.map((item) => (
              <div key={item.ID} className="bg-white/20 shadow-lg backdrop-blur-md border border-white/30 rounded-xl p-6">
                <div className="aspect-w-16  aspect-h-9 mb-4 rounded-lg overflow-hidden bg-gray-100">
                  {item.Image ? (
                    <img
                      src={item.Image}
                      alt={item.Title}
                      className="w-full h-48 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{item.Title}</h2>
                <p className="text-gray-600 mt-2">{item.Description}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-blue-600 font-bold">Price: ₹{item.Price}</p>
                  <p className="text-gray-500">Type: {item.Type}</p>
                  <p className="text-gray-500">Quantity: {item.Quantity || 1}</p>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => handleApprove(item.ID)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(item.ID)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6">
          <a
            href="/app/admin/services"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <BookOpen className="mr-2 -ml-1 h-5 w-5" />
            Manage Pending Services
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminApproval;
