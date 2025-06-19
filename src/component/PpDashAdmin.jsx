import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminService from '../service/adminService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaSpinner, FaChartLine } from 'react-icons/fa';

const PpDashAdmin = () => {
  const { ppId } = useParams();

  const [ratings, setRatings] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [usersSales, setUsersSales] = useState([]);
  const [dailyIncome, setDailyIncome] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const [ratingsRes, productSalesRes, usersSalesRes, dailyIncomeRes] = await Promise.all([
        adminService.getProductRatings(ppId),
        adminService.getProductSales(ppId),
        adminService.getUsersOrder(ppId),
        adminService.getDailyIncome(ppId),
      ]);

      // Transform each dataset to fit { label, value }
      const transform = (arr) =>
        arr.map((item) => {
          const key = Object.keys(item)[0];
          return { label: key, value: item[key] };
        });

      setRatings(transform(ratingsRes.data));
      setProductSales(transform(productSalesRes.data));
      setUsersSales(transform(usersSalesRes.data));
      setDailyIncome(transform(dailyIncomeRes.data));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [ppId]);


  const renderChart = (dataSet, color, title) => (
    <div style={chartCard}>
      <h5 style={chartTitle}>
        <FaChartLine style={{ marginRight: "8px" }} />
        {title}
      </h5>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dataSet}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="label" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: "#1e1e2f", borderColor: "#6f42c1", color: "#fff" }} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={dashboardWrapper}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <h3 style={pageTitle}>📊 Product Provider Dashboard</h3>

      {isLoading ? (
        <div style={loadingStyle}>
          <FaSpinner
            className="spinner"
            style={{
              fontSize: "24px",
              marginBottom: "10px",
              animation: "spin 1s linear infinite"
            }}
          />
          Loading charts...
        </div>
      ) : (
        <div style={chartGrid}>
          {renderChart(ratings, '#00bcd4', 'Product Ratings')}
          {renderChart(productSales, '#4caf50', 'Product Sales')}
          {renderChart(usersSales, '#ffc107', 'Users Sales')}
          {renderChart(dailyIncome, '#ff5722', 'Daily Income')}
        </div>
      )}
    </div>
  );
};

// 💡 Styling
const dashboardWrapper = {
  backgroundColor: "#0f172a",
  minHeight: "100vh",
  padding: "40px 20px",
  color: "#fff",
  fontFamily: "'Segoe UI', sans-serif",
};

const pageTitle = {
  textAlign: "center",
  marginBottom: "40px",
  color: "#8e6dda",
  fontWeight: "700",
  fontSize: "26px",
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "30px",
};

const chartCard = {
  backgroundColor: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};

const chartTitle = {
  color: "#e0e0e0",
  marginBottom: "15px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
};

const loadingStyle = {
  textAlign: "center",
  color: "#aaa",
  marginTop: "80px",
};

export default PpDashAdmin;
