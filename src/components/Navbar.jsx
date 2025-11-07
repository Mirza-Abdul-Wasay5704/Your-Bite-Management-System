import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '/logo.png';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="bg-secondary text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform flex-shrink-0">
              <img 
                src={logo}
                alt="Your Bite logo"
                className="h-16 sm:h-19 w-auto"
                loading="eager"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-primary leading-tight">Your Bite</h1>
                <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">Where Every Bite Feels Right</p>
              </div>
            </Link>

            {/* Navigation Links - Responsive */}
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
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
              <Link
                to="/customers"
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive('/customers') 
                    ? 'bg-primary text-secondary font-semibold shadow-md' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span className="text-base sm:text-xl">👥</span>
                <span className="text-xs sm:text-base">Customers</span>
              </Link>
              
              {/* Logout Button */}
              <button
                onClick={handleLogoutClick}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md ml-2"
                title="Logout"
              >
                <span className="text-base sm:text-xl">🚪</span>
                <span className="text-xs sm:text-base">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full border-2 border-primary">
            <h3 className="text-xl font-bold text-secondary mb-4">Confirm Logout</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to logout?</p>
            <div className="flex space-x-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-secondary font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
