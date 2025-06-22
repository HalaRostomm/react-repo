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

  const primary = '#FCA311';
  const black = '#000000';
  const white = '#FFFFFF';

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

  if (loading) return <div className="text-center mt-5" style={{ fontFamily: 'Poppins, sans-serif', color: black }}>Loading order details...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!orderInfo) return <p>No order info found.</p>;

  return (
    <div className="container py-4" style={{ fontFamily: 'Poppins, sans-serif', color: black, backgroundColor: white }}>
      <style>{`
        .custom-btn {
          background-color: ${primary};
          color: ${black};
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 600;
        }
        .custom-btn:hover {
          background-color: #e08f0f;
        }
        .table th, .table td {
          vertical-align: middle !important;
        }
      `}</style>

      <div className="card shadow mb-4" style={{ backgroundColor: white, border: `2px solid ${primary}`, borderRadius: '12px' }}>
        <div className="card-body">
          <h3 style={{ color: primary, fontWeight: 700 }}>Order #{orderId}</h3>
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

      <h4 style={{ color: primary, fontWeight: 600 }} className="mb-3">Order Items</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead style={{ backgroundColor: primary, color: white }}>
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
                      className="btn btn-outline-dark btn-sm"
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
