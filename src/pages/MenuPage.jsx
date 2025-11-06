import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import MenuCard from '../components/MenuCard';
import { migrateServingSize } from '../utils/migrateServingSize';

const MenuPage = () => {
  const [dishes, setDishes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
    servingSize: '',
    isAvailable: true
  });

  const categories = ['Pizza', 'Pasta', 'Burgers', 'Desserts', 'Beverages', 'Sides'];
  const servingSizes = ['Single Serving', 'Double Serving', 'Family Pack (3-4)', 'Party Pack (6-8)', 'Small', 'Medium', 'Large', 'Extra Large'];

  // Real-time listener for dishes
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'dishes'), (snapshot) => {
      const dishesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDishes(dishesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dishData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingDish && editingDish.id) {
        // Update existing dish - use the stored ID
        console.log('Updating dish with ID:', editingDish.id);
        await updateDoc(doc(db, 'dishes', editingDish.id), dishData);
        console.log('Dish updated successfully');
      } else {
        // Add new dish
        console.log('Adding new dish');
        await addDoc(collection(db, 'dishes'), dishData);
        console.log('Dish added successfully');
      }

      // Close modal and reset form only after successful save
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving dish:', error);
      alert('Error saving dish. Please try again.');
    }
  };

  const handleEdit = (dish) => {
    console.log('Editing dish:', dish); // Debug log
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      price: dish.price.toString(),
      category: dish.category,
      imageUrl: dish.imageUrl || '',
      servingSize: dish.servingSize || '',
      isAvailable: dish.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (dishId) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      try {
        await deleteDoc(doc(db, 'dishes', dishId));
      } catch (error) {
        console.error('Error deleting dish:', error);
        alert('Error deleting dish. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      imageUrl: '',
      servingSize: '',
      isAvailable: true
    });
    setEditingDish(null);
  };

  const handleAddNewDish = () => {
    resetForm(); // Clear any existing edit state
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleMigration = async () => {
    if (window.confirm('This will add "Single Serving" as default serving size to all dishes that don\'t have one. Continue?')) {
      setIsMigrating(true);
      const result = await migrateServingSize();
      setIsMigrating(false);
      
      if (result.success) {
        alert(`✅ Migration complete!\n\nUpdated: ${result.updated} dishes\nSkipped: ${result.skipped} dishes\nTotal: ${result.total} dishes`);
      } else {
        alert(`❌ Migration failed: ${result.error}`);
      }
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Menu Management</h1>
          <p className="text-gray-600">Add, edit, or remove dishes from your menu</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleMigration}
            disabled={isMigrating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            title="Add serving size to existing dishes"
          >
            {isMigrating ? '🔄 Migrating...' : '🔄 Add Serving Sizes'}
          </button>
          <button
            onClick={handleAddNewDish}
            className="btn-primary"
          >
            ➕ Add New Dish
          </button>
        </div>
      </div>

      {dishes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-4xl mb-4">🍽️</p>
          <p className="text-xl text-gray-600">No dishes yet. Add your first dish!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <MenuCard
              key={dish.id}
              dish={dish}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isMenuPage={true}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-secondary text-white p-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold">
                {editingDish ? 'Edit Dish' : 'Add New Dish'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-2xl hover:text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Pasta Alfredo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 450"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Serving Size *
                </label>
                <select
                  required
                  value={formData.servingSize}
                  onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select serving size</option>
                  {servingSizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-5 h-5 text-primary"
                />
                <label htmlFor="isAvailable" className="text-sm font-semibold text-secondary">
                  Available for orders
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 text-secondary font-semibold py-2 rounded-lg hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingDish ? 'Update' : 'Add'} Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
