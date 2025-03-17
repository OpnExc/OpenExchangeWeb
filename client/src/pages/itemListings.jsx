import React, { useState, useEffect } from 'react';
import { BiSearch, BiFilterAlt } from 'react-icons/bi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FiMapPin, FiTag, FiUser, FiClock } from 'react-icons/fi';
import axios from 'axios';

const ItemListings = () => {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [conditions, setConditions] = useState({
    'New': false,
    'Like New': false,
    'Excellent': false,
    'Good': false,
    'Fair': false
  });

  useEffect(() => {
    // Fetch hostels from API
    const fetchHostels = async () => {
      try {
        const response = await axios.get('http://localhost:8080/hostels', {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        setHostels(response.data);
        if (response.data.length > 0) {
          setSelectedHostel(response.data[0].ID);
        }
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, []);

  useEffect(() => {
    // Fetch items when hostel changes
    const fetchItems = async () => {
      if (!selectedHostel) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/hostels/${selectedHostel}/items`, {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedHostel]);

  const toggleFavorite = (itemId) => {
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter(id => id !== itemId));
    } else {
      setFavorites([...favorites, itemId]);
    }
  };

  const handleHostelChange = (e) => {
    setSelectedHostel(parseInt(e.target.value));
  };

  const filteredItems = items.filter(item => {
    // Filter by search term
    const matchesSearch = item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.Description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by price range
    const price = typeof item.Price === 'string' ? 
      parseFloat(item.Price.replace(/[^\d.]/g, '')) : 
      item.Price || 0;
    
    const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
    
    // Filter by condition
    const conditionFilters = Object.entries(conditions).filter(([_, isSelected]) => isSelected);
    const matchesCondition = conditionFilters.length === 0 || 
      (item.Condition && conditionFilters.some(([condition, _]) => item.Condition === condition));
    
    return matchesSearch && inPriceRange && matchesCondition;
  });

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="relative bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 pt-24 min-h-screen">
      {/* Header with Hostel Selection */}
      <div className="top-0 z-10 sticky bg-white/70 backdrop-blur-lg py-4 border-gray-200 border-b">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-4 mx-auto px-4 container">
          <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 font-bold text-transparent text-2xl">
            Campus Marketplace
          </h1>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="py-2 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-400 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <BiSearch className="top-2.5 left-3 absolute text-gray-400 text-xl" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedHostel || ''}
                onChange={handleHostelChange}
                className="bg-white/90 py-2 pr-10 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              >
                {hostels.map(hostel => (
                  <option key={hostel.ID} value={hostel.ID}>
                    {hostel.Name}
                  </option>
                ))}
              </select>
              <div className="right-0 absolute inset-y-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="bg-white/90 hover:bg-gray-100 p-2 border border-gray-300 rounded-lg transition-colors"
            >
              <BiFilterAlt className="text-gray-700 text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white/90 shadow-lg backdrop-blur-md mx-auto mt-2 px-4 py-4 border border-gray-200 rounded-xl container">
          <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-medium">Price Range</h3>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="50000" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <span className="text-gray-700 text-sm">₹0 - ₹{priceRange[1]}</span>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 font-medium">Condition</h3>
              <div className="gap-2 grid grid-cols-2">
                {Object.keys(conditions).map(condition => (
                  <label key={condition} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={conditions[condition]}
                      onChange={() => setConditions({
                        ...conditions,
                        [condition]: !conditions[condition]
                      })}
                      className="rounded focus:ring-blue-400 text-blue-500"
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={() => {
                  setPriceRange([0, 50000]);
                  setConditions({
                    'New': false,
                    'Like New': false,
                    'Excellent': false,
                    'Good': false,
                    'Fair': false
                  });
                  setSearchTerm('');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Reset all filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto px-4 py-8 container">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="border-b-2 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white/30 backdrop-blur-md p-12 border border-white/50 rounded-xl text-center">
            <h3 className="mb-2 font-medium text-gray-700 text-xl">No items found</h3>
            <p className="text-gray-500">Try changing your filters or search terms</p>
          </div>
        ) : (
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <div 
                key={item.ID || item.id}
                className="group bg-white/20 hover:bg-white/40 hover:shadow-xl backdrop-blur-md border border-white/30 rounded-xl overflow-hidden transition-all hover:-translate-y-1 duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  {item.Image ? (
                    <img
                      src={item.Image}
                      alt={item.Title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full">
                      <span className="text-gray-400 text-lg">No image</span>
                    </div>
                  )}
                  
                  <button 
                    className="top-3 right-3 absolute bg-white/80 hover:bg-white p-2 rounded-full transition-colors duration-300"
                    onClick={() => toggleFavorite(item.ID || item.id)}
                  >
                    {favorites.includes(item.ID || item.id) ? (
                      <AiFillHeart className="text-red-500 text-xl" />
                    ) : (
                      <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-xl" />
                    )}
                  </button>
                  
                  {item.Type && (
                    <span className="bottom-3 left-3 absolute bg-blue-600/90 px-3 py-1 rounded-full text-white text-xs">
                      {item.Type === "sell" ? "For Sale" : "For Exchange"}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{item.Title}</h3>
                    {item.Price !== undefined && (
                      <span className="font-bold text-blue-600">
                        ₹{typeof item.Price === 'number' ? item.Price.toLocaleString() : item.Price}
                      </span>
                    )}
                  </div>
                  
                  {item.Description && (
                    <p className="mb-3 text-gray-600 text-sm line-clamp-2">{item.Description}</p>
                  )}
                  
                  <div className="space-y-1.5">
                    {item.Condition && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <FiTag className="mr-1.5" />
                        <span>Condition: {item.Condition}</span>
                      </div>
                    )}
                    
                    {item.seller && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <FiUser className="mr-1.5" />
                        <span>{item.seller}</span>
                      </div>
                    )}
                    
                    {item.hostel && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <FiMapPin className="mr-1.5" />
                        <span>{item.hostel}</span>
                      </div>
                    )}
                    
                    {item.CreatedAt && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <FiClock className="mr-1.5" />
                        <span>{formatTimeAgo(item.CreatedAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 hover:shadow-md mt-4 py-2 rounded-lg w-full font-medium text-white transition-all duration-300">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Floating Action Button */}
      <button className="right-6 bottom-6 fixed flex justify-center items-center bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl rounded-full w-14 h-14 text-white text-2xl hover:scale-105 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default ItemListings;