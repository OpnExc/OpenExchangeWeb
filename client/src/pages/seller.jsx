import React, { useState, useEffect } from 'react';
import { BiPlus, BiStore, BiLineChart, BiEdit, BiTrash, BiFilterAlt } from 'react-icons/bi';
import { FiEye, FiTag, FiArchive, FiBookOpen, FiMonitor, FiCoffee, FiWatch, FiStar, FiSmartphone, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Enhanced categories with more options
const categories = [
  { id: 1, name: 'sell', label: 'Sell', icon: FiTag },
  { id: 2, name: 'exchange', label: 'Exchange', icon: FiArchive },
  { id: 3, name: 'Books', icon: FiBookOpen, type: 'sell' },
  { id: 4, name: 'Electronics', icon: FiMonitor, type: 'sell' },
  { id: 5, name: 'Furniture', icon: FiCoffee, type: 'sell' },
  { id: 6, name: 'Accessories', icon: FiWatch, type: 'sell' },
  { id: 7, name: 'Collectibles', icon: FiStar, type: 'sell' },
  { id: 8, name: 'Gadgets', icon: FiSmartphone, type: 'sell' },
];

const Seller = () => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({name: 'sell', label: 'Sell'}); // Set default category
  const [myListings, setMyListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalViews: 0,
    activeListings: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    type: 'sell'  // Set default type
  });

  // Token from localStorage for authorization
  const token = localStorage.getItem('token');

  // Parse JWT token with error handling
  const parseJwt = (token) => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Error parsing JWT token:", e);
      return null;
    }
  };

  // Setup axios default headers and fetch user info
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      
      // Get user info
      const fetchUserInfo = async () => {
        try {
          const decoded = parseJwt(token);
          if (decoded && decoded.user_id) {
            setUserInfo({ id: decoded.user_id });
          } else {
            console.warn("Could not extract user_id from token");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      
      fetchUserInfo();
    }
  }, [token]);

  // Fetch hostels when component mounts
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get('http://localhost:8080/hostels');
        if (response.data && Array.isArray(response.data)) {
          setHostels(response.data);
          if (response.data.length > 0) {
            setSelectedHostel(response.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
        toast.error("Failed to fetch hostels");
      }
    };
    
    fetchHostels();
  }, []);

  // Fetch items when component mounts, userInfo changes, or selectedHostel changes
  useEffect(() => {
    if (selectedHostel) {
      fetchMyItems();
    }
    
    // Set up an interval to update views in real-time (simulated)
    const intervalId = setInterval(() => {
      setStats(prevStats => ({
        ...prevStats,
        totalViews: prevStats.totalViews + Math.floor(Math.random() * 3)
      }));
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [userInfo, selectedHostel]); 

  const fetchMyItems = async () => {
    if (!selectedHostel) return;
    
    setIsLoading(true);
    try {
        const itemsResponse = await axios.get(`http://localhost:8080/hostels/${selectedHostel.ID}/items`);
        
        if (!itemsResponse.data || !Array.isArray(itemsResponse.data)) {
            console.warn("Invalid items response format");
            setMyListings([]);
            setIsLoading(false);
            return;
        }
        
        // Filter items by current user if userInfo is available
        const myItems = userInfo ? 
            itemsResponse.data.filter(item => item.UserID === userInfo.id) : 
            itemsResponse.data;
        
        setMyListings(myItems);
        setStats({
            totalItems: myItems.length,
            totalViews: myItems.reduce((sum, item) => sum + (item.Views || 0), 0),
            activeListings: myItems.filter(item => item.Status === 'approved').length
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to connect to the server. Please make sure the backend is running.");
        setMyListings([]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        if (!newItem.title || !newItem.description || !newItem.price) {
            throw new Error("Please fill in all required fields");
        }
        
        // Set the type based on the selected category
        const itemType = selectedCategory ? selectedCategory.name : 'sell';
        
        const itemData = {
            ...newItem,
            price: parseFloat(newItem.price),
            type: itemType  // Set the correct type
        };
        
        const response = await axios.post("http://localhost:8080/items", itemData);
        
        if (response.data) {
            toast.success("Item added successfully!");
            
            // Refresh the listings to show the new item
            fetchMyItems();
            
            // Reset form
            setIsAddingItem(false);
            setNewItem({
                title: '',
                description: '',
                price: '',
                image: '',
                type: 'sell'
            });
        }
    } catch (error) {
        console.error("Error uploading item:", error);
        toast.error(error.response?.data?.error || error.message || "Failed to add item. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setNewItem({
      ...newItem,
      type: category.name
    });
    setIsAddingItem(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server and get a URL
      // For this demo, we'll use a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      // Attempt to delete the item using an API call
      await axios.delete(`http://localhost:8080/items/${itemId}`);
      
      toast.success("Item deleted successfully!");
      
      // Refresh the listings
      fetchMyItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
      
      // Remove from UI even if API call fails (fallback for demo)
      setMyListings(prevListings => prevListings.filter(item => item.ID !== itemId));
      setStats(prevStats => ({
        ...prevStats,
        totalItems: prevStats.totalItems - 1,
        activeListings: prevStats.activeListings - 1
      }));
    }
  };

  const handleHostelChange = (hostelId) => {
    const hostel = hostels.find(h => h.ID === parseInt(hostelId));
    setSelectedHostel(hostel);
  };

  // Filter items based on search term
  const filteredItems = myListings.filter(item => 
    item.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 pt-28 pb-10 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mx-auto px-4 container">
        {/* Dashboard Header */}
        <div className="bg-white/20 shadow-sm backdrop-blur-md mb-8 p-6 border border-white/30 rounded-2xl">
          <div className="flex justify-between items-center">
            <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 font-bold text-transparent text-4xl">
              Seller Dashboard
            </h1>
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg px-6 py-3 rounded-xl text-white transition-all duration-300"
              disabled={isLoading}
            >
              <BiPlus className="text-xl" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-8">
          {[
            { label: "Total Items", value: stats.totalItems, icon: BiStore },
            { label: "Total Views", value: stats.totalViews, icon: FiEye },
            { label: "Active Listings", value: stats.activeListings, icon: BiLineChart }
          ].map((stat, index) => (
            <div key={index} className="bg-white/20 shadow-sm hover:shadow-md backdrop-blur-md p-6 border border-white/30 rounded-xl transition-all">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <stat.icon className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-gray-600">{stat.label}</h3>
                  <p className="font-bold text-gray-800 text-2xl">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/20 shadow-sm backdrop-blur-md mb-8 p-6 border border-white/30 rounded-2xl">
          <div className="flex md:flex-row flex-col justify-between items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <FiSearch className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Search your items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 pr-4 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 px-4 py-2 border border-gray-200 rounded-xl transition-colors">
                <BiFilterAlt className="text-blue-600" />
                <span>Filter</span>
              </button>
              <select 
                className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-200 rounded-xl transition-colors"
                defaultValue=""
              >
                <option value="" disabled>Sort By</option>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Selection Modal */}
        {isAddingItem && selectedCategory && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 shadow-xl mx-4 p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="mb-6 font-bold text-gray-800 text-2xl">
                {selectedCategory.name === "exchange" ? "List Item for Exchange" : "Sell an Item"}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-700">Item Title</label>
                    <input
                      type="text"
                      placeholder="What are you selling?"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">Description</label>
                    <textarea
                      placeholder="Describe your item in detail..."
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full h-32"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">
                      {selectedCategory.name === "exchange" ? "Estimated Value" : "Price"}
                    </label>
                    <input
                      type="number"
                      placeholder="Enter price in ₹"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">Upload Image</label>
                    <div className="p-4 border-2 border-gray-300 border-dashed rounded-xl text-center">
                      {newItem.image ? (
                        <div className="relative">
                          <img 
                            src={newItem.image} 
                            alt="Preview" 
                            className="mx-auto rounded max-h-48"
                          />
                          <button
                            type="button"
                            onClick={() => setNewItem({...newItem, image: ''})}
                            className="top-2 right-2 absolute bg-red-500 p-1 rounded-full text-white"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="image-upload"
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col justify-center items-center h-32 cursor-pointer"
                          >
                            <BiPlus className="mb-2 text-gray-400 text-3xl" />
                            <p className="text-gray-500">Click to upload image</p>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsAddingItem(false);
                      }}
                      className="hover:bg-gray-50 px-6 py-2 border border-gray-300 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-70 hover:shadow-md px-6 py-2 rounded-xl text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Uploading..." : "List Item"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Hostel Selection Dropdown */}
        <div className="bg-white/20 shadow-sm backdrop-blur-md mb-8 p-6 border border-white/30 rounded-2xl">
          <div className="flex md:flex-row flex-col items-start md:items-center gap-4">
            <label className="font-medium text-gray-700">Select Hostel:</label>
            <select
              className="p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              value={selectedHostel?.ID || ""}
              onChange={(e) => handleHostelChange(e.target.value)}
            >
              {hostels.map(hostel => (
                <option key={hostel.ID} value={hostel.ID}>{hostel.Name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Listing */}
        <div className="bg-white/20 shadow-sm backdrop-blur-md p-6 border border-white/30 rounded-2xl">
          <h2 className="mb-6 font-bold text-gray-800 text-xl">My Listings</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <FiArchive className="mx-auto mb-4 text-gray-400 text-5xl" />
              <p className="text-gray-500">You haven't listed any items yet.</p>
              <button
                onClick={() => setIsAddingItem(true)}
                className="bg-blue-600 hover:bg-blue-700 mt-4 px-6 py-2 rounded-xl text-white"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item.ID}
                  className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl overflow-hidden transition-all"
                >
                  <div className="relative">
                    {item.Image ? (
                      <img
                        src={item.Image}
                        alt={item.Title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="flex justify-center items-center bg-gray-100 w-full h-48">
                        <FiImage className="text-gray-400 text-4xl" />
                      </div>
                    )}
                    <div className="top-2 right-2 absolute bg-blue-500 px-2 py-1 rounded text-white text-xs">
                      {item.Type === 'sell' ? 'For Sale' : 'Exchange'}
                    </div>
                    {item.Status === 'pending' && (
                      <div className="top-2 left-2 absolute bg-yellow-500 px-2 py-1 rounded text-white text-xs">
                        Pending Approval
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-medium text-lg">{item.Title}</h3>
                    <p className="mb-2 text-gray-500 text-sm">
                      Listed on {formatDate(item.CreatedAt)}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-blue-600">₹{item.Price}</p>
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-gray-500 hover:text-blue-600"
                          onClick={() => {/* Edit functionality */}}
                        >
                          <BiEdit />
                        </button>
                        <button 
                          className="p-2 text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteItem(item.ID)}
                        >
                          <BiTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Seller;