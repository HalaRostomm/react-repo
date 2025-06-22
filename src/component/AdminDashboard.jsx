import React, { useEffect, useState } from "react";
import adminService from "../service/adminService";
import {
  FaCalendarCheck,
  FaUsers,
  FaPaw,
  FaFileAlt,
  FaStethoscope,
  FaHandHoldingHeart,
  FaPeopleCarry,
  FaBoxes,
  FaClipboardCheck,
} from "react-icons/fa";
import { MdOutlineHomeRepairService } from "react-icons/md";

// Styles
const cardStyle = {
  backgroundColor: "#D0D5CE", // updated card color
  color: "#333",
  borderRadius: "12px",
  padding: "25px",
  margin: "15px",
  flex: "1 1 200px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  textAlign: "center",
  fontWeight: "600",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#ffffff", // white background
  padding: "50px 60px",
  fontFamily: "'Raleway', sans-serif", // updated font
  color: "#000000",
};

const headerStyle = {
  marginBottom: "10px",
  fontSize: "3rem",
  fontWeight: "700",
  borderBottom: "3px solid #000000",
  paddingBottom: "10px",
  width: "fit-content",
};

const subheaderStyle = {
  fontSize: "1.4rem",
  fontWeight: "400",
  color: "#000000",
  marginBottom: "40px",
};

const groupHeaderStyle = {
  fontSize: "1.8rem",
  fontWeight: "700",
  color: "#000000",
  marginTop: "40px",
  marginBottom: "20px",
  borderBottom: "2px solid #000000",
  paddingBottom: "5px",
  width: "fit-content",
};

const groupGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "flex-start",
};

const numberStyle = {
  fontSize: "2.4rem",
  marginTop: "8px",
  color: "000000", // purple accent
};

const iconStyle = {
  fontSize: "3rem",
  marginBottom: "10px",
  color: "#000000", // pink accent
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
    <>
      {/* Load Raleway font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={containerStyle}>
        <h1 style={headerStyle}>Admin Dashboard</h1>
        <p style={subheaderStyle}>Here's a breakdown of Paw's Data</p>

       
        {/* Users Overview group */}
        <h2 style={groupHeaderStyle}>Users Overview</h2>
        <div style={groupGridStyle}>
          <div style={cardStyle}>
            <FaUsers style={iconStyle} />
            Owners
            <div style={numberStyle}>{data.totalUsers}</div>
          </div>
          <div style={cardStyle}>
            <FaStethoscope style={iconStyle} />
            Doctors
            <div style={numberStyle}>{data.totalDoctors}</div>
          </div>
          <div style={cardStyle}>
            <FaHandHoldingHeart style={iconStyle} />
             Service Providers
            <div style={numberStyle}>{data.totalSps}</div>
          </div>
          <div style={cardStyle}>
            <FaPeopleCarry style={iconStyle} />
            Product Providers
            <div style={numberStyle}>{data.totalPps}</div>
          </div>
        </div>
         {/* Appointments group */}
        <h2 style={groupHeaderStyle}>Appointments Overview</h2>
        <div style={groupGridStyle}>
          <div style={cardStyle}>
            <FaCalendarCheck style={iconStyle} />
            Vet Appointments
            <div style={numberStyle}>{data.totalVetAppointments}</div>
          </div>
          <div style={cardStyle}>
            <FaClipboardCheck style={iconStyle} />
            Service Appointments
            <div style={numberStyle}>{data.totalServiceAppointments}</div>
          </div>
        </div>


        {/* Content and Pets group */}
        <h2 style={groupHeaderStyle}>Content & Pets</h2>
        <div style={groupGridStyle}>
          <div style={cardStyle}>
            <FaBoxes style={iconStyle} />
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
            <MdOutlineHomeRepairService style={iconStyle} />
            Total Services
            <div style={numberStyle}>{data.totalServices}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
