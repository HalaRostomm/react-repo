import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userservice from '../service/userservice';

const MyOrders = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userservice.getOrdersByUser(userid);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userid]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  };

  return (
    <>
      <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    body {
      font-family: 'Poppins', sans-serif;
      background-color: #E5E5E5;
      color: #000000;
    }

    .orders-container {
      max-width: 900px;
      margin: 3rem auto;
      padding: 1rem;
    }

    .orders-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 600;
      color: #13B6B9;
      margin-bottom: 2rem;
    }

    .order-card {
      background: rgba(19, 182, 185, 0.2); /* 13B6B9 with 20% opacity */
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: transform 0.2s;
      cursor: pointer;
      margin-bottom: 1.2rem;
    }

    .order-card:hover {
      transform: translateY(-5px);
    }

    .order-icon {
      background-color: #FFA100;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 1.8rem;
    }

    .order-details {
      flex-grow: 1;
      margin-left: 1.5rem;
    }

    .order-date,
    .order-price,
    .order-status {
      margin: 0.25rem 0;
      color: #000000;
      font-size: 0.95rem;
    }

    .status-text {
      font-weight: 600;
    }

    .status-done {
      color: #198754;
    }

    .status-pending {
      color: #FFA100;
    }

    .status-cancelled {
      color: #dc3545;
    }

    .chevron {
      font-size: 1.5rem;
      color: #999999;
    }
  `}</style>

      <div className="orders-container">
        <h3 className="orders-title">📦 My Orders</h3>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-warning" role="status" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          orders.map((order) => {
            const statusText = order.done === true ? 'Done' : order.status || 'Pending';
            const statusClass =
              statusText === 'Done'
                ? 'status-done'
                : statusText === 'Cancelled'
                ? 'status-cancelled'
                : 'status-pending';

            return (
              <div
                key={order.orderId || order.id}
                className="order-card mb-3"
                onClick={() => navigate(`/user/getorderitems/${order.orderId || order.id}`)}
              >
                <div className="order-icon">
                  <i className="bi bi-card-checklist"></i>
                </div>
                <div className="order-details">
                  <p className="order-date"><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                  <p className="order-price"><strong>Total:</strong> ${order.totalPrice?.toFixed(2)}</p>
                  <p className="order-status">
                    <strong>Status:</strong>{" "}
                    <span className={`status-text ${statusClass}`}>{statusText}</span>
                  </p>
                </div>
                <div className="chevron">
                  <i className="bi bi-chevron-right" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default MyOrders;
