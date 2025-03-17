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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalViews: 0,
    activeListings: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    type: ''
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

  // Fetch items when component mounts or userInfo changes
  useEffect(() => {
    fetchMyItems();
    
    // Set up an interval to update views in real-time (simulated)
    const intervalId = setInterval(() => {
      setStats(prevStats => ({
        ...prevStats,
        totalViews: prevStats.totalViews + Math.floor(Math.random() * 3)
      }));
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [userInfo]); // Added userInfo dependency

  const fetchMyItems = async () => {
    setIsLoading(true);
    try {
        // Simplified approach - just try to fetch hostels
        const userResponse = await axios.get('http://localhost:8080/hostels');
        
        if (!userResponse.data || !Array.isArray(userResponse.data) || userResponse.data.length === 0) {
            console.warn("No hostels found in response");
            setMyListings([]);
            setIsLoading(false);
            return;
        }
        
        const hostelId = userResponse.data[0].ID;
        const itemsResponse = await axios.get(`http://localhost:8080/hostels/${hostelId}/items`);
        
        if (!itemsResponse.data || !Array.isArray(itemsResponse.data)) {
            console.warn("Invalid items response format");
            setMyListings([]);
            setIsLoading(false);
            return;
        }
        
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
            setMyListings(prevListings => [response.data, ...prevListings]);
            setStats(prevStats => ({
                ...prevStats,
                totalItems: prevStats.totalItems + 1,
                activeListings: prevStats.activeListings + (response.data.Status === 'approved' ? 1 : 0)
            }));
            
            // Reset form
            setIsAddingItem(false);
            setSelectedCategory(null);
            setNewItem({
                title: '',
                description: '',
                price: '',
                image: '',
                type: ''
            });
        }
    } catch (error) {
        console.error("Error uploading item:", error);
        toast.error(error.message || "Failed to add item. Please try again.");
    } finally {
        setIsLoading(false);
    }
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
      // For now, we'll just remove it from the UI since we don't have a delete endpoint
      toast.info("Deleting item...");
      
      // Remove from UI
      setMyListings(prevListings => prevListings.filter(item => item.ID !== itemId));
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalItems: prevStats.totalItems - 1,
        activeListings: prevStats.activeListings - 1 // Assuming the item was active
      }));
      
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
    }
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

        {/* Item Form Modal */}
        {isAddingItem && selectedCategory && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 shadow-xl mx-4 p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="mb-6 font-bold text-gray-800 text-2xl">
                Add {selectedCategory.label || selectedCategory.name} Item
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Item Photo</label>
                  <div 
                    onClick={() => document.getElementById('imageUpload').click()}
                    className="hover:bg-gray-50 p-8 border-2 border-gray-300 border-dashed rounded-xl text-center transition-colors cursor-pointer"
                  >
                    {newItem.image ? (
                      <img
                        src={newItem.image}
                        alt="Preview"
                        className="shadow-sm mx-auto rounded-lg max-h-48"
                      />
                    ) : (
                      <div>
                        <BiPlus className="mx-auto mb-2 text-gray-400 text-4xl" />
                        <p className="text-gray-500">Click to upload photo</p>
                        <p className="mt-1 text-gray-400 text-sm">High-quality images get more attention</p>
                      </div>
                    )}
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Item Name</label>
                    <input
                      required
                      type="text"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                      placeholder="e.g. Study Table"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Price (₹)</label>
                    <input
                      required
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                      placeholder="e.g. 1200"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                    rows="4"
                    placeholder="Describe your item in detail - condition, features, reason for selling..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingItem(false);
                      setSelectedCategory(null);
                      setNewItem({
                        title: '',
                        description: '',
                        price: '',
                        image: '',
                        type: ''
                      });
                    }}
                    className="bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-xl text-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg px-8 py-3 rounded-xl text-white transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* My Listings Section - Improved with better handling of item display */}
        <div className="bg-white/20 shadow-sm backdrop-blur-md p-6 border border-white/30 rounded-2xl">
          <h2 className="mb-6 font-bold text-gray-800 text-2xl">My Listings</h2>
          
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="flex justify-center items-center">
                <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-500">Loading your items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-10 text-center">
              {searchTerm ? (
                <p className="text-gray-500">No items match your search criteria.</p>
              ) : (
                <>
                  <p className="text-gray-500">You haven't listed any items yet.</p>
                  <button
                    onClick={() => setIsAddingItem(true)}
                    className="bg-blue-100 hover:bg-blue-200 mt-4 px-6 py-2 rounded-xl text-blue-700 transition-colors"
                  >
                    Add Your First Item
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left">Item</th>
                    <th className="pb-3 text-left">Price</th>
                    <th className="pb-3 text-left">Date Listed</th>
                    <th className="pb-3 text-left">Status</th>
                    <th className="pb-3 text-left">Views</th>
                    <th className="pb-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.ID} className="hover:bg-white/30 border-b">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          {item.Image ? (
                            <img
                              src={item.Image}
                              alt={item.Title}
                              className="rounded-lg w-12 h-12 object-cover"
                            />
                          ) : (
                            <div className="flex justify-center items-center bg-gray-100 rounded-lg w-12 h-12">
                              <BiStore className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-800">{item.Title || "Untitled Item"}</h3>
                            <p className="text-gray-500 text-sm">{item.Type || 'Item'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">₹{item.Price || 0}</td>
                      <td className="py-4">{formatDate(item.CreatedAt)}</td>
                      <td className="py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.Status === 'approved' ? 'bg-green-100 text-green-800' :
                          item.Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.Status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4">{item.Views || 0}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toast.info("Edit functionality would be implemented here")}
                            className="hover:bg-gray-100 p-2 rounded-lg text-gray-600 transition-colors"
                            title="Edit item"
                          >
                            <BiEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.ID)}
                            className="hover:bg-red-50 p-2 rounded-lg text-red-600 transition-colors"
                            title="Delete item"
                          >
                            <BiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Enhanced Analytics Section */}
        <div className="bg-white/20 shadow-sm backdrop-blur-md mt-8 p-6 border border-white/30 rounded-2xl">
          <h2 className="mb-6 font-bold text-gray-800 text-2xl">Performance Analytics</h2>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
            <div className="bg-white shadow-sm p-4 rounded-xl">
              <h3 className="mb-2 font-semibold">Most Viewed Items</h3>
              {myListings.length > 0 ? (
                <div className="space-y-4">
                  {myListings
                    .sort((a, b) => (b.Views || 0) - (a.Views || 0))
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.ID} className="flex justify-between items-center hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          {item.Image ? (
                            <img src={item.Image} alt={item.Title} className="rounded w-10 h-10 object-cover" />
                          ) : (
                            <div className="flex justify-center items-center bg-gray-100 rounded w-10 h-10">
                              <BiStore className="text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium">{item.Title || "Untitled Item"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiEye className="text-blue-500" />
                          <span>{item.Views || 0}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-48">
                  <p className="text-gray-500">No items to display</p>
                </div>
              )}
            </div>
            <div className="bg-white shadow-sm p-4 rounded-xl">
              <h3 className="mb-2 font-semibold">Sales by Category</h3>
              {myListings.length > 0 ? (
                <div className="py-4">
                  {/* Simple bar chart visualization */}
                  {Object.entries(
                    myListings.reduce((acc, item) => {
                      const category = item.Type || 'Uncategorized';
                      acc[category] = (acc[category] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([category, count], index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">{category}</span>
                        <span className="text-gray-600 text-sm">{count} items</span>
                      </div>
                      <div className="bg-gray-200 rounded-full w-full h-2.5">
                        <div 
                          className="bg-blue-600 rounded-full h-2.5" 
                          style={{ width: `${(count / myListings.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-48">
                  <p className="text-gray-500">No items to display</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* New Hostel Selection Section */}
        <div className="bg-white/20 shadow-sm backdrop-blur-md mt-8 p-6 border border-white/30 rounded-2xl">
          <h2 className="mb-6 font-bold text-gray-800 text-2xl">My Hostel</h2>
          <div className="bg-white shadow-sm p-6 rounded-xl">
            <h3 className="mb-4 font-semibold">Connected Hostel</h3>
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center bg-blue-50 p-4 border border-blue-100 rounded-xl">
              <div>
                <p className="font-medium text-lg">Current Hostel</p>
                <p className="text-gray-600">Your items are visible to students in this hostel</p>
              </div>
              <button className="bg-blue-100 hover:bg-blue-200 mt-4 md:mt-0 px-4 py-2 rounded-lg text-blue-700 transition-colors">
                Change Hostel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;