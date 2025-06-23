import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userservice from '../service/userservice';

const MyOrderInfo = () => {
  const { orderId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
    try {
  const [orderRes] = await Promise.all([userservice.getOrderItems(orderId)]);
  console.log("Order items received:", orderRes.data);
  setItems(orderRes.data);
} catch (err) {
  console.error('Error fetching order items:', err);
} finally {
  setLoading(false);
}

    };

    fetchOrderItems();
  }, [orderId]);

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

  .order-container {
    max-width: 1100px;
    margin: 3rem auto;
    background: #FFFFFF;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  .order-title {
    color: #13B6B9;
    font-size: 2.2rem;
    margin-bottom: 2rem;
    font-weight: 600;
    text-align: center;
  }

  .order-card {
    display: flex;
    gap: 1.5rem;
    background-color: rgba(19, 182, 185, 0.2); /* 13B6B9 with 20% opacity */
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease-in-out;
    height: 100%;
  }

  .order-card:hover {
    transform: translateY(-3px);
  }

  .product-img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 12px;
    border: 3px solid #FFA100;
    background-color: #FFFFFF;
  }

  .card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-title {
    font-size: 1.25rem;
    color: #000000;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .card-text {
    color: #000000;
    margin: 0.2rem 0;
  }

  .spinner-border {
    width: 3rem;
    height: 3rem;
  }

  @media (max-width: 768px) {
    .order-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .product-img {
      width: 100%;
      max-width: 200px;
      height: auto;
    }
  }
`}</style>

      <div className="order-container">
        <h3 className="order-title">🛒 Order Details</h3>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center">No items found for this order.</p>
        ) : (
          <div className="row">
           {items.map((item) => (
  <div key={item.orderItemsId || item.id } className="col-md-6 mb-4">
                <div className="order-card">
                  <img
                    src={item.product.image ? `data:image/jpeg;base64,${item.product.image}` : 'https://via.placeholder.com/150'}
                    alt={item.product?.productName}
                    className="product-img"
                  />
              <div className="card-info">
  <h5 className="card-title">{item.product?.productName}</h5>
  <p className="card-text">Quantity: <strong>{item.quantity}</strong></p>

  <p className="card-text" style={{ marginBottom: 8 }}>
  <strong>Color:</strong>{" "}
  <span style={{ color: '#555' }}>
    {(() => {
      const entry = Object.entries(item.product.priceByColorAndSize || {}).find(([k, v]) => v === item.price);
      return entry ? entry[0].split('-')[0] : 'N/A';
    })()}
  </span>
</p>

<p className="card-text" style={{ marginBottom: 8 }}>
  <strong>Size:</strong>{" "}
  <span style={{ color: '#555' }}>
    {(() => {
      const entry = Object.entries(item.product.priceByColorAndSize || {}).find(([k, v]) => v === item.price);
      return entry ? entry[0].split('-')[1] : 'N/A';
    })()}
  </span>
</p>


  <p className="card-text" style={{ marginBottom: 8 }}>
    <strong>Category:</strong>{" "}
    <span style={{ color: '#555' }}>
      {item.product?.productCategory?.MSCategory
        ? Object.entries(item.product.productCategory.MSCategory)
            .map(([_, value]) => value)
            .join(', ')
        : 'Loading category...'}
    </span>
  </p>

  <p className="card-text">
    <strong>Price Per Unit:</strong>{" "}
    <span style={{ color: '#555' }}>${item.price.toFixed(2)}</span>
  </p>
</div>



                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrderInfo;
