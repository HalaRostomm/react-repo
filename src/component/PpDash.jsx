import React, { useEffect, useState } from 'react';
import PpService from '../service/ppservice';
import AuthService from '../service/authService';
import { MdNotificationsNone} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const PpDash = () => {
  const [numProducts, setNumProducts] = useState(null);
  const [buyersOrders, setBuyersOrders] = useState([]);
  const [dailyIncome, setDailyIncome] = useState([]);
  const [productsSales, setProductsSales] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AuthService.getToken();
        const user = AuthService.decodeToken(token);
        setUserId(user.appUserId);
      } catch (error) {
        console.error("❌ Failed to fetch user from token", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const response = await PpService.getUserProfile();
        setUserInfo(response.data);
      } catch {
        setError('Failed to fetch user profile');
      }
    };

    const fetchDashboardData = async () => {
      try {
        const [
          numProdResp,
          buyersOrdersResp,
          dailyIncomeResp,
          productsSalesResp,
          unreadNotifResp,
        ] = await Promise.all([
          PpService.getNumberOfProducts(userId),
          PpService.getUsersOrder(userId),
          PpService.getDailyIncome(userId),
          PpService.getProductsSales(userId),
          PpService.getUnreadCount(userId),
        ]);

        setNumProducts(numProdResp.data);
        setBuyersOrders(buyersOrdersResp.data);
        setDailyIncome(dailyIncomeResp.data);
        setProductsSales(productsSalesResp.data);
        setUnreadNotificationsCount(unreadNotifResp.data);
      } catch {
        setError('Failed to fetch dashboard data');
      }
    };

    fetchUserProfile();
    fetchDashboardData();
  }, [userId]);

  const buyersChart = buyersOrders.map(entry => {
    const name = Object.keys(entry)[0];
    return { name, orders: entry[name] };
  });

  const incomeChart = dailyIncome.map(entry => {
    const date = Object.keys(entry)[0];
    return { date, income: entry[date] };
  });

  const productChart = productsSales.map(entry => {
    const product = Object.keys(entry)[0];
    return { product, sales: entry[product] };
  });

  const styles = {
    container: {
      fontFamily: "'Roboto Slab', serif",
      padding: '100px 40px 40px 40px',
      background: '#F7F0E0',
      minHeight: '100vh',
      color: '#000000',
    },

   stickyHeader: {
  top: 0, // optional — can remove
  left: 0, // optional — can remove
  width: '100%',
  backgroundColor: '#7F7B72',
  padding: '15px 30px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 1000,
  color: '#F7F0E0',
},

    heading: {
      fontSize: '24px',
      fontWeight: 800,
      color: '#F7F0E0',
    },
    rightHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    iconsWrapper: {
      display: 'flex',
      gap: 25,
    },

  

    icon: {
      cursor: 'pointer',
      position: 'relative',
      color: '#F7F0E0',
    },
    badge: {
      position: 'absolute',
      top: -8,
      right: -10,
      backgroundColor: 'red',
      color: 'white',
      fontSize: '0.6rem',
      padding: '4px 6px',
      borderRadius: '50%',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #F7F0E0',
    },
    welcome: {
      fontWeight: 600,
      color: '#F7F0E0',
    },
    box: {
      backgroundColor: '#E5DED4',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '20px',
      width: '220px',
      marginBottom: '30px',
      fontSize: '16px',
      fontWeight: 600,
      textAlign: 'center',
    },
    error: {
      color: '#D32F2F',
      fontWeight: '700',
      marginBottom: '20px',
    },
    chartCard: {
      flex: 1,
      minWidth: '300px',
      maxWidth: '500px',
      backgroundColor: '#E5DED4',
      padding: 20,
      borderRadius: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    },
    chartTitle: {
      fontWeight: 800,
      fontSize: '1.5rem',
      marginBottom: 20,
      color: '#7F7B72',
    },
    chartContainer: {
      height: '200px',
    },
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={styles.stickyHeader}>
        <div style={styles.heading}>📊 Product Provider Dashboard</div>
        <div style={styles.rightHeader}>
          <span style={styles.welcome}>
            {userInfo && `Welcome, ${userInfo.firstname}`}
          </span>
          {userInfo?.image && (
            <img
              src={`data:image/jpeg;base64,${userInfo.image}`}
              alt="avatar"
              style={styles.avatar}
            />
          )}
          <div style={styles.iconsWrapper}>
           
            <div style={styles.icon} onClick={() => navigate(`/pp/getnotifications/${userId}`)}>
              <MdNotificationsNone size={24} />
              {unreadNotificationsCount > 0 && (
                <span style={styles.badge}>{unreadNotificationsCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.box}>
          🛒 Number of Products: {numProducts !== null ? numProducts : "Loading..."}
        </div>

        <section
          style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {/* Buyers vs Orders */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>👥 Buyers vs Orders</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buyersChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#7F7B72" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Income */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>💰 Daily Income</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#7F7B72" radius={[4, 4, 0,



0]} />
</BarChart>
</ResponsiveContainer>
</div>
</div>

      {/* Product Sales */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>📦 Product Sales</h3>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#7F7B72" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  </div>
</>
);
};

export default PpDash;