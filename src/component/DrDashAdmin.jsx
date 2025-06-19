import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import adminService from '../service/adminService';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Bar, Line } from 'react-chartjs-2';
import 'react-circular-progressbar/dist/styles.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaChartLine, FaUserFriends, FaCalendarCheck } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const DrDashAdmin = () => {
  const { doctorId } = useParams();
  const [booked, setBooked] = useState(0);
  const [available, setAvailable] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [percentage, setPercentage] = useState(0);
  const [users, setUsers] = useState(0);
  const [attendance, setAttendance] = useState(0);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [res1, res2, res3, res4, res5] = await Promise.all([
        adminService.getBookedAppointmentsInsights(doctorId),
        adminService.getBookedAppointmentsPerDate(doctorId),
        adminService.getBookingPercentage(doctorId),
        adminService.getNumberOfDifferentUsers(doctorId),
        adminService.getAttendancePercentage(doctorId)
      ]);

      const fetchedAppointments = res1.data;
      const daily = res2.data.map(entry => ({ label: entry.selectedDate, value: entry.count || 0 }));

      let tempBooked = 0, tempAvailable = 0;
      fetchedAppointments.forEach(app => app === true ? tempBooked++ : tempAvailable++);

      setBooked(tempBooked);
      setAvailable(tempAvailable);
      setAppointments(fetchedAppointments);
      setOriginalData(daily);
      setPercentage(res3.data);
      setUsers(res4.data);
      setAttendance(res5.data);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const chartData = {
    labels: originalData.map(d => d.label),
    datasets: [
      {
        label: 'Appointments',
        data: originalData.map(d => d.value),
        borderColor: '#8e6dda',
        backgroundColor: 'rgba(142,109,218,0.3)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#e0e0e0' },
        grid: { color: '#334155' }
      },
      x: {
        ticks: { color: '#e0e0e0' },
        grid: { color: '#334155' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#c3baf0' }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#8e6dda',
        borderWidth: 1
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      padding: "40px 20px",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <h3 style={{ textAlign: "center", marginBottom: 30, color: "#8e6dda", fontWeight: 700 }}>
        🩺 Doctor Dashboard
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <StatCard icon={<FaCalendarCheck />} title="Booked" value={booked} color="#6f42c1" />
        <StatCard icon={<FaCalendarCheck />} title="Available" value={available} color="#8e6dda" />
        <StatCard icon={<FaUserFriends />} title="Unique Users" value={users} color="#00bcd4" />
        <CircleStat title="Attendance" value={attendance} color="#00bcd4" />
      </div>

      {/* New: Side-by-side chart + activity percentage */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'space-between',
        marginBottom: 40
      }}>
        <CircleStat title="Activity %" value={percentage} color="#8e6dda" />

        <div style={{
          flex: 1,
          minWidth: 300,
          backgroundColor: '#1e293b',
          borderRadius: 16,
          padding: 16,
          height: 280,
          boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
        }}>
          <h2 style={{ color: '#8e6dda', textAlign: 'center', fontSize: 18, marginBottom: 10 }}>Booked Appointments</h2>
          <div style={{ height: 200 }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div style={{
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  }}>
    <div style={{ fontSize: 22, color, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    <div style={{ fontSize: 14, color: "#ccc", marginTop: 6 }}>{title}</div>
  </div>
);

const CircleStat = ({ title, value, color }) => (
  <div style={{
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    minWidth: 220,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  }}>
    <div style={{ width: 100, height: 100, margin: "0 auto 10px" }}>
      <CircularProgressbar
        value={value}
        text={`${value.toFixed(1)}%`}
        styles={buildStyles({
          pathColor: color,
          textColor: "#fff",
          trailColor: "#2e374c"
        })}
      />
    </div>
    <div style={{ color: "#ccc", fontWeight: "500", marginTop: 6 }}>{title}</div>
  </div>
);

export default DrDashAdmin;