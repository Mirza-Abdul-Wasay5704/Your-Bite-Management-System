import React, { useState, useEffect } from 'react';

const OrderCart = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemove, 
  onPlaceOrder, 
  isOpen, 
  onToggle, 
  isPlacing = false
}) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [change, setChange] = useState(0);

  // Calculate change whenever received amount or total changes
  useEffect(() => {
    const received = parseFloat(receivedAmount) || 0;
    const calculatedChange = received - total;
    setChange(calculatedChange >= 0 ? calculatedChange : 0);
  }, [receivedAmount, total]);

  // Reset received amount when cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setReceivedAmount('');
      setChange(0);
    }
  }, [cartItems.length]);

  return (
    <>
      {/* Mobile/Tablet Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-4 right-4 bg-secondary text-primary p-3 sm:p-4 rounded-full shadow-lg z-40 hover:scale-110 transition-transform active:scale-95 border-2 border-primary"
      >
        <span className="text-xl sm:text-2xl">🛒</span>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-secondary w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 border-secondary">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40"
          onClick={onToggle}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed lg:sticky top-0 lg:top-16 right-0 h-screen lg:h-[calc(100vh-4rem)] w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 border-l-4 border-primary ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="bg-secondary text-primary p-3 sm:p-4 flex items-center justify-between border-b-2 border-primary flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold">Current Order</h2>
          <button onClick={onToggle} className="lg:hidden text-xl sm:text-2xl active:scale-90 transition-transform hover:text-accent">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-0">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-3xl sm:text-4xl mb-2">🛒</p>
              <p className="text-sm sm:text-base">No items added yet</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="bg-background rounded-lg p-2 sm:p-3 shadow border border-gray-200 hover:border-primary transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-secondary text-sm sm:text-base flex-1 min-w-0 pr-2">{item.name}</h3>
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-600 hover:text-red-800 font-bold flex-shrink-0 active:scale-90 transition-all"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      className="bg-secondary text-primary w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-800 active:scale-90 transition-all text-sm sm:text-base font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold w-6 sm:w-8 text-center text-sm sm:text-base text-secondary">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="bg-secondary text-primary w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-800 active:scale-90 transition-all text-sm sm:text-base font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-secondary text-sm sm:text-base">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t-2 border-primary p-3 sm:p-4 bg-background space-y-2.5 flex-shrink-0">
          {/* Total Amount - Prominent */}
          <div className="bg-primary rounded-lg p-2.5 sm:p-3 shadow-md border border-secondary">
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg font-bold text-secondary">Total Amount:</span>
              <span className="text-xl sm:text-2xl font-bold text-secondary">Rs. {total}</span>
            </div>
          </div>

          {/* Received Amount Input */}
          {cartItems.length > 0 && (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-secondary mb-1.5">
                  Received Amount (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  placeholder="Enter amount received"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-secondary font-medium text-sm sm:text-base"
                />
              </div>

              {/* Change to Return - Only show if received amount is entered */}
              {receivedAmount && parseFloat(receivedAmount) >= total && (
                <div className="bg-green-100 rounded-lg p-2 sm:p-2.5 border border-green-500">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base font-bold text-green-800">Change to Return:</span>
                    <span className="text-lg sm:text-xl font-bold text-green-800">Rs. {change}</span>
                  </div>
                </div>
              )}

              {/* Warning if received amount is less than total */}
              {receivedAmount && parseFloat(receivedAmount) < total && (
                <div className="bg-red-100 rounded-lg p-2 border border-red-400">
                  <p className="text-xs sm:text-sm text-red-700 font-semibold text-center">
                    ⚠️ Insufficient amount! Need Rs. {(total - parseFloat(receivedAmount)).toFixed(2)} more
                  </p>
                </div>
              )}
            </>
          )}

          <button
            onClick={onPlaceOrder}
            disabled={cartItems.length === 0 || isPlacing}
            className={`w-full py-2.5 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base active:scale-95 shadow-md ${
              cartItems.length > 0 && !isPlacing
                ? 'bg-secondary text-primary hover:shadow-xl hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isPlacing ? 'Placing…' : 'Place Order'}
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderCart;
