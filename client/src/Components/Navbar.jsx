import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
      <div className="bg-white py-2 px-4 flex justify-end items-center">
        <div className="space-x-4">
          <a
            href="/signin"
            className="text-sm text-black font-bold hover:underline"
          >
            Sign In / Join AJIO
          </a>
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
      <div className="bg-white pt-2 pb-3 px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-1">
          <img
            src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
            alt="AJIO LUXE Logo"
            className="h-10 object-contain"
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
    </nav>
  );
};

export default Navbar;
