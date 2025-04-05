import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Add this import

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    contact_details: ''
  });

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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/user`, { // Update this API call
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        setUserDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };

    checkAuth();
    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  const handleEdit = () => {
    setEditForm({
      name: userDetails.name,
      contact_details: userDetails.contactDetails
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${config.API_URL}/user`, // Replace API calls with config.API_URL
        editForm,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      setUserDetails(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update user details');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!userDetails) return <div className="p-10 text-center">No user details found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-semibold">Name:</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold">Contact Details:</label>
              <input
                type="text"
                value={editForm.contact_details}
                onChange={(e) => setEditForm({ ...editForm, contact_details: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Name:</span>
              <span>{userDetails.name}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Email:</span>
              <span>{userDetails.email}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Contact Details:</span>
              <span>{userDetails.contactDetails}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Role:</span>
              <span className="capitalize">{userDetails.role}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Hostel:</span>
              <span>{userDetails.hostel.name}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Member Since:</span>
              <span>{new Date(userDetails.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between pb-2">
              <span className="font-semibold">Last Updated:</span>
              <span>{new Date(userDetails.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
