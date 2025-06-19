import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import adminService from '../service/adminService';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaStar, FaCalendarCheck, FaCog, FaChartBar } from 'react-icons/fa';

const SpDashAdmin = () => {
  const { spId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [appointmentsServices, setAppointmentsServices] = useState([]);
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [servicesRes, ratingsRes, appointmentsRes] = await Promise.all([
          adminService.countServices(spId),
          adminService.getServiceRatings(spId),
          adminService.getAppointmentsPerService(spId),
        ]);

        const parseData = (arr) =>
          arr.map(item => {
            const key = Object.keys(item)[0];
            return { label: key, value: item[key] };
          });

        setServices(servicesRes.data);
        setRatings(parseData(ratingsRes.data));
        setAppointmentsServices(parseData(appointmentsRes.data));
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [spId]);

  const getMaxY = (data) => {
    if (!data.length) return 0;
    const max = Math.max(...data.map(d => d.value));
    return Math.ceil(max / 5) * 5 || 5;
  };

  const Card = ({ title, icon, children, color = "#6f42c1" }) => (
    <div style={{
      backgroundColor: "#1e293b",
      borderRadius: "12px",
      padding: "20px",
      margin: "15px 0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      color: "#fff",
      flex: 1,
      minWidth: 280
    }}>
      <h5 style={{ marginBottom: 15, color }}>
        {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
        {title}
      </h5>
      {children}
    </div>
  );

  const StatCard = ({ title, count, icon, bgColor }) => (
    <div style={{
      backgroundColor: bgColor,
      color: "#fff",
      padding: 16,
      margin: "0 10px",
      flex: 1,
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 140,
      height: 120,
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    }}>
      <div style={{ fontSize: 26 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: "bold" }}>{count}</div>
      <div style={{ fontSize: 14 }}>{title}</div>
    </div>
  );

  const ChartWrapper = ({ data, color, isLine }) => (
    <ResponsiveContainer width="100%" height={220}>
      {isLine ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" stroke="#ccc" />
          <YAxis domain={[0, getMaxY(data)]} stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} activeDot={{ r: 6 }} />
        </LineChart>
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" stroke="#ccc" />
          <YAxis domain={[0, getMaxY(data)]} stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );

  if (isLoading) {
    return <div style={{ color: '#a78bfa', textAlign: 'center', marginTop: 60 }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: 20 }}>
      <h3 style={{
        color: '#a78bfa',
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 30
      }}>
        <FaChartBar style={{ marginRight: 10 }} />
        Service Provider Dashboard
      </h3>

      {/* Stat Cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 30
      }}>
        <StatCard title="Services" count={services} icon={<FaCog />} bgColor="#6f42c1" />
        <StatCard title="Ratings" count={ratings.length} icon={<FaStar />} bgColor="#8e6dda" />
        <StatCard title="Appointments" count={appointmentsServices.length} icon={<FaCalendarCheck />} bgColor="#845ef7" />
      </div>

      {/* Charts */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        <Card title="Ratings" icon={<FaStar />} color="#8e6dda">
          <ChartWrapper data={ratings} color="#8e6dda" isLine={false} />
        </Card>

        <Card title="Appointments / Service" icon={<FaCalendarCheck />} color="#845ef7">
          <ChartWrapper data={appointmentsServices} color="#6f42c1" isLine={false} />
        </Card>
      </div>
    </div>
  );
};

export default SpDashAdmin;
