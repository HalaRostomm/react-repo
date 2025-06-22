import React, { useEffect, useState } from 'react';
import PpService from '../service/ppservice';
import AuthService from '../service/authService';
import { MdNotificationsNone } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line,
} from 'recharts';

const PpDash = () => {
  const [dailyIncome, setDailyIncome] = useState([]);
  const [productRatings, setProductRatings] = useState([]);
  const [productsSales, setProductsSales] = useState([]);
  const [userSales, setUserSales] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      const user = AuthService.decodeToken(token);
      setUserId(user.appUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchDashboardData = async () => {
      try {
  const dailyIncomeResp = await PpService.getDailyIncome(userId);
  console.log("✅ Daily Income:", dailyIncomeResp.data);

  const productRatingsResp = await PpService.getRatingsOfProduct(userId);
  console.log("✅ Product Ratings:", productRatingsResp.data);

  const productsSalesResp = await PpService.getProductsSales(userId);
  console.log("✅ Product Sales:", productsSalesResp.data);

  const userSalesResp = await PpService.getUsersOrder(userId);
  console.log("✅ User Sales:", userSalesResp.data);

  const unreadNotifResp = await PpService.getUnreadCount(userId);
  const profileResp = await PpService.getUserProfile();

  setDailyIncome(dailyIncomeResp.data);
  setProductRatings(productRatingsResp.data);
  setProductsSales(productsSalesResp.data);
  setUserSales(userSalesResp.data);
  setUnreadNotificationsCount(unreadNotifResp.data);
  setUserInfo(profileResp.data);
} catch (err) {
  console.error("❌ API Error:", err);
  setError("Failed to fetch dashboard data.");
}

    };

    fetchDashboardData();
  }, [userId]);

  const incomeChart = dailyIncome.map(entry => {
    const date = Object.keys(entry)[0];
    return { date, income: entry[date] };
  });

 const ratingsChart = productRatings.map(entry => {
  const rating = Object.keys(entry)[0];
  return {
    rating,
    count: entry[rating],
  };
});

const productChart = productsSales.map(entry => {
  const product = Object.keys(entry)[0];
  return {
    product,
    sales: entry[product],
  };
});


  const userSalesChart = userSales.map((entry) => {
  const user = Object.keys(entry)[0];
  return {
    user,
    count: entry[user],
  };
});


  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      padding: '100px 40px 40px 40px',
      background: '#ffffff',
      minHeight: '100vh',
      color: '#000000',
    },
    stickyHeader: {
      width: '100%',
      backgroundColor: '#FF9800',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#000000',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    heading: {
      fontSize: '24px',
      fontWeight: '800',
    },
    icon: {
      cursor: 'pointer',
      position: 'relative',
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
    chartCard: {
      flex: 1,
      minWidth: '300px',
      maxWidth: '500px',
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      marginBottom: '40px',
    },
    chartTitle: {
      fontWeight: 800,
      fontSize: '1.5rem',
      marginBottom: 20,
      color: '#FF9800',
    },
    chartContainer: {
      height: '250px',
    },
  };

  return (
    <>
      <div style={styles.stickyHeader}>
        <div style={styles.heading}>📊 Product Provider Dashboard</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>{userInfo && `Welcome, ${userInfo.firstname}`}</span>
          {userInfo?.image && (
            <img
              src={`data:image/jpeg;base64,${userInfo.image}`}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <div style={styles.icon} onClick={() => navigate(`/pp/getnotifications/${userId}`)}>
            <MdNotificationsNone size={24} />
            {unreadNotificationsCount > 0 && (
              <span style={styles.badge}>{unreadNotificationsCount}</span>
            )}
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <section style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between' }}>
          {/* Daily Income Line Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📈 Daily Income</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#FF9800" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Ratings Histogram */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>⭐ Product Ratings</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF9800" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Sales Histogram */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📦 Product Sales</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#FF9800" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Sales Histogram */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>👤 User Sales</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userSalesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="user" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF9800" />
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
