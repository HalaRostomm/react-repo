import React, { useEffect, useState } from "react";
import adminService from "../service/adminService";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useParams } from "react-router-dom";
import { FaPaw, FaClipboardList } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const UserDashAdmin = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState(0);
  const [pets, setPets] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    adminService.getNumberOfPosts(userId).then(res => setPosts(res.data));
    adminService.getNumberOfPets(userId).then(res => setPets(res.data));

    adminService.getBookedAppointmentsByType(userId).then(res => {
      const formatted = res.data.map(item => ({ label: item.type, value: item.count }));
      setAppointments(formatted);
    });

    adminService.getPurchases(userId).then(res => {
      const formatted = res.data.map(item => ({
        label: item.date,
        value: item.total,
      }));
      setPurchases(formatted);
    });
  }, [userId]);

  const getChartData = (data, label, isLine = false) => ({
    labels: data.map(d => d.label),
    datasets: [
      {
        label,
        data: data.map(d => d.value),
        backgroundColor: isLine ? "rgba(142, 109, 218, 0.2)" : "#8e6dda",
        borderColor: "#8e6dda",
        fill: isLine,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#fff",
      },
    ],
  });

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        padding: "30px 16px",
        color: "#e0e0e0",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h3 style={{ color: "#8e6dda", textAlign: "center", fontWeight: 700, marginBottom: 30 }}>
        👤 User Insights Dashboard
      </h3>

      {/* Info cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: 30 }}>
        <div
          style={{
            flex: "1",
            minWidth: "160px",
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            borderLeft: "4px solid #34d399",
          }}
        >
          <h6 style={{ color: "#6ee7b7", marginBottom: "8px" }}>
            <FaClipboardList style={{ marginRight: "6px" }} />
            Posts
          </h6>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>{posts}</div>
        </div>

        <div
          style={{
            flex: "1",
            minWidth: "160px",
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            borderLeft: "4px solid #8e6dda",
          }}
        >
          <h6 style={{ color: "#c4b5fd", marginBottom: "8px" }}>
            <FaPaw style={{ marginRight: "6px" }} />
            Pets
          </h6>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>{pets}</div>
        </div>
      </div>

      {/* Appointments Chart */}
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h6 style={{ marginBottom: "12px", color: "#6ee7b7" }}>📅 Appointments</h6>
        <div style={{ maxWidth: "100%", height: "250px" }}>
          <Bar data={getChartData(appointments, "Appointments")} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Purchases Chart */}
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h6 style={{ marginBottom: "12px", color: "#8e6dda" }}>💸 Purchases</h6>
        <div style={{ maxWidth: "100%", height: "250px" }}>
          <Line data={getChartData(purchases, "Purchases", true)} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default UserDashAdmin;
