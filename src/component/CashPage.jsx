import React, { useEffect, useState } from 'react';
import userService from '../service/userservice';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const CashPage = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems = [], selectedTotal = 0 } = location.state || {};

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userid || !Array.isArray(cartItems) || cartItems.length === 0) {
      alert("Missing user or cart info.");
      return;
    }

    setLoading(true);

    const data = {
      email: form.email,
      fullName: form.fullName,
      phone: form.phone,
      location: form.location,
      amount: parseFloat(selectedTotal),
      cartItems,
    };

    try {
      const response = await userService.makeOrderCod(parseInt(userid), data);

      if (response.status === 200) {
        alert("✅ Order placed successfully!");

        // ✅ Clear selected cart items from cart

        navigate('/user/orders'); // Or redirect wherever you want
      } else {
        alert(`❌ Failed: ${response.data?.message}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    }

    setLoading(false);
  };

  return (
   <>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap');

    body {
      font-family: 'Tinos', serif;
      background-color: #E5E5E5;
      margin: 0;
      padding: 0;
      color: #000000;
    }

    .cash-form-container {
      max-width: 600px;
      margin: 3rem auto;
      background-color: #FFFFFF;
      padding: 2rem 2.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .cash-form-container h2 {
      text-align: center;
      color: #14213D;
      font-weight: bold;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      font-weight: bold;
      color: #FCA311;
      margin-bottom: 0.5rem;
    }

    .form-label svg {
      margin-right: 0.5rem;
      color: #14213D;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #E5E5E5;
      border-radius: 8px;
      font-size: 1rem;
      background-color: #F9F9F9;
    }

    .form-control[readonly] {
      background-color: #f0f0f0;
    }

    .submit-btn {
      background-color: #FCA311;
      color: #000000;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1.1rem;
      font-weight: bold;
      border-radius: 10px;
      width: 100%;
      margin-top: 1rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .submit-btn:hover {
      background-color: #e59600;
    }
  `}</style>

  <div className="cash-form-container">
    <h2>💵 Cash on Delivery</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0-0.001-6.001A3 3 0 0 0 8 8z"/>
          </svg>
          Full Name
        </label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.654 1.328a.678.678 0 0 1 .77-.092l2.522 1.26a.678.678 0 0 1 .291.854l-.75 1.854a.678.678 0 0 1-.708.39l-1.21-.242a11.03 11.03 0 0 0 4.516 4.516l-.242-1.21a.678.678 0 0 1 .39-.708l1.854-.75a.678.678 0 0 1 .854.291l1.26 2.522a.678.678 0 0 1-.092.77l-1.344 1.344c-.329.329-.795.427-1.21.244-1.29-.546-2.962-1.724-4.987-3.75S2.73 5.773 2.183 4.483c-.183-.415-.085-.88.244-1.21L3.654 1.328z"/>
          </svg>
          Phone
        </label>
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0.05l-8 4.9-8-4.9V4zm0 1.434v6.566a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.434l-7.555 4.623a.5.5 0 0 1-.445 0L0 5.434z"/>
          </svg>
          Email
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0a5 5 0 0 0-5 5c0 3.25 5 11 5 11s5-7.75 5-11a5 5 0 0 0-5-5zM8 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
          </svg>
          Delivery Location
        </label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 8 8A8.014 8.014 0 0 0 8 0zM4 8a1 1 0 0 1 2 0 2 2 0 0 0 4 0 1 1 0 0 1 2 0 4 4 0 0 1-8 0z"/>
          </svg>
          Total Amount
        </label>
        <input
          value={`$${selectedTotal.toFixed(2)}`}
          readOnly
          className="form-control"
        />
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order 💰'}
      </button>
    </form>
  </div>
</>
  );
};

export default CashPage;
