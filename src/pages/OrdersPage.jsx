import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, serverTimestamp, query, orderBy, setDoc, doc, getDocs, where } from 'firebase/firestore';
import MenuCard from '../components/MenuCard';
import OrderCart from '../components/OrderCart';

const OrdersPage = () => {
  const [dishes, setDishes] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPlacing, setIsPlacing] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const pendingOrderIdRef = useRef(null);

  const categories = ['All', 'Pizza', 'Pasta', 'Burgers', 'Desserts', 'Beverages', 'Sides'];

  // Real-time listener for dishes
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'dishes'), (snapshot) => {
      const dishesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDishes(dishesData.filter(dish => dish.isAvailable));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddToOrder = (dish) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === dish.id);
    
    if (existingItemIndex > -1) {
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
      setCartItems(newCartItems);
    } else {
      setCartItems([...cartItems, { ...dish, quantity: 1 }]);
    }
    
    // Show cart on mobile after adding item
    if (window.innerWidth < 768) {
      setIsCartOpen(true);
    }
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = newQuantity;
    setCartItems(newCartItems);
  };

  const handleRemoveItem = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
  };

  const handlePlaceOrderClick = () => {
    if (cartItems.length === 0) return;
    setShowCustomerModal(true);
  };

  const handleConfirmOrder = async () => {
    // Allow order without customer info (they can skip it)
    setShowCustomerModal(false);
    await handlePlaceOrder();
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || isPlacing) return;
    setIsPlacing(true);

    try {
      // Stable doc id so repeated clicks overwrite instead of duplicating
      if (!pendingOrderIdRef.current) {
        pendingOrderIdRef.current = doc(collection(db, 'orders')).id;
      }

      // Save or update customer only if info is provided
      let customerId = null;
      if (customerInfo.name || customerInfo.phone) {
        customerId = await saveCustomer(customerInfo);
      }

      // Get latest order number once
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await new Promise((resolve) => {
        const unsubscribe = onSnapshot(ordersQuery, (snap) => {
          unsubscribe();
          resolve(snap);
        });
      });

      let orderNumber = 101;
      if (!snapshot.empty) {
        const lastOrder = snapshot.docs[0].data();
        const lastNumber = parseInt((lastOrder.orderNumber || '#100').replace('#', '')) || 100;
        orderNumber = lastNumber + 1;
      }

      const orderData = {
        orderNumber: `#${orderNumber}`,
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'Pending',
        customerId: customerId || null,
        customerName: customerInfo.name || 'Walk-in Customer',
        customerPhone: customerInfo.phone || 'N/A',
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'orders', pendingOrderIdRef.current), orderData);

      // Optimistic UI clear
      setCartItems([]);
      setCustomerInfo({ name: '', phone: '' });
      setIsCartOpen(false);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      pendingOrderIdRef.current = null;
      setIsPlacing(false);
    }
  };

  // Save customer to database (avoid duplicates by phone number)
  const saveCustomer = async (customerData) => {
    try {
      // Skip if both name and phone are empty
      if (!customerData.name && !customerData.phone) {
        return null;
      }

      // If phone is provided, check for existing customer
      if (customerData.phone) {
        const customersRef = collection(db, 'customers');
        const q = query(customersRef, where('phone', '==', customerData.phone));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Customer exists, update their info and return existing ID
          const existingCustomer = querySnapshot.docs[0];
          const customerId = existingCustomer.id;
          
          // Update customer data (in case name changed or was added)
          await setDoc(doc(db, 'customers', customerId), {
            name: customerData.name || existingCustomer.data().name || 'Walk-in Customer',
            phone: customerData.phone,
            lastOrderDate: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });

          return customerId;
        }
      }

      // New customer, create new document
      const newCustomerRef = doc(collection(db, 'customers'));
      await setDoc(newCustomerRef, {
        name: customerData.name || 'Walk-in Customer',
        phone: customerData.phone || 'N/A',
        firstOrderDate: serverTimestamp(),
        lastOrderDate: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      return newCustomerRef.id;
    } catch (error) {
      console.error('Error saving customer:', error);
      // Return null if customer save fails - order can still proceed
      return null;
    }
  };

  const filteredDishes = selectedCategory === 'All'
    ? dishes
    : dishes.filter(dish => dish.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-secondary">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Take New Order</h1>
          <p className="text-gray-600">Select items to add to the current order</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-secondary shadow-md'
                  : 'bg-white text-secondary hover:bg-background'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="text-xl text-gray-600">
              {selectedCategory === 'All' 
                ? 'No dishes available yet.' 
                : `No ${selectedCategory} available.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 md:pb-0">
            {filteredDishes.map((dish) => (
              <MenuCard
                key={dish.id}
                dish={dish}
                onAddToOrder={handleAddToOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Cart Sidebar */}
      <OrderCart
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
        onPlaceOrder={handlePlaceOrderClick}
        isPlacing={isPlacing}
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen(!isCartOpen)}
      />

      {/* Customer Information Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-primary">
            <h2 className="text-2xl font-bold text-secondary mb-2">Customer Information</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Enter customer details (optional) or skip to proceed with the order
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Customer Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-secondary font-medium"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="e.g., 03001234567"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-secondary font-medium"
                />
              </div>

              <div className="bg-primary rounded-lg p-3 border border-secondary">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-secondary">Order Total:</span>
                  <span className="text-2xl font-bold text-secondary">
                    Rs. {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCustomerModal(false);
                  setCustomerInfo({ name: '', phone: '' });
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-secondary font-semibold py-3 rounded-lg transition-all"
                disabled={isPlacing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={isPlacing}
                className="flex-1 bg-secondary text-primary hover:bg-gray-800 font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isPlacing ? 'Placing...' : (customerInfo.name || customerInfo.phone ? 'Confirm Order' : 'Skip & Place Order')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
