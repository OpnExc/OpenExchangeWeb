import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import HostelLogo from '../../assets/HostelLogo.png';
import LoginPopup from '../pages/LoginPopup';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';

const ALL_HOSTELS_ID = 'all';

const Navbar = () => {
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const navigate = useNavigate();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [username, setUsername] = useState(''); 
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showHostelDropdown, setShowHostelDropdown] = useState(false);
  const [currentHostel, setCurrentHostel] = useState(1);
  const [hostels, setHostels] = useState([]);
  const [isLoadingHostels, setIsLoadingHostels] = useState(true);
  const hostelDropdownRef = useRef(null);

  // Fetch hostels from API
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setIsLoadingHostels(true);
        const response = await axios.get('http://localhost:8080/hostels');
        if (Array.isArray(response.data)) {
          setHostels(response.data);
        } else {
          console.error('Expected array of hostels but got:', response.data);
          setHostels([]);
        }
      } catch (error) {
        console.error('Error fetching hostels:', error);
        setHostels([]);
      } finally {
        setIsLoadingHostels(false);
      }
    };

    fetchHostels();
  }, []);

  const handleLogout = () => {
    try {
      // Remove both types of tokens from localStorage
      localStorage.removeItem('google');
      localStorage.removeItem('jwt');
      // Reset user state
      setIsLoggedIn(false);
      setUsername('');
      setShowDropdown(false);
      window.location.href = "/app/home";
      // Dispatch auth change event
      window.dispatchEvent(new Event('authStateChanged'));
      
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleNavigation = (path) => {
    setShowDropdown(false); // Close dropdown
    navigate(path);
  };

  const handleHostelChange = (hostelId) => {
    console.log(`Changing hostel from ${currentHostel} to ${hostelId}`);
    
    // Only proceed if actually changing to a different hostel
    if (hostelId === currentHostel) {
      console.log("Same hostel selected, no change needed");
      setShowHostelDropdown(false);
      return;
    }
    
    // Update state first
    setCurrentHostel(hostelId);
    setShowHostelDropdown(false); // Close the dropdown
    
    // Save to localStorage
    localStorage.setItem('selectedHostel', hostelId);
    console.log("Saved hostel ID to localStorage:", hostelId);
    
    // Fetch items for the selected hostel
    fetchItemsForHostel(hostelId);
  };
  
  const fetchItemsForHostel = (hostelId) => {
    console.log("Fetching items for hostel:", hostelId);
    
    // Choose endpoint based on whether we want all hostels or a specific one
    const endpoint = hostelId === ALL_HOSTELS_ID 
      ? 'http://localhost:8080/items/all'  // New endpoint for all items
      : `http://localhost:8080/hostels/${hostelId}/items`;
      
    // Make API request
    axios.get(endpoint)
      .then(response => {
        console.log(`Got ${response.data.length} items${hostelId === ALL_HOSTELS_ID ? ' from all hostels' : ` for hostel ${hostelId}`}`);
        
        const items = Array.isArray(response.data) ? response.data : [];
        handleSearch(items, searchQuery);
        
        // Force page reload or navigate
        if (window.location.pathname === '/app/home') {
          console.log("Already on home page, reloading to show new items");
          window.location.reload();
        } else {
          console.log("Navigating to home page");
          navigate('/app/home');
        }
      })
      .catch(error => {
        console.error(`Error fetching items${hostelId === ALL_HOSTELS_ID ? ' from all hostels' : ` for hostel ${hostelId}`}:`, error);
        alert(`Failed to load items${hostelId === ALL_HOSTELS_ID ? ' from all hostels' : ` for the selected hostel`}. Please try again.`);
      });
  };
  
  // Load saved hostel from localStorage on component mount
  useEffect(() => {
    const savedHostel = localStorage.getItem('selectedHostel');
    if (savedHostel) {
      setCurrentHostel(Number(savedHostel));
    }
  }, []);

  useEffect(() => {
    const updateUserState = async () => {
      const temp = localStorage.getItem('google');
      const google = JSON.parse(temp);
      const temp2 = localStorage.getItem('jwt');
      const temp3 = JSON.parse(temp2);
    

      // Reset state if no tokens found
      if (google==null && temp3==null) {
        setUsername('');
        setIsLoggedIn(false);
        return;
      }

      if (google !== null) {
        console.log("Using Google auth");
        try {
          const response = await axios.get('http://localhost:8080/user', { 
            headers: {
              'Authorization': `${google.token}`
            }
          });
          if (response.data) {
            setUsername(response.data.name);
            setIsLoggedIn(true);
          } else {
            setUsername('');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error fetching Google user data:', error);
          setUsername('');
          setIsLoggedIn(false);
          localStorage.removeItem('google');
        }
      }

      if (temp3 !== null) {
        console.log("Using JWT auth");
        const jwt = (temp3.token);
        try {
          const response = await axios.get('http://localhost:8080/user', { 
            headers: {
              'Authorization': `${jwt.token}` 
            }
          });
          console.log("This is JWT : ",response.data);
          if (response.data) {
            setUsername(response.data.name);
            setIsLoggedIn(true);
          } else {
            setUsername('');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error fetching JWT user data:', error);
          setUsername('');
          setIsLoggedIn(false);
          localStorage.removeItem('jwt');
        }
      }
    };

    // Initial check
    updateUserState();

    // Listen for storage changes
    window.addEventListener('storage', updateUserState);
    
    // Listen for auth state changes
    const handleAuthChange = () => updateUserState();
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', updateUserState);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle user dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // Handle hostel dropdown separately
      if (hostelDropdownRef.current && !hostelDropdownRef.current.contains(event.target)) {
        setShowHostelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update the executeSearch function
const executeSearch = () => {
  // Get the current selected hostel from localStorage
  const selectedHostelId = localStorage.getItem('selectedHostel') || 1;
  
  // Choose endpoint based on whether we want all hostels or a specific one
  const endpoint = selectedHostelId === ALL_HOSTELS_ID 
    ? 'http://localhost:8080/items/all'  // Endpoint for all items
    : `http://localhost:8080/hostels/${selectedHostelId}/items`;
    
  // Fetch items for the current hostel and perform search
  axios.get(endpoint)
    .then(response => {
      const items = Array.isArray(response.data) ? response.data : [];
      console.log(`Got ${items.length} items for search query: "${searchQuery}"`);
      handleSearch(items, searchQuery);
      navigate('/app/home');
    })
    .catch(error => console.error('Error fetching items for search:', error));
};

  // Instead of just strings, each item is now an object with `label` and `path`.
  const categories = [
    { label: 'SELL', path: '/app/sell' },
    { label: 'CART', path: '/app/orders/history' },
    { label: 'HOME', path: '/app/home' },
    { label: 'MY INVENTORY', path: '/app/listitem?tab=inventory' },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-white pt-2 px-4 flex justify-end items-center">
        <div className="space-x-4">
          {isLoggedIn ? (
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <button 
                className="text-sm text-black font-bold px-4 py-2 inline-flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                <span className="mr-2">Hello, {username}</span>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showDropdown && (
                <div 
                  className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  style={{ minWidth: '200px' }}
                >
                  {/* User Details Section */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">{username}</div>
                    <div className="text-xs text-gray-500 truncate">User ID: #123456</div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => handleNavigation('/app/userdetails')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </button>
                  
                   
                    <Link
                      to="/app/buyrequests"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Buy Requests
                    </Link>

                    <div className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-700 hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginPopup(true)}
              className="text-sm text-black font-bold hover:underline"
            >
              Sign In / Join 
            </button>
          )}
          <Link
            to="/app/connect"
            className="text-sm font-bold text-black p-3 hover:underline"
          >
            Customer Care
          </Link>
          <Link
            to="/app/sell"
            className="text-sm px-6 p-3 font-bold bg-[#EBF8FA] text-black hover:underline"
          >
            Sell Item  
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white  px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="pr-1.5">
          <img
            src={HostelLogo}
            alt="Logo"
            className="h-16 pb-1 object-contain"
          />
        </div>
        <div className="flex-1">
          <img
            src={Logo}
            alt="Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Search Bar and Utility Icons Container */}
        <div className="flex items-center">
          {/* Search Bar */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search Hostel Hustle"
              className="border-2 border-black px-4 h-8 w-60 rounded-none focus:rounded-none focus:outline-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  executeSearch();
                }
              }}
            />
            <button 
              className="bg-black text-white px-4 h-8"
              onClick={executeSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z"
                />
              </svg>
            </button>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center space-x-4 ml-4">
            {/* Favorites Icon */}
          

            {/* Cart Icon */}
            <button 
              className="text-gray-700 hover:text-black"
              onClick={() => navigate('/app/orders/history')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-black py-1 px-4 flex justify-center items-center space-x-12 text-md-center">
        {categories.map((cat, index) => (
          <React.Fragment key={cat.label}>
            {index > 0 && <span className="text-white text-xs">|</span>}
            <a
              href={cat.path}
              className="text-white hover:text-gray-300 hover:font-semibold transition-colors"
            >
              {cat.label}
            </a>
          </React.Fragment>
        ))}

        {/* Add the standing bar before the hostel dropdown */}
        <span className="text-white text-xs">|</span>

        {/* Hostel Dropdown */}
        <div className="relative" ref={hostelDropdownRef}>
          <button
            className="text-white font-medium text-sm pl-1.5 py-2 uppercase hover:text-gray-300 transition-colors flex items-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowHostelDropdown(!showHostelDropdown);
              console.log("Dropdown toggled:", !showHostelDropdown);
            }}
          >
            <span>
              {isLoadingHostels ? "Loading..." : 
                (hostels.length > 0 ? 
                  hostels.find(h => h.ID === currentHostel)?.Name || 'Select Hostel' : 
                  'No Hostels')}
            </span>
            <span className="ml-2">▼</span>
          </button>
          
          {showHostelDropdown && (
            <div 
              className="absolute left-0 mt-0.5 w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoadingHostels ? (
                <div className="p-4 text-center text-gray-600">Loading hostels...</div>
              ) : hostels.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 p-2 max-h-80 overflow-y-auto">
                  {/* All Hostels Option - Add this at the top */}
                  <div 
                    key="all-hostels" 
                    className={`bg-gray-100 border rounded-lg shadow-sm p-3 cursor-pointer hover:bg-gray-200 ${
                      currentHostel === ALL_HOSTELS_ID ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Selecting all hostels");
                      handleHostelChange(ALL_HOSTELS_ID);
                    }}
                  >
                    <h3 className="text-md font-semibold text-gray-800">All Hostels</h3>
                    <p className="text-gray-400 text-xs mt-1">
                      View items from all hostels
                    </p>
                  </div>
                  
                  {/* Separator */}
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  {/* Individual Hostels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {hostels.map((hostel) => (
                      <div 
                        key={hostel.ID} 
                        className={`bg-white border rounded-lg shadow-sm p-3 cursor-pointer hover:bg-gray-100 ${
                          currentHostel === hostel.ID ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Selecting hostel:", hostel.ID);
                          handleHostelChange(hostel.ID);
                        }}
                      >
                        <h3 className="text-md font-semibold text-gray-800">{hostel.Name}</h3>
                        
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-600">No hostels available</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}
    </nav>
  );
};

export default Navbar;
