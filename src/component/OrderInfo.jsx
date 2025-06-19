import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ppservice from '../service/ppservice';

const OrderInfo = () => {
  const { orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const colors = {
    primary: '#7F7B72',
    text: '#000000',
    background: '#F7F0E0',
    light: '#F1EADC',
    lighter: '#E5DED4',
  };

  const formatPrice = (price) => (typeof price === 'number' ? price.toFixed(2) : '0.00');

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    Promise.all([
      ppservice.getOrderInfo(orderId),
      ppservice.getOrderItems(orderId)
    ])
      .then(([orderRes, itemsRes]) => {
        setOrderInfo(orderRes.data);
        setOrderItems(itemsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load order details.');
        setLoading(false);
      });
  }, [orderId]);

  const markItemDone = (itemId) => {
    if (!itemId) return alert("Invalid item ID.");
    setUpdatingItemId(itemId);
    ppservice.markItemAsDone(itemId)
      .then(() => {
        setOrderItems(prev =>
          prev.map(item =>
            item.orderItemsId === itemId ? { ...item, done: true } : item
          )
        );
        return ppservice.getOrderInfo(orderId);
      })
      .then((orderRes) => {
        setOrderInfo(orderRes.data);
        setUpdatingItemId(null);
      })
      .catch(() => {
        alert('Failed to mark item as done');
        setUpdatingItemId(null);
      });
  };

  const markItemUnDone = (itemId) => {
    if (!itemId) return alert("Invalid item ID.");
    setUpdatingItemId(itemId);
    ppservice.markItemAsUnDone(itemId)
      .then(() => {
        setOrderItems(prev =>
          prev.map(item =>
            item.orderItemsId === itemId ? { ...item, done: false } : item
          )
        );
        return ppservice.getOrderInfo(orderId);
      })
      .then((orderRes) => {
        setOrderInfo(orderRes.data);
        setUpdatingItemId(null);
      })
      .catch(() => {
        alert('Failed to mark item as undone');
        setUpdatingItemId(null);
      });
  };

  if (loading) return <div className="text-center mt-5">Loading order details...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!orderInfo) return <p>No order info found.</p>;

  return (
    <div className="container py-4" style={{ fontFamily: "'Roboto Slab', serif", color: colors.text }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600&display=swap');

          .custom-bg {
            background-color: ${colors.background};
          }
          .custom-primary {
            color: ${colors.primary};
          }
          .custom-btn {
            background-color: ${colors.primary};
            color: white;
            border: none;
            padding: 0.4rem 0.8rem;
            border-radius: 5px;
          }
          .custom-btn:hover {
            background-color: #6f6a62;
          }
          .table th, .table td {
            vertical-align: middle !important;
          }
        `}
      </style>

      <div className="card shadow mb-4 custom-bg">
        <div className="card-body">
          <h3 className="custom-primary mb-4">Order #{orderId}</h3>
          <p><strong>Date:</strong> {new Date(orderInfo.createdAt).toLocaleString()}</p>
          <p><strong>Full Name:</strong> {orderInfo.fullName}</p>
          <p><strong>Email:</strong> {orderInfo.email}</p>
          <p><strong>Phone:</strong> {orderInfo.phone}</p>
          <p><strong>Location:</strong> {orderInfo.location}</p>
          <p><strong>Payment:</strong> {orderInfo.pay}</p>
          <p><strong>Total:</strong> ${formatPrice(orderInfo.totalPrice)}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`badge ${orderInfo.done ? 'bg-success' : 'bg-warning text-dark'}`}>
              {orderInfo.done ? 'Done' : 'Pending'}
            </span>
          </p>
        </div>
      </div>

      <h4 className="custom-primary mb-3">Order Items</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead style={{ backgroundColor: colors.primary, color: 'white' }}>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Color</th>
              <th>Size</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map(item => (
              <tr key={item.orderItemsId}>
                <td>{item.product?.productName || 'N/A'}</td>
                <td>{item.quantity}</td>
                <td>${formatPrice(item.price)}</td>
                <td>{item.color || '-'}</td>
                <td>{item.size || '-'}</td>
                <td>
                  <span className={`badge ${item.done ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {item.done ? 'Done' : 'Pending'}
                  </span>
                </td>
                <td>
                  {!item.done ? (
                    <button
                      type="button"
                      className="custom-btn btn-sm"
                      onClick={() => markItemDone(item.orderItemsId)}
                      disabled={updatingItemId === item.orderItemsId}
                    >
                      {updatingItemId === item.orderItemsId ? 'Updating...' : 'Mark as Done'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => markItemUnDone(item.orderItemsId)}
                      disabled={updatingItemId === item.orderItemsId}
                    >
                      {updatingItemId === item.orderItemsId ? 'Updating...' : 'Mark as Undone'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderInfo;
