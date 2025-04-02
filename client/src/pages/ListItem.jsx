import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { Camera, X, Check, AlertTriangle, Package, IndianRupee, RefreshCw, Upload, ChevronRight, Loader } from 'lucide-react';
import { Cloudinary } from '@cloudinary/url-gen';

const API_URL = 'http://localhost:8080';

const SellerDashboard = () => {
  const cld = new Cloudinary({ cloud: { cloudName: 'dabxnbiqy' } });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [fileName, setFileName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [type, setType] = useState('sell');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshItems, setRefreshItems] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'list';
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [token, setToken] = useState(() => {
    const googleAuth = localStorage.getItem('google');
    const jwtAuth = localStorage.getItem('jwt');

    if (googleAuth) {
      return JSON.parse(googleAuth).token;
    } else if (jwtAuth) {
      return JSON.parse(jwtAuth).token;
    }
    return null;
  });
  const [isUploadButtonEnabled, setIsUploadButtonEnabled] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item

  useEffect(() => {
    const checkAuth = () => {
      const googleAuth = localStorage.getItem('google');
      const jwtAuth = localStorage.getItem('jwt');

      if (!googleAuth && !jwtAuth) {
        navigate('/app/sell');
        return;
      }

      if (googleAuth) {
        const parsedAuth = JSON.parse(googleAuth);
        setToken(parsedAuth.token);
      } else if (jwtAuth) {
        const parsedAuth = JSON.parse(jwtAuth);
        console.log(parsedAuth.token.token);
        setToken(parsedAuth.token.token);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const response = await axios.get(`${API_URL}/my-items`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.data && Array.isArray(response.data)) {
          setUserItems(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch user items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [token, refreshItems]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'inventory') {
      setActiveTab('inventory');
    } else if (tab === 'list') {
      setActiveTab('list');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/app/sell');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);
    setFormSubmitted(true);

    if (!title || !description || !type) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const itemData = {
        title,
        description,
        price: parseFloat(price) || 0,
        image: imagePreview,
        type: type,
        quantity: parseInt(quantity) || 1,
      };

      const response = await axios.post(`${API_URL}/items`, itemData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      console.log('Item listed:', response.data);
      if (response.status === 201) {
        setMessage('Item listed successfully! Redirecting to inventory...');
        setTitle('');
        setDescription('');
        setPrice('');
        setFileName('');
        setImagePreview('');
        setType('sell');
        setQuantity(1);
        setRefreshItems(!refreshItems);

        // Add timeout for redirect
        setTimeout(() => {
          setFormSubmitted(false);
          setMessage('');
          setActiveTab('inventory'); // Switch to inventory tab
        }, 2200);
      }
    } catch (err) {
      console.error('Error listing item:', err);
      setError(err.response?.data?.error || 'Failed to list item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploadButtonEnabled(false); // Disable button during upload

        // Show local preview
        const localPreview = URL.createObjectURL(file);
        setImagePreview(localPreview);
        setFileName(file.name);

        // Create FormData for Cloudinary upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'OpenEx'); // Replace with your Cloudinary upload preset
        formData.append('cloud_name', 'dabxnbiqy'); // Replace with your Cloudinary cloud name

        // Upload to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/dabxnbiqy/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.secure_url) {
          setImagePreview(data.secure_url);
          console.log('Image uploaded successfully');

          // Enable button after 3 seconds
          setTimeout(() => {
            setIsUploadButtonEnabled(true);
          }, 1500);
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image. Please try again.');
        setIsUploadButtonEnabled(true); // Re-enable button on error
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isWithin24Hours = (dateString) => {
    const itemDate = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - itemDate) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const handleBuyOrExchange = (item) => {
    if (item.Type === 'exchange') {
      setErrorMessage('Exchange feature is currently unavailable');
      // Auto-hide error message after 3 seconds
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    // Handle buy functionality
    console.log(`Handling buy for item:`, item);
  };

  const handleViewDetails = (item) => {
    if (item.Status.toLowerCase() === 'approved') {
      setSelectedItem(item); // Set the selected item to show details
    } else {
      setSelectedItem(null); // Clear the selected item if not approved
    }
  };

  if (!token) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 min-h-screen">
        <div className="bg-white shadow-lg mx-auto p-8 border border-gray-200 rounded-xl max-w-lg">
          <h2 className="mb-4 font-bold text-gray-800 text-2xl">Please Login to Continue</h2>
          <p className="mb-4 text-gray-600">
            You need to be logged in to access the seller dashboard and features.
          </p>
          <button
            className="bg-black  px-6 py-2 rounded-lg font-semibold text-white"
            onClick={() => window.location.href = '/login'}
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main blurred container */}
      <div
        className={`relative bg-gradient-to-br from-gray-50 to-blue-50 p-6 min-h-screen ${
          message || errorMessage ? 'blur-sm' : ''
        }`}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 font-bold text-gray-800 text-4xl">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your listings and track your sales</p>
          </div>

          <div className="flex space-x-2 bg-gray-200 shadow-md mb-6 p-1 rounded-lg w-fit">
            <button
              className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 ${
                activeTab === 'list'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('list')}
            >
              <Upload className="w-4 h-4" />
              <span>List Item</span>
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 ${
                activeTab === 'inventory'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('inventory')}
            >
              <Package className="w-4 h-4" />
              <span>My Inventory</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'list' && (
              <div key="list-form">
                <div className="bg-white shadow-lg mb-6 p-8 border border-gray-200 rounded-xl">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 mr-4 p-2 rounded-lg">
                      <Upload className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="font-bold text-gray-800 text-2xl">List a New Item</h2>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <div className="flex items-center bg-red-100 mb-6 px-4 py-3 border border-red-300 rounded-lg">
                        <AlertTriangle className="mr-3 w-5 h-5 text-red-600" />
                        <span className="text-red-700">{error}</span>
                      </div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                      <div>
                        <label
                          className="block mb-2 font-semibold text-gray-700"
                          htmlFor="title"
                        >
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className={`shadow-sm px-4 py-3 border ${
                            !title && formSubmitted ? 'border-red-400' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none w-full text-gray-700 leading-tight appearance-none`}
                          placeholder="What are you selling?"
                        />
                        {!title && formSubmitted && (
                          <p className="mt-1 text-red-500 text-sm">Title is required</p>
                        )}
                      </div>

                      <div>
  <label
    className="block mb-2 font-semibold text-gray-700"
    htmlFor="price"
  >
    Price Per Item (₹) <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
      <IndianRupee className="w-5 h-5 text-gray-400" />
    </div>
    <input
      id="price"
      type="number"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      className="shadow-sm px-4 py-3 pl-10 border border-gray-300 focus:border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full text-gray-700 leading-tight appearance-none"
      min="0"
      step="0.01"
      placeholder="Enter price per item"
    />
  </div>
  {!price && formSubmitted && (
    <p className="mt-1 text-red-500 text-sm">Price per item is required</p>
  )}
</div>

                      <div>
                        <label
                          className="block mb-2 font-semibold text-gray-700"
                          htmlFor="quantity"
                        >
                          Quantity
                        </label>
                        <input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="shadow-sm px-4 py-3 border border-gray-300 focus:border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full text-gray-700 leading-tight appearance-none"
                          min="1"
                          step="1"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block mb-2 font-semibold text-gray-700"
                        htmlFor="description"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`shadow-sm px-4 py-3 border ${
                          !description && formSubmitted ? 'border-red-400' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none w-full h-32 text-gray-700 leading-tight appearance-none resize-none`}
                        placeholder="Describe your item in detail..."
                      />
                      {!description && formSubmitted && (
                        <p className="mt-1 text-red-500 text-sm">Description is required</p>
                      )}
                    </div>

                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                      <div>
                        <label
                          className="block mb-2 font-semibold text-gray-700"
                          htmlFor="image"
                        >
                          Image
                        </label>
                        <div className="flex flex-col">
                          <div
                            className={`border-2 border-dashed rounded-lg ${
                              imagePreview ? 'border-gray-300' : 'border-gray-300'
                            } p-4 text-center relative`}
                          >
                            {imagePreview ? (
                              <div className="relative flex justify-center items-center bg-white rounded">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="max-w-full max-h-[200px] object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFileName('');
                                    setImagePreview('');
                                  }}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full text-white shadow-md"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <label
                                htmlFor="image-upload"
                                className="flex flex-col justify-center items-center h-[200px] cursor-pointer hover:bg-gray-50 rounded transition-colors"
                              >
                                <Camera className="mb-2 w-12 h-12 text-gray-400" />
                                <span className="font-medium text-gray-500">Click to upload</span>
                                <span className="mt-1 text-gray-400 text-sm">JPG, PNG or GIF</span>
                              </label>
                            )}
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block mb-2 font-semibold text-gray-700"
                          htmlFor="type"
                        >
                          Listing Type <span className="text-red-500">*</span>
                        </label>
                        <div className="gap-4 grid grid-cols-2">
                          <div
                            className={`border ${
                              type === 'sell'
                                ? 'border-black ring-2 ring-black'
                                : 'border-gray-300'
                            } rounded-lg p-4 cursor-pointer`}
                            onClick={() => setType('sell')}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full ${
                                  type === 'sell'
                                    ? 'bg-black'
                                    : 'border-2 border-gray-400'
                                } mr-2`}
                              ></div>
                              <span className="font-medium">Sell</span>
                            </div>
                            <p className="mt-2 text-gray-500 text-sm">Sell item for money</p>
                          </div>
                          <div
                            className={`border border-gray-300 rounded-lg p-4 cursor-not-allowed opacity-50`}
                          >
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-2"></div>
                              <span className="font-medium text-gray-500">Exchange</span>
                            </div>
                            <p className="mt-2 text-gray-500 text-sm">Coming Soon</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!isUploadButtonEnabled}
                        className={`w-full py-2 px-4 rounded font-medium transition-colors duration-200 
                          ${
                            !isUploadButtonEnabled
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-black text-white'
                          }`}
                      >
                        {!isUploadButtonEnabled ? 'Please wait...' : 'Upload Item'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div
                key="inventory"
                className="bg-white shadow-lg p-8 border border-gray-200 rounded-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 mr-4 p-2 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="font-bold text-gray-800 text-2xl">Your Inventory</h2>
                  </div>

                  <button
                    onClick={() => setRefreshItems(!refreshItems)}
                    className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-700"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                      <p className="text-gray-500">Loading your inventory...</p>
                    </div>
                  </div>
                ) : userItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                    <h3 className="mb-2 font-semibold text-gray-600 text-xl">
                      No Items Listed Yet
                    </h3>
                    <p className="mb-6 text-gray-500">
                      You haven't listed any items for sale or exchange yet.
                    </p>
                    <button
                      onClick={() => setActiveTab('list')}
                      className="inline-flex items-center bg-black  px-6 py-2 rounded-lg font-semibold text-white"
                    >
                      <Upload className="mr-2 w-4 h-4" />
                      <span>List Your First Item</span>
                    </button>
                  </div>
                ) : (
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {userItems
                      .filter(
                        (item) =>
                          item.Status !== 'rejected' || isWithin24Hours(item.CreatedAt)
                      )
                      .map((item) => (
                        <div
                          key={item.ID}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                          onMouseEnter={() => setHoveredItem(item.ID)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className="relative bg-gray-100 h-48">
                            {item.Image ? (
                              <img
                                src={item.Image}
                                alt={item.Title}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="flex justify-center items-center h-full">
                                <Package className="w-12 h-12 text-gray-300" />
                              </div>
                            )}
                            <div className="top-2 right-2 absolute">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  item.Status
                                )}`}
                              >
                                {getStatusIcon(item.Status)}
                                <span className="ml-1">{item.Status.toUpperCase()}</span>
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="mb-1 font-semibold text-lg truncate">
                              {item.Title}
                            </h3>
                            <p className="mb-2 text-gray-600 text-sm line-clamp-2">
                              {truncateText(item.Description, 100)}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-lg">
                                ₹{item.Price || '0'}
                              </span>
                              <span className="font-medium text-black text-sm">
                                {item.Type.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <AnimatePresence>
                            {hoveredItem === item.ID && (
                              <div className="bg-gray-50 p-4 border-gray-200 border-t">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500 text-sm">
                                    Added on {new Date(item.CreatedAt).toLocaleDateString()}
                                  </span>
                                  <button
                                    onClick={() => handleViewDetails(item)}
                                    className="flex items-center font-medium text-black text-sm"
                                  >
                                    <span>View Details</span>
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                  </div>
                )}
                {activeTab === 'inventory' && (
                  <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">
                          Important Notice
                        </h4>
                        <p className="text-sm text-yellow-700">
                          Items Rejected by Admin will automatically be removed from
                          your inventory after 24 hours. This helps keep your inventory
                          clean and focused on active listings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Success message toast */}
      {message && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-out">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center">
            <Check className="w-5 h-5 mr-3 text-green-600" />
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* Error message toast */}
      {errorMessage && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-out">
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

      {/* Selected item details modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Item Details</h2>
            <p>
              <strong>Status:</strong>{' '}
              {selectedItem.Status.toLowerCase() === 'approved'
                ? 'Approved'
                : selectedItem.Status.toLowerCase() === 'sold'
                ? 'Sold'
                : 'Not Accepted'}
            </p>
            {selectedItem.Status.toLowerCase() === 'approved' && (
              <p>
                <strong>Quantity Left:</strong> {selectedItem.Quantity || 'N/A'}
              </p>
            )}
            <button
              onClick={() => setSelectedItem(null)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerDashboard;
