import React from 'react';

const OrderRow = ({ order, onStatusChange, onCancel, onEdit }) => {
  const statusColors = {
    Pending: 'badge-pending',
    Preparing: 'badge-preparing',
    Ready: 'badge-ready',
    Delivered: 'badge-delivered'
  };

  const statusEmojis = {
    Pending: '🟡',
    Preparing: '🟠',
    Ready: '🟢',
    Delivered: '⚪'
  };

  return (
    <tr className="border-b hover:bg-background transition-colors">
      <td className="px-4 py-3 font-bold text-secondary">{order.orderNumber}</td>
      <td className="px-4 py-3">
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600"> × {item.quantity}</span>
            </div>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
      </td>
      <td className="px-4 py-3 font-bold text-secondary">Rs. {order.total}</td>
      <td className="px-4 py-3">
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value)}
          className={`badge ${statusColors[order.status]} cursor-pointer border-none outline-none`}
        >
          <option value="Pending">{statusEmojis.Pending} Pending</option>
          <option value="Preparing">{statusEmojis.Preparing} Preparing</option>
          <option value="Ready">{statusEmojis.Ready} Ready</option>
          <option value="Delivered">{statusEmojis.Delivered} Delivered</option>
        </select>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onEdit && onEdit(order)}
            className="px-3 py-1 rounded-lg bg-primary text-secondary hover:bg-accent hover:shadow-md transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={order.status === 'Delivered'}
            title={order.status === 'Delivered' ? 'Delivered orders cannot be edited' : 'Edit order'}
          >
            Edit
          </button>
          <button
            onClick={() => onCancel && onCancel(order.id, order.status)}
            className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-red-300"
            disabled={order.status === 'Delivered'}
            title={order.status === 'Delivered' ? 'Delivered orders cannot be canceled' : 'Cancel order'}
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OrderRow;
