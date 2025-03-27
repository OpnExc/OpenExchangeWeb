import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import LoginPopup from '../pages/LoginPopup';  // Add this import

const Navbar = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [username, setUsername] = useState(''); 
  const [showDropdown, setShowDropdown] = useState(false);

  // Modified useEffect for initial load and storage changes
  useEffect(() => {
    const updateUserState = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.user) {
          setUsername(user.user.name || '');
          setIsLoggedIn(true);
        } else {
          setUsername('');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUsername('');
        setIsLoggedIn(false);
      }
    };

    // Initial check
    updateUserState();

    // Listen for storage changes
    window.addEventListener('storage', updateUserState);
    
    // Listen for custom event for Google login
    const handleAuthChange = () => updateUserState();
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', updateUserState);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    setShowDropdown(false);
  };

  // Instead of just strings, each item is now an object with `label` and `path`.
  const categories = [
    { label: 'MEN', path: '/men' },
    { label: 'WOMEN', path: '/women' },
    { label: 'HOME', path: '/app/home' },
    { label: 'BEAUTY BY TIRA', path: '/beauty-by-tira' },
    { label: 'THE EDIT', path: '/the-edit' },
    { label: 'BRANDS', path: '/brands' },
  ];

  return (
    <nav className="w-full">
      {/* Top Utility Bar */}
      <div className="bg-white pt-2 px-4 flex justify-end items-center">
        <div className="space-x-4">
          {isLoggedIn ? (
            <div className="relative inline-block text-left">
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
                  style={{ minWidth: '150px' }}
                >
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
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
          <a
            href="/customer-care"
            className="text-sm font-bold text-black p-3 hover:underline"
          >
            Customer Care
          </a>
          <Link
            to="/app/sell"
            className="text-sm p-4 font-bold bg-[#EBF8FA] text-black"
          >
            Sell on AJIO
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white  px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-1">
          <img
            src={Logo}
            alt="AJIO LUXE Logo"
            className="h-20 object-contain"
          />
        </div>

        {/* Search Bar and Utility Icons Container */}
        <div className="flex items-center">
          {/* Search Bar */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search Luxe Store"
              className="border-2 border-black px-4 h-8 w-60 rounded-none focus:rounded-none focus:outline-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-black text-white px-4 h-8">
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
                  d="M21 21l-6-6m2-5a7 7 0 1114 0 7 7 0 01-14 0z"
                />
              </svg>
            </button>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center space-x-4 ml-4">
            <button className="text-gray-700 hover:text-black">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="text-gray-700 hover:text-black">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-black py-3 px-4 flex justify-center items-center space-x-12 text-md-center">
        {categories.map((cat, index) => (
          <React.Fragment key={cat.label}>
            {index > 0 && <span className="text-white text-xs">|</span>}
            <Link
              to={cat.path}
              className="text-white hover:text-gray-300 hover:font-semibold transition-colors"
            >
              {cat.label}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}
    </nav>
  );
};

export default Navbar;
