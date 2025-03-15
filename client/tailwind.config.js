module.exports = {
  theme: {
    extend: {
      maxWidth: {
        '3xl': '48rem',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'glow': {
          'from': {
            'box-shadow': '0 0 20px rgba(79,70,229,0.1)'
          },
          'to': {
            'box-shadow': '0 0 30px rgba(79,70,229,0.4)'
          }
        },
        'blob': {
          '0%': {
            'transform': 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            'transform': 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            'transform': 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            'transform': 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
}

import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-sky-50/80 via-rose-50/80 to-amber-50/80 shadow-sm backdrop-blur-md border-white/40 border-b w-full">
      <div className="container mx-auto px-4 sm:px-12 lg:px-16 max-w-[1400px]">
        <div className="flex justify-between items-center h-28">
          {/* Left-aligned Logo Section */}
          <div className="flex items-center w-1/4">
            <Link to="/" className="group flex items-center space-x-8">
              <img src="../../assets/logo.png" alt="OpenExchange Logo" className="w-20 h-20 object-contain group-hover:scale-105 transition-transform duration-300" />
              <span className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 font-bold text-transparent text-4xl animate-gradient-x tracking-wide">
                OpenExchange
              </span>
            </Link>
          </div>
          <span className="text-gray-600 text-sm tracking-wider ml-1">
          </span>
          <div className="hidden md:flex justify-center items-center w-2/4">
            <div className="flex space-x-16">
              {[
                { to: "/hostel-selection", label: "Hostels" },
                { to: "/item-listings", label: "Items" },
                { to: "/community", label: "Community" }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group relative font-medium text-gray-700 hover:text-blue-600 text-xl transition-colors duration-300"
                >
                  {link.label}
                  <span className="-bottom-2 absolute inset-x-0 bg-gradient-to-r from-blue-600 to-purple-600 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 transform"></span>
                </Link>
              ))}
            </div>
          </div>
          {/* User Profile Section - Rightmost */}
          <div className="flex justify-end w-1/4">
            <div className="group relative">
              <button className="flex items-center space-x-5 bg-white/30 hover:bg-white/40 backdrop-blur-sm px-6 py-3 border border-white/40 rounded-full transition-all duration-300">
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-gray-800 text-lg">John Doe</span>
                  <span className="text-gray-600 text-base">Student</span>
                </div>
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 rounded-full">
                  <img
                    src={image}
                    alt="Profile"
                    className="border-2 border-white rounded-full w-14 h-14 object-cover"
                  />
                </div>
              </button>
              {/* Dropdown Menu */}
              <div className="group-hover:visible invisible right-0 absolute bg-white/90 opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md mt-3 border border-white/40 rounded-xl w-64 scale-95 group-hover:scale-100 transition-all duration-300 transform">
                <div className="space-y-2 p-3">
                  <Link to="/profile" className="flex items-center space-x-3 hover:bg-blue-50 px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 transition-colors">
                    <span className="font-medium text-base">My Profile</span>
                  </Link>
                  <Link to="/settings" className="flex items-center space-x-3 hover:bg-blue-50 px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 transition-colors">
                    <span className="font-medium text-base">Settings</span>
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button className="flex items-center space-x-3 hover:bg-red-50 px-4 py-3 rounded-lg w-full text-red-600 text-left transition-colors">
                    <span className="font-medium text-base">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
