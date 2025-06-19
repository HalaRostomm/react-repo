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
    return Object.entries(orderStatuses).filter(([orderId, order]) => {
      if (selectedFilter === 'done') return order.done;
      if (selectedFilter === 'undone') return !order.done;
      return true;
    });
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  if (loading) {
    return (
      <div className="text-center mt-5" style={{ fontFamily: 'Roboto Slab', color: '#7F7B72' }}>
        <Spinner animation="border" variant="warning" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Roboto Slab',
      backgroundColor: '#F7F0E0',
      color: '#000000'
    }}>
      <div style={{ maxWidth: '960px', margin: 'auto' }}>
        <h1 style={{ color: '#7F7B72', fontWeight: 'bold', fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>
          Orders
        </h1>

        <div className="d-flex justify-content-center gap-3 mb-4">
          <Button
            variant={selectedFilter === 'done' ? 'success' : 'outline-success'}
            onClick={() => handleFilterChange('done')}
          >
            Done
          </Button>
          <Button
            variant={selectedFilter === 'undone' ? 'danger' : 'outline-danger'}
            onClick={() => handleFilterChange('undone')}
          >
            Undone
          </Button>
          <Button
            variant={selectedFilter === 'all' ? 'warning' : 'outline-warning'}
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
                  border: '1px solid #ddd',
                  backgroundColor: '#F1EADC',
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
                      backgroundColor: '#E5DED4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16,
                      fontSize: 24,
                      color: '#7F7B72'
                    }}
                  >
                    <i className="bi bi-receipt"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-1" style={{ color: '#000000' }}>{customer?.fullName || 'Customer'}</h5>
                    <p className="mb-0" style={{ color: '#7F7B72' }}>Order No: {orderId}</p>
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
