import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminService from '../service/adminService';
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
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

  const getMaxY = (data) => {
    const max = Math.max(...data.map(d => d.value));
    return Math.ceil(max / 5) * 5 || 5;
  };

  const renderBarChart = (dataSet, color, title) => (
  <div style={chartCard}>
    <h5 style={chartTitle}>
      <FaChartLine style={{ marginRight: "8px" }} />
      {title}
    </h5>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={dataSet}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="label" stroke="#000" />
        <YAxis domain={[0, getMaxY(dataSet)]} stroke="#000" />
        <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#000", color: "#000" }} />
        <Bar dataKey="value" fill="#FFA100" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const renderLineChart = (dataSet, color, title) => (
  <div style={chartCard}>
    <h5 style={chartTitle}>
      <FaChartLine style={{ marginRight: "8px" }} />
      {title}
    </h5>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={dataSet}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="label" stroke="#000" />
        <YAxis stroke="#000" />
        <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#000", color: "#000" }} />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#FFA100" strokeWidth={2} />
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
          {renderBarChart(ratings, '#000000', 'Product Ratings')}
          {renderBarChart(productSales, '#000000', 'Product Sales')}
          {renderBarChart(usersSales, '#000000', 'Users Sales')}
          {renderLineChart(dailyIncome, '#000000', 'Daily Income')}
        </div>
      )}
    </div>
  );
};

// 💡 Styling
const dashboardWrapper = {
  backgroundColor: "#ffffff",
  minHeight: "100vh",
  padding: "40px 20px",
  color: "#000000",
  fontFamily: "'Raleway', sans-serif",
};

const pageTitle = {
  textAlign: "center",
  marginBottom: "40px",
  color: "#D0D5CE",
  fontWeight: "700",
  fontSize: "26px",
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "30px",
};

const chartCard = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #D0D5CE",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const chartTitle = {
  color: "#D0D5CE",
  marginBottom: "15px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
};

const loadingStyle = {
  textAlign: "center",
  color: "#555",
  marginTop: "80px",
};

export default PpDashAdmin;
