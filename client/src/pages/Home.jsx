import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/Home.css'; 
import LoginPopup from './LoginPopup';
import { useSearch } from '../context/SearchContext';

const SimpleItemListings = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { searchResults, currentQuery } = useSearch();

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500, // Faster transition speed
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Faster slide change
    arrows: true,
    fade: true, // Add fade effect for smoother transitions
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  // Sample slider images - replace with your actual images
  const sliderImages = [
    { url: 'https://cdn.prod.website-files.com/62fc85d3d02ef3d702c7f856/66da67d6e29ba84278202d8d_social-media-01.png', alt: 'Slide 1' },
    { url: 'https://www.designerpeople.com/wp-content/uploads/2022/09/social-media-food-products.jpg', alt: 'Slide 2' },
    { url: 'https://img.etimg.com/thumb/width-1600,height-900,imgsize-2457604,resizemode-75,msid-106617864/tech/startups/advertisements-get-cash-counters-ringing-at-quick-commerce-and-food-delivery-companies.jpg', alt: 'Slide 3' },
  ];

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
    // Don't redirect if not logged in
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/hostels/1/items', {});
        const fetchedItems = Array.isArray(response.data) ? response.data : [];
        setItems(fetchedItems);
        
        if (token) {
          fetchedItems.forEach(item => checkFavoriteStatus(item.ID));
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to fetch items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth(); // Just set token if available
    fetchItems();
  }, [token]); // Remove searchQuery dependency

  const handleContactSeller = (item) => {
    alert(`Contact ${item.seller} about "${item.Title}"`);
  };

  const handleBuyOrExchange = async (item) => {
    try {
      if (!token) {
        setShowLoginPopup(true);
        return;
      }

      const requestData = {
        item_id: parseInt(item.ID),
        type: item.Type === 'sell' ? 'buy' : 'exchange',
        offered_item_id: null
      };

      const response = await axios.post(
        'http://localhost:8080/requests',
        requestData,
        { 
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setSuccessMessage(`Request sent successfully for "${item.Title}". You can view your requests in the cart.`);
        setIsPopupOpen(false);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes("Invalid request")) {
          alert("You cannot request your own item or an unapproved item");
        } else {
          alert(errorMessage || 'Invalid request. Please try again.');
        }
      } else if (error.response?.status === 404) {
        alert('Item not found. It may have been removed.');
      } else {
        console.error('Error details:', error.response?.data);
        alert('Failed to send request. Please try again later.');
      }
    }
  };

  const checkFavoriteStatus = async (itemId) => {
    try {
      if (!token) return;
      
      const response = await axios.get(
        `http://localhost:8080/favorites/check/${itemId}`,
        { headers: { Authorization: token } }
      );
      setFavorites(prev => ({
        ...prev,
        [itemId]: response.data.isFavorite
      }));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async (e, itemId) => {
    e.stopPropagation();
    try {
      if (!token) {
        setShowLoginPopup(true);
        return;
      }

      // Rest of your existing favorite logic...
    } catch (error) {
      // ...existing error handling...
    }
  };

  const onLoginSuccess = () => {
    setShowLoginPopup(false);
    checkAuth(); // Refresh the token
  };

  if (loading) return <div className="p-10 text-center">Loading items...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!items.length) return <div className="p-10 text-center">No items available.</div>;

  return (
    <div className="mx-auto container">
      {/* Image Slider */}
      <div className="slider-container mb-8 mt-11">
        <Slider {...sliderSettings}>
          {sliderImages.map((image, index) => (
            <div key={index} className="slider-slide">
              <img 
                src={image.url} 
                alt={image.alt}
                className="slider-image"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Updated content */}
      <div className="px-24 py-8">
        <h1 className="mb-10 mt-6 font-bold text-5xl">Campus Marketplace</h1>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
          {/* Show search results count only when there's an active search */}
          {currentQuery && (
            <div className="col-span-full mb-4">
              <p className="text-gray-600">
                Found {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'}
                {searchResults.length === 0 && (
                  <span className="block mt-2 text-gray-500">
                    No results found for "{currentQuery}"
                  </span>
                )}
              </p>
            </div>
          )}
          
          {/* Show either search results or all items */}
          {(currentQuery ? searchResults : items).map((item) => (
            <div 
              key={item.ID} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-sm mx-auto w-full"
              onClick={() => {
                setSelectedItem(item);
                setIsPopupOpen(true);
              }}
            >
              <div className="h-60 w-full  overflow-hidden bg-gray-50">
                {item.Image ? (
                  <img
                    src={item.Image}
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
                    className={`ml-2 text-4xl font-medium ${favorites[item.ID] ? 'text-red-600' : 'text-gray-500'}`}
                    onClick={(e) => toggleFavorite(e, item.ID)}
                  >
                    {favorites[item.ID] ? '♥' : '♡'}
                  </button>
                </div>
              </div>
            </div>
          ))}

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
                        src={selectedItem.Image || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={selectedItem.Title}
                        className="w-full h-[300px] object-contain"
                      />
                    </div>

                    <div className="px-6 py-4 md:w-1/2">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold">{selectedItem.Title}</h2>
                      
                      </div>
                      {selectedItem.Type === 'sell' && selectedItem.Price !== null && (
                        <p className="text-xl font-semibold text-gray-900 mb-4">₹{selectedItem.Price}</p>
                      )}
                      
                      <div className="space-y-4">
                        <p className="text-gray-600 pb-2 text-base">{selectedItem.Description}</p>
                        
                        <div className="space-y-2">
                          <p className=" pb-2 text-base"><span className="font-semibold">Hostel:</span> {selectedItem.hostel}</p>
                          <p className="text-base"><span className="font-semibold">Type:</span> {selectedItem.Type === 'sell' ? 'For Sale' : 'For Exchange'}</p>
                        </div>

                        <div className="flex space-x-3 pt-4 pr-10">
                          <button
                            onClick={() => {
                              handleBuyOrExchange(selectedItem);
                              setIsPopupOpen(false);
                            }}
                            className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200"
                          >
                            {selectedItem.Type === 'sell' ? 'Buy Now' : 'Exchange'}
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(e, selectedItem.ID)}
                            className="flex-none px-4 py-2 text-4xl hover:bg-gray-50 rounded transition-colors duration-200"
                          >
                            {favorites[selectedItem.ID] ? (
                              <span className="text-red-600">♥</span>
                            ) : (
                              <span className="text-gray-500">♡</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} onLoginSuccess={onLoginSuccess} />
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-out">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center">
            <svg
              className="w-5 h-5 mr-3 text-green-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleItemListings;






