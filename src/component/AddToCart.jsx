import React, { useEffect, useState } from 'react';
import userService from '../service/userservice';
import authService from '../service/authService';
import { useNavigate } from 'react-router-dom';

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userid, setUserId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const navigate = useNavigate();

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const token = await authService.getToken();
        const user = authService.decodeToken(token);
        if (user?.appUserId) {
          setUserId(user.appUserId);
          const response = await userService.getCart(user.appUserId);
          setCartItems(response.data || []);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    fetchUserAndCart();
  }, []);

  useEffect(() => {
    if (userid) {
      refreshCart();
    }
  }, [userid]);

  const refreshCart = async () => {
    try {
      const response = await userService.getCart(userid);
      const updatedItems = response.data || [];
      setCartItems(updatedItems);
      updateSelectedTotal(updatedItems);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  const handleIncrement = async (cartItemId) => {
    await userService.incrementItem(cartItemId);
    await refreshCart();
  };

  const handleDecrement = async (cartItemId) => {
    await userService.decrementItem(cartItemId);
    await refreshCart();
  };

  const toggleSelect = (item) => {
    const updatedSelection = [...selectedItems];
    const index = updatedSelection.findIndex(i => i.cartItemId === item.cartItemId);
    if (index > -1) {
      updatedSelection.splice(index, 1);
    } else {
      updatedSelection.push(item);
    }
    setSelectedItems(updatedSelection);
    updateSelectedTotal(cartItems, updatedSelection);
  };

  const updateSelectedTotal = (items, selection = selectedItems) => {
    let total = 0;
    selection.forEach(sel => {
      const item = items.find(i => i.cartItemId === sel.cartItemId);
      if (item) total += item.totalPrice || 0;
    });
    setSelectedTotal(total);
  };

  const handleCheckout = (method) => {
    const ids = selectedItems.map(i => i.cartItemId);
    const data = { userid, cartItems: ids, selectedTotal };

    if (method === 'cash') {
      navigate(`/user/cod/${userid}`, { state: data });
    } else if (method === 'card') {
      navigate(`/user/pay/${userid}`, { state: data });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        body, h1, h2, h3, h4, h5, h6, p, button {
          font-family: 'Poppins', sans-serif;
        }

        .cart-container {
          max-width: 900px;
          margin: 3rem auto;
          background-color: #FFFFFF;
          padding: 2rem 2.5rem;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          color: #000;
        }

        h2 {
          font-weight: 700;
          color: #13B6B9;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2.2rem;
        }

        .cart-card {
          background-color: rgba(19, 182, 185, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .cart-card:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
        }

        .cart-card h4 {
          margin: 0;
          color: #FFA100;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .cart-card p {
          margin: 0.3rem 0;
          font-weight: 500;
          color: #000000;
        }

        .btn-outline-success,
        .btn-outline-danger {
          font-size: 1.2rem;
          padding: 0.4rem 0.9rem;
          border-radius: 6px;
          border: 2px solid #FFA100;
          color: #FFA100;
          background-color: transparent;
          font-weight: bold;
        }

        .btn-outline-success:hover,
        .btn-outline-danger:hover {
          background-color: #FFA100;
          color: white;
        }

        .checkout-section {
          border-top: 2px solid #E5E5E5;
          padding-top: 1.5rem;
          margin-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #F9F9F9;
          border-radius: 12px;
          padding: 1rem 1.5rem;
        }

        .checkout-section h4 {
          font-weight: bold;
          color: #000;
          font-size: 1.3rem;
          margin: 0;
        }

        .btn-primary {
          background-color: #FFA100;
          border: none;
          font-weight: bold;
          color: #000000;
          padding: 0.6rem 1.4rem;
          border-radius: 8px;
          font-size: 1rem;
        }

        .btn-primary:disabled {
          background-color: #ffe4b3;
          color: #999;
          cursor: not-allowed;
        }

        .form-check-input {
          transform: scale(1.3);
          margin-right: 0.6rem;
          cursor: pointer;
        }

        .empty-message {
          text-align: center;
          color: #666;
          font-size: 1.15rem;
          font-weight: 500;
          margin-top: 2rem;
        }
      `}</style>

      <div className="cart-container">
        <h2>🛒 My Cart</h2>

        {cartItems.length === 0 ? (
          <p className="empty-message">Your cart is empty.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.cartItemId} className="cart-card">
              <div className="d-flex align-items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedItems.some(i => i.cartItemId === item.cartItemId)}
                  onChange={() => toggleSelect(item)}
                  className="form-check-input"
                />
                <h4>{item.product?.productName || ''}</h4>
              </div>
              {item.color && <p>🎨 <strong>Color:</strong> {item.color}</p>}
              {item.size && <p>📏 <strong>Size:</strong> {item.size}</p>}
              {item.price != null && <p>💲 <strong>Price:</strong> {formatCurrency(item.price)}</p>}
              {item.totalPrice != null && <p><strong>Total Price:</strong> {formatCurrency(item.totalPrice)}</p>}
              {item.quantity != null && <p>🔢 <strong>Quantity:</strong> {item.quantity}</p>}
              <div className="mt-2">
                <button className="btn btn-outline-success me-2" onClick={() => handleIncrement(item.cartItemId)}>➕</button>
                <button className="btn btn-outline-danger" onClick={() => handleDecrement(item.cartItemId)}>➖</button>
              </div>
            </div>
          ))
        )}

        {cartItems.length > 0 && (
          <div className="checkout-section">
            <h4>Total Selected: {formatCurrency(selectedTotal)}</h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-primary"
                disabled={selectedItems.length === 0}
                onClick={() => handleCheckout('cash')}
              >
                💵 Pay with Cash
              </button>
              <button
                className="btn btn-primary"
                disabled={selectedItems.length === 0}
                onClick={() => handleCheckout('card')}
              >
                💳 Pay with Card
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddToCart;
