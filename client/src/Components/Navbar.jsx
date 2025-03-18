import React from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { BiMessageSquareDots } from 'react-icons/bi';
import { AiOutlineHeart } from 'react-icons/ai';
import { RiStore2Line } from 'react-icons/ri';

const Navbar = () => {
  return (
    <nav className="top-0 z-50 fixed bg-gradient-to-r from-sky-50/80 via-rose-50/80 to-amber-50/80 shadow-sm backdrop-blur-md border-white/40 border-b w-full h-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="flex justify-between items-center h-28">
          {/* Enhanced Logo Section */}
          <div className="flex items-center pl-4">

              <div className="relative flex justify-center items-center">
                {/* Outer glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-500/20 to-pink-500/20 blur-md group-hover:blur-lg rounded-full transition-all duration-300"></div>
                {/* Logo container with gradient border */}
                <div className="relative bg-white/10 backdrop-blur-sm px-1.5 border-2 border-white/30 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-1 rounded-full">
                    <img
                      src={logo}
                      alt="OpenExchange Logo"
                      className="rounded-full w-16 h-16 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 pb-1 font-bold text-transparent text-4xl tracking-wide animate-gradient-x">
                  OpenExchange
                </span>
                <span className="ml-1 text-gray-600 text-sm tracking-wider">
                  Exchange & Connect
                </span>
              </div>

          </div>

          {/* Navigation Links - Adjusted width for balance */}
          <div className="hidden md:flex flex-1 justify-center items-center px-8">
            <div className="flex justify-between space-x-12">
              {[
                { to: "/app/hostels", label: "Hostels" },
                { to: "/app/item-listings", label: "Items" },
                { to: "/community", label: "Community" },
                { 
                  to: "/app/sell", 
                  label: "Sell", 
                  icon: <RiStore2Line className="inline-block mr-1 text-xl" />
                },
                { 
                  to: "/app/chat", 
                  label: "Chat", 
                  icon: <BiMessageSquareDots className="inline-block mr-1 text-xl" />
                },
                { 
                  to: "/app/favorites", 
                  label: "Favorites", 
                  icon: <AiOutlineHeart className="inline-block mr-1 text-xl" />
                }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group relative flex items-center font-medium text-gray-700 hover:text-blue-600 text-base transition-colors duration-300"
                >
                  {link.icon}
                  {link.label}
                  <span className="-bottom-2 absolute inset-x-0 bg-gradient-to-r from-blue-600 to-purple-600 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 transform"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Section - Adjusted width */}
          <div className="flex justify-end">
            <div className="group relative">
              <button className="flex items-center space-x-3 bg-white/30 hover:bg-white/40 backdrop-blur-sm px-4 py-2 border border-white/40 rounded-full transition-all duration-300">
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-gray-800 text-sm">John Doe</span>
                  <span className="text-gray-600 text-xs">Student</span>
                </div>
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 rounded-full">
                  <img
                    src={logo}
                    alt="Profile"
                    className="border-2 border-white rounded-full w-10 h-10 object-cover"
                  />
                </div>
              </button>

              <div className="invisible group-hover:visible right-0 absolute bg-white/90 opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md mt-3 border border-white/40 rounded-xl w-56 scale-95 group-hover:scale-100 transition-all duration-300 transform">
                <div className="space-y-1 p-2">
                  <Link to="/profile" className="flex items-center space-x-3 hover:bg-blue-50 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 transition-colors">
                    <span className="font-medium text-sm">My Profile</span>
                  </Link>
                  <Link to="/settings" className="flex items-center space-x-3 hover:bg-blue-50 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 transition-colors">
                    <span className="font-medium text-sm">Settings</span>
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button className="flex items-center space-x-3 hover:bg-red-50 px-4 py-2 rounded-lg w-full text-red-600 text-left transition-colors">
                   <Link to={'/'}><span className="font-medium text-sm">Sign Out</span></Link>
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