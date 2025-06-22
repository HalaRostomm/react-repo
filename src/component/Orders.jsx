import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ppservice from '../service/ppservice';
import { Button, Spinner } from 'react-bootstrap';

const Orders = () => {
  const { ppId } = useParams();
  const [ordersMap, setOrdersMap] = useState({});
  const [customers, setCustomers] = useState({});
  const [orderStatuses, setOrderStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ppservice.getOrders(ppId);
        const orders = response.data;
        setOrdersMap(orders);

        const orderIds = Object.keys(orders);
        for (const orderId of orderIds) {
          fetchCustomer(orderId);
          fetchOrderStatus(orderId);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading orders:', error);
        setLoading(false);
      }
    };

    if (ppId) {
      fetchOrders();
    }
  }, [ppId]);

  const fetchCustomer = async (orderId) => {
    try {
      const response = await ppservice.getOrderInfo(orderId);
      setCustomers(prev => ({ ...prev, [orderId]: response.data }));
    } catch (error) {
      console.error(`Error fetching customer for order ${orderId}:`, error);
    }
  };

  const fetchOrderStatus = async (orderId) => {
    try {
      const response = await ppservice.getOrder(orderId);
      setOrderStatuses(prev => ({ ...prev, [orderId]: response.data }));
    } catch (error) {
      console.error(`Error fetching status for order ${orderId}:`, error);
    }
  };

  const getFilteredOrders = () => {
    return Object.entries(orderStatuses).filter(([_, order]) => {
      if (selectedFilter === 'done') return order.done;
      if (selectedFilter === 'undone') return !order.done;
      return true;
    });
  };

  const handleFilterChange = (filter) => setSelectedFilter(filter);

  const primary = '#FCA311';
  const black = '#000000';
  const white = '#FFFFFF';

  if (loading) {
    return (
      <div className="text-center mt-5" style={{ fontFamily: 'Poppins, sans-serif', color: black }}>
        <Spinner animation="border" style={{ color: primary }} />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: white,
      color: black
    }}>
      <div style={{ maxWidth: '960px', margin: 'auto' }}>
        <h1 style={{
          color: primary,
          fontWeight: 'bold',
          fontSize: '3rem',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Orders
        </h1>

        <div className="d-flex justify-content-center gap-3 mb-4">
          <Button
            style={{
              backgroundColor: selectedFilter === 'done' ? primary : white,
              color: selectedFilter === 'done' ? black : primary,
              border: `2px solid ${primary}`,
              fontWeight: '600',
              borderRadius: '8px'
            }}
            onClick={() => handleFilterChange('done')}
          >
            Done
          </Button>
          <Button
            style={{
              backgroundColor: selectedFilter === 'undone' ? primary : white,
              color: selectedFilter === 'undone' ? black : primary,
              border: `2px solid ${primary}`,
              fontWeight: '600',
              borderRadius: '8px'
            }}
            onClick={() => handleFilterChange('undone')}
          >
            Undone
          </Button>
          <Button
            style={{
              backgroundColor: selectedFilter === 'all' ? primary : white,
              color: selectedFilter === 'all' ? black : primary,
              border: `2px solid ${primary}`,
              fontWeight: '600',
              borderRadius: '8px'
            }}
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
        </div>

        {getFilteredOrders().length === 0 ? (
          <p className="text-center">No orders found for this filter.</p>
        ) : (
          getFilteredOrders().map(([orderId, order]) => {
            const customer = customers[orderId];
            return (
              <div
                key={orderId}
                className="card mb-3 p-3 shadow-sm"
                style={{
                  borderRadius: '20px',
                  border: `1px solid ${primary}`,
                  backgroundColor: white,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onClick={() => navigate(`/pp/getorderinfo/${orderId}`)}
              >
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16,
                      fontSize: 24,
                      color: black
                    }}
                  >
                    <i className="bi bi-receipt"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-1" style={{ color: black }}>{customer?.fullName || 'Customer'}</h5>
                    <p className="mb-0" style={{ color: primary }}>Order No: {orderId}</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={order.done}
                      readOnly
                      style={{ transform: 'scale(1.3)' }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
