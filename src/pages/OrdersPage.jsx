import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, serverTimestamp, query, orderBy, setDoc, doc } from 'firebase/firestore';
import MenuCard from '../components/MenuCard';
import OrderCart from '../components/OrderCart';

const OrdersPage = () => {
  const [dishes, setDishes] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPlacing, setIsPlacing] = useState(false);
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

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || isPlacing) return;
    setIsPlacing(true);

    try {
      // Stable doc id so repeated clicks overwrite instead of duplicating
      if (!pendingOrderIdRef.current) {
        pendingOrderIdRef.current = doc(collection(db, 'orders')).id;
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
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'orders', pendingOrderIdRef.current), orderData);

      // Optimistic UI clear
      setCartItems([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      pendingOrderIdRef.current = null;
      setIsPlacing(false);
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
        onPlaceOrder={handlePlaceOrder}
        isPlacing={isPlacing}
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen(!isCartOpen)}
      />
    </div>
  );
};

export default OrdersPage;
