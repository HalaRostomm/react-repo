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
        @import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap');

        body {
          font-family: 'Tinos', serif;
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
          font-weight: bold;
          color: #14213D;
          margin-bottom: 2rem;
        }

        .order-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: transform 0.2s;
          cursor: pointer;
        }

        .order-card:hover {
          transform: translateY(-5px);
        }

        .order-icon {
          background-color: #FCA311;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
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
        }

        .status-text {
          font-weight: bold;
        }

        .status-done {
          color: #198754;
        }

        .status-pending {
          color: #FCA311;
        }

        .status-cancelled {
          color: #dc3545;
        }

        .chevron {
          font-size: 1.5rem;
          color: #999;
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
