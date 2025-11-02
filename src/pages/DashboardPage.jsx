import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filterOrdersByTime = (orders) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt.seconds * 1000);
      
      switch(timeFilter) {
        case 'today':
          return orderDate >= today;
        case 'week':
          return orderDate >= weekAgo;
        case 'month':
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrdersByTime(orders);

  const calculateStats = () => {
    const totalOrders = filteredOrders.length;
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalItems = filteredOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const itemStats = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = {
            quantity: 0,
            revenue: 0,
            orders: 0
          };
        }
        itemStats[item.name].quantity += item.quantity;
        itemStats[item.name].revenue += item.price * item.quantity;
        itemStats[item.name].orders += 1;
      });
    });

    const topItems = Object.entries(itemStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);

    const revenueByStatus = {
      Pending: 0,
      Preparing: 0,
      Ready: 0,
      Delivered: 0
    };
    const ordersByStatus = {
      Pending: 0,
      Preparing: 0,
      Ready: 0,
      Delivered: 0
    };
    filteredOrders.forEach(order => {
      revenueByStatus[order.status] = (revenueByStatus[order.status] || 0) + order.total;
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    return { 
      totalOrders, 
      totalSales, 
      totalItems,
      avgOrderValue,
      topItems,
      revenueByStatus,
      ordersByStatus
    };
  };

  const getDayWiseStats = () => {
    const dayStats = {};
    filteredOrders.forEach(order => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt.seconds * 1000);
      const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!dayStats[dayKey]) {
        dayStats[dayKey] = { orders: 0, revenue: 0, items: 0 };
      }
      dayStats[dayKey].orders += 1;
      dayStats[dayKey].revenue += order.total;
      dayStats[dayKey].items += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });
    
    return Object.entries(dayStats)
      .map(([day, stats]) => ({ day, ...stats }))
      .slice(-14);
  };

  const getHourWiseStats = () => {
    const hourStats = {};
    for (let i = 0; i < 24; i++) {
      hourStats[i] = { orders: 0, revenue: 0 };
    }
    
    filteredOrders.forEach(order => {
      if (!order.createdAt) return;
      const hour = new Date(order.createdAt.seconds * 1000).getHours();
      hourStats[hour].orders += 1;
      hourStats[hour].revenue += order.total;
    });
    
    return Object.entries(hourStats)
      .map(([hour, stats]) => ({ 
        hour: `${hour.padStart(2, '0')}:00`, 
        hourNum: parseInt(hour),
        ...stats 
      }))
      .filter(h => h.orders > 0)
      .sort((a, b) => a.hourNum - b.hourNum);
  };

  const getWeekWiseStats = () => {
    const weekStats = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    dayNames.forEach((day, index) => {
      weekStats[index] = { day, orders: 0, revenue: 0, items: 0 };
    });
    
    filteredOrders.forEach(order => {
      if (!order.createdAt) return;
      const dayOfWeek = new Date(order.createdAt.seconds * 1000).getDay();
      weekStats[dayOfWeek].orders += 1;
      weekStats[dayOfWeek].revenue += order.total;
      weekStats[dayOfWeek].items += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });
    
    return Object.values(weekStats);
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Order Number', 'Items', 'Quantity', 'Total', 'Status', 'Created At'];
    const rows = orders.map(order => [
      order.orderNumber,
      order.items.map(item => `${item.name} x${item.quantity}`).join('; '),
      order.items.reduce((sum, item) => sum + item.quantity, 0),
      order.total,
      order.status,
      order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `your-bite-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const dayWiseStats = getDayWiseStats();
  const hourWiseStats = getHourWiseStats();
  const weekWiseStats = getWeekWiseStats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">📊 Sales Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={orders.length === 0}
          className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-accent transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>📥</span>
          Export CSV
        </button>
      </div>

      {/* Time Filter */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-xl shadow-md border-2 border-gray-100">
        <span className="text-sm font-semibold text-secondary mr-2 self-center">Period:</span>
        {['all', 'today', 'week', 'month'].map(filter => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
              timeFilter === filter
                ? 'bg-primary text-secondary shadow-md'
                : 'bg-gray-100 text-secondary hover:bg-gray-200'
            }`}
          >
            {filter === 'all' ? 'All Time' : filter === 'today' ? 'Today' : filter === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
          </button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-primary via-yellow-400 to-yellow-300 rounded-xl p-5 shadow-lg border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary font-semibold mb-1 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-secondary">{stats.totalOrders}</p>
              <p className="text-xs text-secondary/80 mt-1">All statuses</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-400 rounded-xl p-5 shadow-lg border-2 border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold mb-1 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white">Rs. {stats.totalSales.toLocaleString()}</p>
              <p className="text-xs text-white/80 mt-1">Gross sales</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl p-5 shadow-lg border-2 border-blue-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold mb-1 text-sm">Total Items Sold</p>
              <p className="text-3xl font-bold text-white">{stats.totalItems}</p>
              <p className="text-xs text-white/80 mt-1">Units sold</p>
            </div>
            <div className="text-4xl">🍔</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl p-5 shadow-lg border-2 border-purple-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold mb-1 text-sm">Avg Order Value</p>
              <p className="text-3xl font-bold text-white">Rs. {stats.avgOrderValue.toFixed(0)}</p>
              <p className="text-xs text-white/80 mt-1">Per order</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Revenue & Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
            <span>💵</span> Revenue by Status
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats.revenueByStatus).map(([status, revenue]) => (
              <div key={status} className="text-center p-4 bg-background rounded-lg border-2 border-primary/20 hover:border-primary transition-colors">
                <div className="text-2xl mb-2">
                  {status === 'Pending' ? '🟡' : status === 'Preparing' ? '🟠' : status === 'Ready' ? '🟢' : '⚪'}
                </div>
                <div className="text-xs text-gray-600 mb-1 font-medium">{status}</div>
                <div className="text-lg font-bold text-secondary">Rs. {revenue.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">{stats.ordersByStatus[status]} orders</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
            <span>🏆</span> Top Selling Items
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.topItems.slice(0, 5).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-background rounded-lg border border-gray-200 hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-secondary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-secondary">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.quantity} units • {item.orders} orders</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-secondary">Rs. {item.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
            {stats.topItems.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-3xl mb-2">📦</p>
                <p className="text-sm">No items sold yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Day-wise Sales */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-100">
        <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
          <span>📅</span> Day-wise Sales (Last 14 Days)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary text-primary border-b-2 border-primary">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-center font-semibold">Orders</th>
                <th className="px-4 py-3 text-center font-semibold">Items Sold</th>
                <th className="px-4 py-3 text-right font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {dayWiseStats.map((stat, index) => (
                <tr key={index} className="border-b hover:bg-background transition-colors">
                  <td className="px-4 py-3 font-semibold text-secondary">{stat.day}</td>
                  <td className="px-4 py-3 text-center text-secondary">{stat.orders}</td>
                  <td className="px-4 py-3 text-center text-secondary">{stat.items}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">Rs. {stat.revenue.toLocaleString()}</td>
                </tr>
              ))}
              {dayWiseStats.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    <p className="text-3xl mb-2">📊</p>
                    <p>No sales data available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hour-wise & Week-wise Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Hour-wise Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
            <span>⏰</span> Hour-wise Orders
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {hourWiseStats.map((stat) => (
              <div key={stat.hour} className="flex items-center justify-between p-3 bg-background rounded-lg border border-gray-200 hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary text-primary px-3 py-1 rounded-lg font-bold text-sm">
                    {stat.hour}
                  </div>
                  <div>
                    <div className="font-semibold text-secondary">{stat.orders} orders</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">Rs. {stat.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
            {hourWiseStats.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-3xl mb-2">⏰</p>
                <p className="text-sm">No hourly data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Week-wise Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
            <span>📆</span> Day of Week Performance
          </h2>
          <div className="space-y-2">
            {weekWiseStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-gray-200 hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary text-primary px-3 py-1 rounded-lg font-bold text-sm w-12 text-center">
                    {stat.day}
                  </div>
                  <div>
                    <div className="font-semibold text-secondary">{stat.orders} orders • {stat.items} items</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">Rs. {stat.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Items Performance Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
        <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
          <span>📋</span> All Items Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary text-primary border-b-2 border-primary">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Item Name</th>
                <th className="px-4 py-3 text-center font-semibold">Quantity Sold</th>
                <th className="px-4 py-3 text-center font-semibold">Times Ordered</th>
                <th className="px-4 py-3 text-right font-semibold">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.topItems.map((item, index) => (
                <tr key={index} className="border-b hover:bg-background transition-colors">
                  <td className="px-4 py-3 font-semibold text-secondary">{item.name}</td>
                  <td className="px-4 py-3 text-center text-secondary">{item.quantity}</td>
                  <td className="px-4 py-3 text-center text-secondary">{item.orders}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">Rs. {item.revenue.toLocaleString()}</td>
                </tr>
              ))}
              {stats.topItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    <p className="text-3xl mb-2">🍽️</p>
                    <p>No items data available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
