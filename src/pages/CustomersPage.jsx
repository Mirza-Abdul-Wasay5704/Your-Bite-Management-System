import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'customers'), orderBy('lastOrderDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(customersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-secondary">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2">Customer Database</h1>
        <p className="text-gray-600">Manage and view all your customers</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-secondary font-medium"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary rounded-lg p-4 shadow-md border border-secondary">
          <p className="text-secondary font-semibold text-sm">Total Customers</p>
          <p className="text-3xl font-bold text-secondary">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
          <p className="text-secondary font-semibold text-sm">Searched Results</p>
          <p className="text-3xl font-bold text-secondary">{filteredCustomers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
          <p className="text-secondary font-semibold text-sm">Database</p>
          <p className="text-lg font-bold text-secondary">Firebase</p>
        </div>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-4xl mb-4">👥</p>
          <p className="text-xl text-gray-600">
            {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Start taking orders!'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold">#</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Customer Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Phone Number</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">First Order</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-background transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-secondary font-bold mr-3">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-secondary">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-secondary font-medium">{customer.phone}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(customer.firstOrderDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(customer.lastOrderDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
