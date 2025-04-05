import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import config from '../config'; // Add this import

const Favorites = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (token) {
      fetchFavorites();
    }
  }, [token]);

  const checkAuth = () => {
    const googleAuth = localStorage.getItem('google');
    const jwtAuth = localStorage.getItem('jwt');
    
    if (!googleAuth && !jwtAuth) {
      navigate('/login');
      return;
    }
    
    if (googleAuth) {
      const parsedAuth = JSON.parse(googleAuth);
      setToken(parsedAuth.token);
    } else if (jwtAuth) {
      const parsedAuth = JSON.parse(jwtAuth);
      setToken(parsedAuth.token.token);
    }
  };

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.API_URL}/favorites`,
        { headers: { Authorization: token } }
      );
      const fetchedItems = Array.isArray(response.data) ? response.data : [];
      setItems(fetchedItems);
      
      // Set all items as favorites
      const favoritesObj = {};
      fetchedItems.forEach(item => {
        favoritesObj[item.ID] = true;
      });
      setFavorites(favoritesObj);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to fetch favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyOrExchange = async (item) => {
    try {
      if (!token) {
        alert('Please login to continue');
        return;
      }
      const requestType = item.Type === 'sell' ? 'buy' : 'exchange';
      await axios.post(
        `${config.API_URL}/requests`,
        { item_id: item.ID, type: requestType },
        { headers: { Authorization: token } }
      );

      alert(`${requestType} request sent for "${item.Title}"`);
    } catch (error) {
      console.log('Error sending request:', error);
      alert('Failed to send request. Please try again later.');
    }
  };

  const toggleFavorite = async (e, itemId) => {
    e.stopPropagation();
    try {
        await axios.delete(
            `${config.API_URL}/favorites/${itemId}`,
            { headers: { Authorization: token } }
        );

        // Remove item from the list
        setItems(prev => prev.filter(item => item.ID !== itemId));
    } catch (error) {
        console.error('Error removing favorite:', error);
        alert('Failed to remove from favorites');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading favorites...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!items.length) return <div className="p-10 text-center">No favorites yet.</div>;

  return (
    <div className="mx-auto container">
      <div className="px-24 py-8">
        <h1 className="mb-10 mt-6 font-bold text-5xl">My Favorites</h1>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
          {items.map((item) => (
            <div 
              key={item.ID} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-sm mx-auto w-full"
              onClick={() => {
                setSelectedItem(item);
                setIsPopupOpen(true);
              }}
            >
              <div className="h-60 w-full overflow-hidden bg-gray-50">
                {item.Images && item.Images.length > 0 ? (
                  <img
                    src={`http://localhost:8080${item.Images[0]}`}
                    alt={item.Title}
                    className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg text-gray-900 line-clamp-1">
                      {item.Title}
                    </h3>
                    {item.Type === 'sell' && item.Price !== null && (
                      <p className="font-semibold text-lg text-gray-900">₹{item.Price}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button 
                    className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyOrExchange(item);
                    }}
                  >
                    {item.Type === 'sell' ? 'Buy Now' : 'Exchange'}
                  </button>
                  <button
                    className="ml-2 text-4xl font-medium text-red-600"
                    onClick={(e) => toggleFavorite(e, item.ID)}
                  >
                    ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && selectedItem && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md backdrop-brightness-75"
          onClick={() => setIsPopupOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-[85%] h-96 pt-10 overflow-hidden shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <button
                className="absolute right-7 top-0 text-gray-500 hover:text-gray-700 z-10"
                onClick={() => setIsPopupOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-2">
                  <img
                    src={selectedItem.Images && selectedItem.Images.length > 0 
                      ? `http://localhost:8080${selectedItem.Images[0]}`
                      : 'https://via.placeholder.com/400x300?text=No+Image'
                    }
                    alt={selectedItem.Title}
                    className="w-full h-[300px] object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>

                <div className="px-6 py-4 md:w-1/2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">{selectedItem.Title}</h2>
                    <button
                      onClick={(e) => toggleFavorite(e, selectedItem.ID)}
                      className="flex-none px-4 py-2 text-4xl hover:bg-gray-50 rounded transition-colors duration-200"
                    >
                      <span className="text-red-600">♥</span>
                    </button>
                  </div>
                  {selectedItem.Type === 'sell' && selectedItem.Price !== null && (
                    <p className="text-xl font-semibold text-gray-900 mb-4">₹{selectedItem.Price}</p>
                  )}
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 pb-2 text-base">{selectedItem.Description}</p>
                    
                    <div className="space-y-2">
                      <p className="pb-2 text-base"><span className="font-semibold">Hostel:</span> {selectedItem.hostel}</p>
                      <p className="text-base"><span className="font-semibold">Type:</span> {selectedItem.Type === 'sell' ? 'For Sale' : 'For Exchange'}</p>
                    </div>

                    <button
                      onClick={() => {
                        handleBuyOrExchange(selectedItem);
                        setIsPopupOpen(false);
                      }}
                      className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200"
                    >
                      {selectedItem.Type === 'sell' ? 'Buy Now' : 'Exchange'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
