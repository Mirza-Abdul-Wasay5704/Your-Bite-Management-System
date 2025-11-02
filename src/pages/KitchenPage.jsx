import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, doc, query, orderBy, deleteDoc, serverTimestamp } from 'firebase/firestore';
import OrderRow from '../components/OrderRow';

const KitchenPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState(null); // { id, items: [{name, price, quantity}] }
  const [savingEdit, setSavingEdit] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [addSearch, setAddSearch] = useState('');

  const statusOptions = ['All', 'Pending', 'Preparing', 'Ready', 'Delivered'];

  // Real-time listener for orders
  useEffect(() => {
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Preload dishes for fast add-in-edit
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'dishes'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Only show available dishes
      setDishes(data.filter(d => d.isAvailable));
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleCancelOrder = async (orderId, status) => {
    if (status === 'Delivered') {
      alert('Delivered orders cannot be canceled.');
      return;
    }
    const yes = confirm('Cancel this order? This cannot be undone.');
    if (!yes) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error canceling order. Please try again.');
    }
  };

  const handleMarkAllPendingAsDelivered = async () => {
    const pendingOrders = orders.filter(order => order.status === 'Pending');
    
    if (pendingOrders.length === 0) {
      alert('No pending orders to mark as delivered.');
      return;
    }

    const yes = confirm(`Mark all ${pendingOrders.length} pending order(s) as delivered?`);
    if (!yes) return;

    try {
      const updatePromises = pendingOrders.map(order =>
        updateDoc(doc(db, 'orders', order.id), {
          status: 'Delivered',
          deliveredAt: serverTimestamp()
        })
      );
      
      await Promise.all(updatePromises);
      alert(`Successfully marked ${pendingOrders.length} order(s) as delivered!`);
    } catch (error) {
      console.error('Error marking orders as delivered:', error);
      alert('Error updating orders. Please try again.');
    }
  };

  const openEditModal = (order) => {
    if (order.status === 'Delivered') {
      alert('Delivered orders cannot be edited.');
      return;
    }
    // Deep copy minimal fields for editing
    setEditDraft({
      id: order.id,
      items: order.items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))
    });
    setEditOpen(true);
  };

  const updateDraftQuantity = (index, qty) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      const items = [...prev.items];
      items[index] = { ...items[index], quantity: Math.max(0, qty) };
      return { ...prev, items };
    });
  };

  const removeDraftItem = (index) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      const items = prev.items.filter((_, idx) => idx !== index);
      return { ...prev, items };
    });
  };

  const draftTotal = editDraft ? editDraft.items.reduce((s, it) => s + it.price * it.quantity, 0) : 0;

  const addDishToDraft = (dish) => {
    setEditDraft(prev => {
      if (!prev) return prev;
      const idx = prev.items.findIndex(i => i.name === dish.name);
      if (idx > -1) {
        const items = [...prev.items];
        items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
        return { ...prev, items };
      }
      return { ...prev, items: [...prev.items, { name: dish.name, price: dish.price, quantity: 1 }] };
    });
  };

  const saveEdit = async () => {
    if (!editDraft) return;
    const cleanedItems = editDraft.items.filter(it => it.quantity > 0);
    if (cleanedItems.length === 0) {
      alert('Order must have at least one item.');
      return;
    }
    setSavingEdit(true);
    try {
      await updateDoc(doc(db, 'orders', editDraft.id), {
        items: cleanedItems,
        total: cleanedItems.reduce((s, it) => s + it.price * it.quantity, 0),
        updatedAt: serverTimestamp()
      });
      setEditOpen(false);
      setEditDraft(null);
    } catch (error) {
      console.error('Error saving order edits:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-secondary">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Kitchen Dashboard</h1>
          <p className="text-gray-600">Manage and track order statuses</p>
        </div>
        {getStatusCount('Pending') > 0 && (
          <button
            onClick={handleMarkAllPendingAsDelivered}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2"
          >
            <span>✅</span>
            Mark All Pending as Delivered
          </button>
        )}
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-50 border-2 border-primary rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">🟡</div>
          <div className="text-2xl font-bold text-secondary">{getStatusCount('Pending')}</div>
          <div className="text-sm text-gray-700 font-medium">Pending</div>
        </div>
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">🟠</div>
          <div className="text-2xl font-bold text-secondary">{getStatusCount('Preparing')}</div>
          <div className="text-sm text-gray-700 font-medium">Preparing</div>
        </div>
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">🟢</div>
          <div className="text-2xl font-bold text-secondary">{getStatusCount('Ready')}</div>
          <div className="text-sm text-gray-700 font-medium">Ready</div>
        </div>
        <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">⚪</div>
          <div className="text-2xl font-bold text-secondary">{getStatusCount('Delivered')}</div>
          <div className="text-sm text-gray-700 font-medium">Delivered</div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all border-2 ${
              filterStatus === status
                ? 'bg-primary text-secondary border-primary shadow-md'
                : 'bg-white text-secondary border-gray-200 hover:border-primary hover:shadow'
            }`}
          >
            {status}
            {status !== 'All' && ` (${getStatusCount(status)})`}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-xl text-gray-600">
            {filterStatus === 'All' 
              ? 'No orders yet.' 
              : `No ${filterStatus.toLowerCase()} orders.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary text-primary border-b-2 border-primary">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Items</th>
                  <th className="px-4 py-3 text-center font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-left font-semibold">Total</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Time</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    onCancel={handleCancelOrder}
                    onEdit={openEditModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && editDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => !savingEdit && setEditOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-11/12 max-w-lg p-5 border-2 border-primary">
            <h3 className="text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Edit Order Items</h3>
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {editDraft.items.length === 0 ? (
                <div className="text-gray-500 text-sm">No items. Add at least one item to save.</div>
              ) : (
                editDraft.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-background rounded-lg p-3 border border-gray-200">
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-secondary text-sm">{it.name}</div>
                      <div className="text-xs text-gray-600">Rs. {it.price}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateDraftQuantity(idx, it.quantity - 1)}
                        className="bg-secondary text-primary w-8 h-8 rounded-full active:scale-95 hover:bg-gray-800 transition-colors font-bold"
                        disabled={savingEdit}
                      >-
                      </button>
                      <span className="w-8 text-center font-semibold text-secondary">{it.quantity}</span>
                      <button
                        onClick={() => updateDraftQuantity(idx, it.quantity + 1)}
                        className="bg-secondary text-primary w-8 h-8 rounded-full active:scale-95 hover:bg-gray-800 transition-colors font-bold"
                        disabled={savingEdit}
                      >+
                      </button>
                      <button
                        onClick={() => removeDraftItem(idx)}
                        className="text-red-600 font-bold ml-2 hover:text-red-800 transition-colors"
                        disabled={savingEdit}
                      >✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add more items inside modal */}
            <div className="mt-4 border-t-2 border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-secondary">Add items</div>
                <div className="text-xs text-gray-500">Menu items available</div>
              </div>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Search items (e.g., Chow Mein)"
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
              />
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                {dishes
                  .filter(d => (d.name || '').toLowerCase().includes(addSearch.toLowerCase()))
                  .slice(0, 30)
                  .map(dish => (
                    <div key={dish.id} className="flex items-center justify-between px-3 py-2 hover:bg-background">
                      <div className="min-w-0 pr-2">
                        <div className="text-sm font-medium text-secondary truncate">{dish.name}</div>
                        <div className="text-xs text-gray-600">Rs. {dish.price}</div>
                      </div>
                      <button
                        className="px-2.5 py-1.5 text-sm rounded-lg bg-primary text-secondary hover:shadow-md hover:bg-accent transition-all font-semibold"
                        onClick={() => addDishToDraft(dish)}
                        disabled={savingEdit}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                {dishes.filter(d => (d.name || '').toLowerCase().includes(addSearch.toLowerCase())).length === 0 && (
                  <div className="px-3 py-2 text-xs text-gray-500">No matches</div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 border-t-2 border-gray-200 pt-4">
              <div className="text-lg font-bold text-secondary">Total: <span className="text-primary">Rs. {draftTotal}</span></div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-secondary hover:bg-gray-300 transition-colors font-semibold"
                  onClick={() => setEditOpen(false)}
                  disabled={savingEdit}
                >
                  Close
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-bold shadow-md transition-all ${editDraft.items.filter(i => i.quantity > 0).length > 0 ? 'bg-primary text-secondary hover:bg-accent hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  onClick={saveEdit}
                  disabled={savingEdit || editDraft.items.filter(i => i.quantity > 0).length === 0}
                >
                  {savingEdit ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenPage;
