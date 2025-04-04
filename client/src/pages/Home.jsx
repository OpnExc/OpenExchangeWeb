import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/Home.css'; 
import LoginPopup from './LoginPopup';
import { useSearch } from '../context/SearchContext';
import slider1 from '../../assets/slider1.jpg';
import slider3 from '../../assets/slider3.png';

const PENDING_REQUESTS_KEY = 'pendingRequests';

const storePendingRequest = (itemId) => {
  const pendingRequests = JSON.parse(localStorage.getItem(PENDING_REQUESTS_KEY) || '[]');
  if (!pendingRequests.includes(itemId)) {
    pendingRequests.push(itemId);
    localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(pendingRequests));
  }
};

const Home = () => {
  const { currentQuery, searchResults } = useSearch(); // Add this line near the top with other state declarations
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
  const [errorMessage, setErrorMessage] = useState("");
  const [currentHostel, setCurrentHostel] = useState(1); // Assuming currentHostel is needed
  const [requestedItems, setRequestedItems] = useState(new Set());
  const [messageVisible, setMessageVisible] = useState(false);
  const [refreshRequests, setRefreshRequests] = useState(false);
  const successTimeoutRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  // Add this near the top of your component file, right after the imports
  const fadeInAnimation = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

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
    { url: slider3 , alt: 'Slide 1' },
    { url: slider1 , alt: 'Slide 1' },
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
    const fetchRequestedItems = async () => {
      if (!token) return;

      try {
        // Get all requests for the user
        const response = await axios.get('http://localhost:8080/requests', {
          headers: { Authorization: token },
        });

        console.log(response);

        // Filter pending requests and exclude rejected ones
        const pendingRequests = response.data
          .filter((request) => request.Status === 'pending') // Only include pending requests
          .map((request) => request.ItemID);

        // Store pending requests in localStorage
        localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(pendingRequests));

        // Update state with all requested items
        setRequestedItems(new Set(pendingRequests));
      } catch (error) {
        console.error('Error fetching requested items:', error);

        // Fallback to localStorage
        const storedPending = JSON.parse(localStorage.getItem(PENDING_REQUESTS_KEY) || '[]');
        setRequestedItems(new Set(storedPending));
      }
    };

    fetchRequestedItems();
  }, [token, refreshRequests]); // Add refreshRequests to the dependency array

  const fetchItems = async () => {
    setLoading(true);
    
    try {
      // Get selected hostel ID from localStorage or default to 1
      const selectedHostelId = localStorage.getItem('selectedHostel') || 1;
      
      const response = await axios.get(`http://localhost:8080/hostels/${selectedHostelId}/items`);
      const fetchedItems = Array.isArray(response.data) ? response.data : [];
      setItems(fetchedItems);
      
      // Check favorites if user is logged in
      if (token) {
        fetchedItems.forEach(item => checkFavoriteStatus(item.ID));
        checkRequestedItems(fetchedItems.map(item => item.ID));
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to fetch items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchItems();
    
    // Set up polling to refresh item list every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchItems();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []); // Note: removed currentHostel dependency since we're reading from localStorage now

  const handleContactSeller = (item) => {
    alert(`Contact ${item.seller} about "${item.Title}"`);
  };

  const handleBuyOrExchange = async (item) => {
    try {
      if (!token) {
        setShowLoginPopup(true);
        return;
      }
  
      // Get pending requests from localStorage
      const pendingRequests = JSON.parse(localStorage.getItem(PENDING_REQUESTS_KEY) || '[]');
      if (pendingRequests.includes(item.ID)) {
        setErrorMessage("You already have a pending request for this item.");
        setMessageVisible(true);
        setTimeout(() => {
          setErrorMessage('');
          setMessageVisible(false);
        }, 1500);
        return;
      }
  
      const requestData = {
        item_id: parseInt(item.ID),
        type: item.Type === 'sell' ? 'buy' : 'exchange',
        offered_item_id: null,
        quantity: item.quantity || 1, // Include quantity
      };
  
 const response = await axios.post(
        'http://localhost:8080/requests',
        requestData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 201) {
        // Add the item to requestedItems and localStorage
        storePendingRequest(item.ID);
        setRequestedItems((prev) => new Set([...prev, item.ID]));
        setSuccessMessage(`Request sent successfully for "${item.Title}". You can view your requests in the cart.`);
        setMessageVisible(true);
        setIsPopupOpen(false);
  
        // Trigger refresh of requests
        setRefreshRequests((prev) => !prev);
  
        // Clear any existing timeout
        if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
  
        // Set new timeout
        successTimeoutRef.current = setTimeout(() => {
          setSuccessMessage('');
          setMessageVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error making request:', error);
      if (error.response?.data?.error === "Please update your phone number in contact details before making a transaction") {
        setErrorMessage(error.response.data.error || "Some error occurred! Please try later.");
        setTimeout(() => {
          navigate('/app/userdetails');
        }, 2500);
      }
      setErrorMessage(error.response?.data?.error || "Some error occurred! Please try later.");
      setMessageVisible(true);
      setIsPopupOpen(false);
  
      // Clear any existing timeout
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
  
      // Set new timeout
      errorTimeoutRef.current = setTimeout(() => {
        setErrorMessage('');
        setMessageVisible(false);
      }, 2000);
    }
  };

  const checkFavoriteStatus = async (itemId) => {
    try {
      if (!token) return;

      const response = await axios.get(
        `http://localhost:8080/favorites/check/${itemId}`,
        { headers: { Authorization: token } }
      );

      setFavorites((prev) => ({
        ...prev,
        [itemId]: response.data.is_favorite,
      }));
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async (e, itemId) => {
    e.stopPropagation();
    try {
      if (!token) {
        setShowLoginPopup(true);
        return;
      }

      if (favorites[itemId]) {
        // Remove from favorites
        const response = await axios.delete(
          `http://localhost:8080/favorites/${itemId}`,
          { headers: { Authorization: token } }
        );

        if (response.status === 200) {
          setFavorites((prev) => {
            const updatedFavorites = { ...prev };
            delete updatedFavorites[itemId];
            return updatedFavorites;
          });
          setSuccessMessage("Removed from favorites");
          setMessageVisible(true);
        }
      } else {
        // Add to favorites
        const response = await axios.post(
          `http://localhost:8080/favorites`,
          { item_id: itemId },
          { headers: { Authorization: token } }
        );

        if (response.status === 201) {
          setFavorites((prev) => ({
            ...prev,
            [itemId]: true,
          }));
          setSuccessMessage("Added to favorites");
          setMessageVisible(true);
        }
      }

      // Clear success message after 2 seconds
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setMessageVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update favorite status"
      );
      setMessageVisible(true);

      // Clear error message after 2 seconds
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => {
        setErrorMessage("");
        setMessageVisible(false);
      }, 2000);
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
      <style>{fadeInAnimation}</style>
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
                 className="flex-1 py-2 px-4 rounded text-sm font-medium transition-colors duration-200 bg-black hover:bg-gray-800 text-white"
                  onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering parent click events
                       setSelectedItem(item); // Set the selected item
                        setIsPopupOpen(true); // Open the popup
  }}
>
  {item.Type === 'sell' ? 'Buy Now' : 'Exchange'}
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
                className="bg-white rounded-lg max-w-3xl w-[85%] h-4xl pt-4 overflow-hidden shadow-2xl" 
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
                        <p className="text-2xl font-semibold text-gray-900 mb-4">₹{(selectedItem.Price * (selectedItem.quantity || 1)).toFixed(2)}</p>
                      )}
                      <div className="space-y-4">
  <p className="text-gray-600 pb-2 text-base">{selectedItem.Description}</p>
  <p className="text-sm text-gray-600">
                    Available Quantity: {selectedItem.Quantity || 'N/A'}
                  </p>
  <div className="space-y-2">
    <p className="pb-0 text-base">
      <span className="font-semibold">Hostel:</span> {selectedItem.HostelNam}
    </p>
    <p className="text-base">
      <span className="font-semibold">Type:</span> {selectedItem.Type === 'sell' ? 'For Sale' : 'For Exchange'}
    </p>
    {selectedItem.Type === 'sell' && selectedItem.Price !== null && (
      <p className="text-base">
        <span className="font-semibold">Price Per Item:</span> ₹{selectedItem.Price}
      </p>
    )}
  </div>

  {/* Quantity Input with + and - Buttons */}
  <div className="flex items-center space-x-3">
    <label htmlFor="quantity" className="font-semibold">Quantity:</label>
    <button
      className="px-3 pt-0.5 pb-1 border rounded bg-gray-200 hover:bg-gray-300"
      onClick={() => setSelectedItem((prev) => ({
        ...prev,
        quantity: Math.max(1, (prev.quantity || 1) - 1),
      }))}
    >
      -
    </button>
    <input
      type="number"
      id="quantity"
      min="1"
      max={selectedItem.Quantity || 1} // Set max to availableQuantity
      value={selectedItem.quantity || 1}
      className="border pl-5 rounded px-2 py-1 w-16 text-center"
      onChange={(e) => {
        const value = parseInt(e.target.value) || 1;
        setSelectedItem({
          ...selectedItem,
          quantity: Math.min(value, selectedItem.Quantity || 1), // Enforce max limit
        });
      }}
    />
    <button
      className="px-2.5 pt-0.5 pb-1 border rounded bg-gray-200 hover:bg-gray-300"
      onClick={() => setSelectedItem((prev) => ({
        ...prev,
        quantity: Math.min((prev.quantity || 1) + 1, selectedItem.Quantity || 1), // Enforce max limit
      }))}
    >
      +
    </button>
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

      {/* Message Backdrop - Only show when messages are actually visible */}
      {messageVisible && (
        <div 
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => {
            setErrorMessage("");
            setSuccessMessage("");
            setMessageVisible(false);
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
            if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
          }}
          style={{
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        />
      )}

      {/* Error Message */}
      {errorMessage && (
        <div 
          className="fixed top-1/4 right-4 transform -translate-y-1/2 z-50"
          style={{
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg shadow-lg flex items-center">
            <svg
              className="w-5 h-5 mr-3 text-red-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div 
          className="fixed top-1/4 right-4 transform -translate-y-1/2 z-50"
          style={{
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
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

export default Home;






