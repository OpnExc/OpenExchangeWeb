import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const Hostels = () => {
  const [hostels, setHostels] = useState([]);
  const [token, setToken] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    checkAuth();
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/hostels`);
      console.log(response.data);
      setHostels(response.data);
    } catch (err) {
      setError('Failed to fetch hostels');
    }
  };

  const handleAddHostel = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${config.API_URL}/admin/hostels`,
        { name: hostelName },
        {
          headers: {
            Authorization:  `${token}`,
          },
        }
      );
      setHostelName('');
      setSuccess('Hostel added successfully');
      fetchHostels();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add hostel');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Hostel</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <form onSubmit={handleAddHostel}>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hostel Name
            </label>
            <input
              type="text"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Hostel
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-4">Available Hostels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostels.map((hostel) => (
          <div key={hostel.ID} className="bg-white border rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800">{hostel.Name}</h3>
            <p className="text-gray-400 text-sm mt-4">
              Created: {new Date(hostel.CreatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hostels;
