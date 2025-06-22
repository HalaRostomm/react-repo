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
  const [purchaseMaxY, setPurchaseMaxY] = useState(10);

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

      // Calculate max Y based on formula: ceil(max * 2.5 / 5) * 5
      const max = Math.max(...formatted.map(item => item.value), 1);
      const scaled = Math.ceil((max * 2.5) / 5) * 5;
      setPurchaseMaxY(scaled);
    });
  }, [userId]);

  const getChartData = (data, label, isLine = false) => ({
    labels: data.map(d => d.label),
    datasets: [
      {
        label,
        data: data.map(d => d.value),
        backgroundColor: isLine ? "rgba(255, 161, 0, 0.2)" : "#FFA100",
        borderColor: "#FFA100",
        fill: isLine,
        tension: isLine ? 0 : 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#FFA100",
      },
    ],
  });

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "30px 16px",
        color: "#000",
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <h3 style={{ color: "#D0D5CE", textAlign: "center", fontWeight: 700, marginBottom: 30 }}>
        👤 User Insights Dashboard
      </h3>

      {/* Info cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
        {[
          { label: "Posts", value: posts, icon: <FaClipboardList /> },
          { label: "Pets", value: pets, icon: <FaPaw /> },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            style={{
              flex: "0 1 180px",
              backgroundColor: "#D0D5CE",
              padding: "16px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h6 style={{ color: "#000000", marginBottom: "8px" }}>
              {icon} {label}
            </h6>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#000000" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {/* Appointments Chart */}
        <div
          style={{
            flex: "1 1 400px",
            maxWidth: "500px",
            backgroundColor: "#f4f4f4",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h6 style={{ marginBottom: "12px", color: "#D0D5CE" }}>📅 Appointments</h6>
          <div style={{ height: "220px" }}>
            <Bar
              data={getChartData(appointments, "Appointments")}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: "#000" } },
                },
                scales: {
                  x: { ticks: { color: "#000" } },
                  y: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    ticks: { stepSize: 2, color: "#000" },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Purchases Line Chart */}
        <div
          style={{
            flex: "1 1 400px",
            maxWidth: "500px",
            backgroundColor: "#f4f4f4",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h6 style={{ marginBottom: "12px", color: "#D0D5CE" }}>💸 Purchases</h6>
          <div style={{ height: "220px" }}>
            <Line
              data={getChartData(purchases, "Purchases", true)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: "#000" } },
                },
                scales: {
                  x: { ticks: { color: "#000" } },
                  y: {
                    beginAtZero: true,
                    min: 0,
                    max: purchaseMaxY,
                    ticks: { stepSize: 5, color: "#000" },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashAdmin;
