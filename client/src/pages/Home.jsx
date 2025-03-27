import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SimpleItemListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
       

        const response = await axios.get('http://localhost:8080/hostels/1/items', {
        });

        console.log('Items fetched:', response.data);
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to fetch items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleContactSeller = (item) => {
    alert(`Contact ${item.seller} about "${item.Title}"`);
  };

  const handleBuyOrExchange = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const requestType = item.Type === 'sell' ? 'buy' : 'exchange';
      
      await axios.post(
        'http://localhost:8080/requests',
        { item_id: item.ID, type: requestType },
        { headers: { Authorization: token } }
      );

      alert(`${requestType} request sent for "${item.Title}"`);
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send request. Please try again later.');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading items...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!items.length) return <div className="p-10 text-center">No items available.</div>;

  return (
    <div className="mx-auto p-4 container">
      <h1 className="mb-6 font-bold text-2xl">Campus Marketplace</h1>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.ID} className="bg-white shadow p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">{item.Title}</h3>
            {item.Type === 'sell' && item.Price !== null && (
              <p className="mt-1 font-bold text-blue-600">₹{item.Price}</p>
            )}
            <p className="mt-2 text-gray-600">{item.Description}</p>
            <div className="mt-3 text-sm">
              <p><strong>Seller:</strong> {item.seller}</p>
              <p><strong>Hostel:</strong> {item.hostel}</p>
              <p><strong>Type:</strong> {item.Type === 'sell' ? 'For Sale' : 'For Exchange'}</p>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleBuyOrExchange(item)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
              >
                {item.Type === 'sell' ? 'Buy' : 'Exchange'}
              </button>
              <button
                onClick={() => handleContactSeller(item)}
                className="hover:bg-blue-100 px-4 py-2 border border-blue-600 rounded text-blue-600 transition"
              >
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleItemListings;






