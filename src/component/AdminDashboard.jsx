import React, { useEffect, useState } from "react";
import adminService from "../service/adminService";
import {
  FaCalendarCheck,
  FaUsers,
  FaPaw,
  FaConciergeBell,
  FaBoxOpen,
  FaFileAlt,
  FaCogs,
  FaVial,
  FaStethoscope,
} from "react-icons/fa";

// Styles
const cardStyle = {
  backgroundColor: "#2c2c3e",
  color: "#ffffff",
  borderRadius: "12px",
  padding: "25px",
  margin: "15px",
  flex: "1 1 240px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
  textAlign: "center",
  fontWeight: "600",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to right, #141e30, #243b55)",
  padding: "50px 60px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: "white",
};

const headerStyle = {
  marginBottom: "10px",
  fontSize: "3rem",
  fontWeight: "700",
  borderBottom: "3px solid #b388ff",
  paddingBottom: "10px",
  width: "fit-content",
  color: "#ffffff",
};

const subheaderStyle = {
  fontSize: "1.4rem",
  fontWeight: "400",
  color: "#d1c4e9",
  marginBottom: "40px",
};

const gridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "space-between",
};

const numberStyle = {
  fontSize: "2.4rem",
  marginTop: "8px",
  color: "#b388ff",
};

const iconStyle = {
  fontSize: "3rem",
  marginBottom: "10px",
  color: "#ff64b5", // rose-purple highlight
};

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalVetAppointments: 0,
    totalServiceAppointments: 0,
    totalUsers: 0,
    totalSps: 0,
    totalPps: 0,
    totalDoctors: 0,
    totalProducts: 0,
    totalPosts: 0,
    totalPets: 0,
    totalServices: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          adminService.getTotalVetAppointments(),
          adminService.getTotalServiceAppointments(),
          adminService.getTotalUsers(),
          adminService.getTotalSps(),
          adminService.getTotalPps(),
          adminService.getTotalDoctors(),
          adminService.getTotalProducts(),
          adminService.getTotalPosts(),
          adminService.getTotalPets(),
          adminService.getTotalServices(),
        ]);

        setData({
          totalVetAppointments: responses[0].data,
          totalServiceAppointments: responses[1].data,
          totalUsers: responses[2].data,
          totalSps: responses[3].data,
          totalPps: responses[4].data,
          totalDoctors: responses[5].data,
          totalProducts: responses[6].data,
          totalPosts: responses[7].data,
          totalPets: responses[8].data,
          totalServices: responses[9].data,
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Admin Dashboard</h1>
      <p style={subheaderStyle}>Here's a breakdown of Paw's Data</p>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <FaCalendarCheck style={iconStyle} />
          Total Vet Appointments
          <div style={numberStyle}>{data.totalVetAppointments}</div>
        </div>
        <div style={cardStyle}>
          <FaConciergeBell style={iconStyle} />
          Total Service Appointments
          <div style={numberStyle}>{data.totalServiceAppointments}</div>
        </div>
        <div style={cardStyle}>
          <FaUsers style={iconStyle} />
          Total Users
          <div style={numberStyle}>{data.totalUsers}</div>
        </div>
        <div style={cardStyle}>
          <FaPaw style={iconStyle} />
          Total SPs
          <div style={numberStyle}>{data.totalSps}</div>
        </div>
        <div style={cardStyle}>
          <FaBoxOpen style={iconStyle} />
          Total PPs
          <div style={numberStyle}>{data.totalPps}</div>
        </div>
        <div style={cardStyle}>
          <FaStethoscope style={iconStyle} />
          Total Doctors
          <div style={numberStyle}>{data.totalDoctors}</div>
        </div>
        <div style={cardStyle}>
          <FaBoxOpen style={iconStyle} />
          Total Products
          <div style={numberStyle}>{data.totalProducts}</div>
        </div>
        <div style={cardStyle}>
          <FaFileAlt style={iconStyle} />
          Total Posts
          <div style={numberStyle}>{data.totalPosts}</div>
        </div>
        <div style={cardStyle}>
          <FaPaw style={iconStyle} />
          Total Pets
          <div style={numberStyle}>{data.totalPets}</div>
        </div>
        <div style={cardStyle}>
          <FaCogs style={iconStyle} />
          Total Services
          <div style={numberStyle}>{data.totalServices}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
