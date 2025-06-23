import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import userservice from '../service/userservice';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import paymentservice from '../service/paymentservice';
const stripePromise = loadStripe('pk_test_51RPcbvP3riZKn9o2AnicDjuFsXeatlQfCReIlxVbsSgdczhhEzkRqgX2d1isY3sVcysd98POjmLWnFTzmgX8t8Kr00S3bJt1xQ');

const CheckoutForm = () => {
  const { userid } = useParams();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { cartItems = [], selectedTotal = 0 } = location.state || {};
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        const amountInCents = Math.round(selectedTotal * 100);
        const response = await paymentservice.createPaymentIntent( amountInCents);
        console.log('Intent response:', response);

// FIXED: assign response.data directly if it's just the string
setClientSecret(response.data.clientSecret || response.data);
      } catch (error) {
        setPaymentError('Failed to initialize payment. Please try again.');
        console.error('Payment intent creation error:', error);
      }
    };

    if (selectedTotal > 0) {
      createIntent();
    }
  }, [selectedTotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentError(null);

    if (!stripe || !elements || !clientSecret) {
      setPaymentError("Payment system not ready. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            address: {
              line1: form.location,
            },
          },
        },
      });

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === 'succeeded') {
        // Record the payment in your system
        const paymentData = {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          location: form.location,
          amount: parseFloat(selectedTotal),
          cartItems,
          paymentIntentId: paymentIntent.id
        };

        const response = await userservice.makeFakePayment(userid, paymentData);
        alert(`Payment successful! ${response.data.message}`);
        navigate(`/user/order/${userid}`, { state: { paymentData } });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
 <>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    body {
      font-family: 'Poppins', sans-serif;
      background-color: #E5E5E5;
      margin: 0;
      padding: 0;
      color: #000000;
    }

    .payment-container {
      max-width: 600px;
      margin: 3rem auto;
      background-color: rgba(19, 182, 185, 0.2);
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .payment-container h2 {
      text-align: center;
      color: #13B6B9;
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1.8rem;
    }

    .form-group {
      margin-bottom: 1.4rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #FFA100;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 1rem;
      background-color: #ffffff;
      color: #000000;
    }

    .form-control[readonly] {
      background-color: #f0f0f0;
    }

    .card-element-box {
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #ffffff;
    }

    .pay-button {
      width: 100%;
      padding: 0.9rem;
      background-color: #FFA100;
      color: #000000;
      font-size: 1.1rem;
      font-weight: bold;
      border: none;
      border-radius: 10px;
      margin-top: 1rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .pay-button:hover {
      background-color: #e29600;
    }

    .pay-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .payment-error {
      color: red;
      font-weight: bold;
      margin-bottom: 1rem;
      text-align: center;
    }
  `}</style>

  <div className="payment-container">
    <h2>💳 Payment Details</h2>

    {paymentError && (
      <div className="payment-error">
        {paymentError}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input
          type="text"
          readOnly
          value={`$${selectedTotal.toFixed(2)}`}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Card Information</label>
        <div className="card-element-box">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#14213D',
                  fontFamily: 'Tinos, serif',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="pay-button"
        disabled={!stripe || loading || !clientSecret}
      >
        {loading ? 'Processing Payment...' : `Pay $${selectedTotal.toFixed(2)}`}
      </button>
    </form>
  </div>
</>
  );
};

const CardPage = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default CardPage;