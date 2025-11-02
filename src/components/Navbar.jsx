import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '/logo.png';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-secondary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform flex-shrink-0">
            <img 
              src={logo}
              alt="Your Bite logo"
              className="h-12 sm:h-16 w-auto"
              loading="eager"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-primary leading-tight">Your Bite</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">Where Every Bite Feels Right</p>
            </div>
          </Link>

          {/* Navigation Links - Responsive */}
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            <Link
              to="/"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/') 
                  ? 'bg-primary text-secondary font-semibold shadow-md' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className="text-base sm:text-xl">🏠</span>
              <span className="text-xs sm:text-base">Menu</span>
            </Link>
            <Link
              to="/orders"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/orders') 
                  ? 'bg-primary text-secondary font-semibold shadow-md' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className="text-base sm:text-xl">🛒</span>
              <span className="text-xs sm:text-base">Order</span>
            </Link>
            <Link
              to="/kitchen"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/kitchen') 
                  ? 'bg-primary text-secondary font-semibold shadow-md' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className="text-base sm:text-xl">📦</span>
              <span className="text-xs sm:text-base">Kitchen</span>
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/dashboard') 
                  ? 'bg-primary text-secondary font-semibold shadow-md' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className="text-base sm:text-xl">📊</span>
              <span className="text-xs sm:text-base">Stats</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
