import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import adminService from '../service/adminService';
import LiquidFillGauge from 'react-liquid-gauge';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaCalendarCheck, FaUserFriends } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

  const maxY = Math.ceil(Math.max(...originalData.map(d => d.value), 1) * 2.5 / 5) * 5;

  const chartData = {
    labels: originalData.map(d => d.label),
    datasets: [
      {
        label: 'Appointments',
        data: originalData.map(d => d.value),
        borderColor: '#FFA100',
        backgroundColor: 'rgba(255, 161, 0, 0.3)',
        fill: true,
        tension: 0,
        pointBackgroundColor: '#FFA100'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: maxY,
        ticks: { stepSize: 2, color: '#000' },
        grid: { color: '#ccc' }
      },
      x: {
        ticks: { color: '#000' },
        grid: { color: '#ccc' }
      }
    },
    plugins: {
      legend: { labels: { color: '#000' } },
      tooltip: {
        backgroundColor: '#D0D5CE',
        borderColor: '#000',
        borderWidth: 1
      }
    }
  };

  // Individual wave stat components
  const AttendanceStat = (
    <WaveCircleStat
      title="Attendance Activity"
      value={attendance}
      color="#13b6b9"
    />
  );

  const PercentageStat = (
    <WaveCircleStat
      title="Percentage Of Activity %"
      value={percentage}
      color="#13b6b9"
    />
  );

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      padding: "40px 20px",
      color: "#000",
      fontFamily: "'Raleway', sans-serif"
    }}>
      <h3 style={{ textAlign: "center", marginBottom: 30, color: "#D0D5CE", fontWeight: 700 }}>
        🩺 Doctor Insights
      </h3>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <StatCard icon={<FaCalendarCheck />} title="Booked" value={booked} color="#000" />
        <StatCard icon={<FaCalendarCheck />} title="Available" value={available} color="#000" />
        <StatCard icon={<FaUserFriends />} title="Visitors" value={users} color="#000" />
      </div>

     <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '30px',
  flexWrap: 'wrap',
  marginBottom: '40px'
}}>
  <WaveCircleStat title="Attendance Activity" value={attendance} color="#13b6b9" />
  <WaveCircleStat title="Percentage Of Activity %" value={percentage} color="#13b6b9" />
</div>



      {/* Line chart section */}
      <div style={{
        width: "600px",
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 16,
        height: 300,
        boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#000000', textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
          Booked Appointments / Date
        </h2>
        <div style={{ height: 200 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div style={{
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  }}>
    <div style={{ fontSize: 22, color, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    <div style={{ fontSize: 14, color: "#333", marginTop: 6 }}>{title}</div>
  </div>
);
const WaveCircleStat = ({ title, value, color }) => {
  const radius = 80;
  const size = radius * 2;

  return (
    <div style={{
      backgroundColor: "#f5f5f5",
      borderRadius: "12px",
      padding: "20px",
      width: size + 40,
      height: size + 70,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{
        width: size,
        height: size,
      }}>
        <LiquidFillGauge
          width={size}
          height={size}
          radius={radius}
          value={value}
          percent="%"
          textStyle={{ fontSize: 24, fill: "#000" }}
          waveTextStyle={{ fill: "#fff", fontSize: 22 }}
          riseAnimation
          waveAnimation
          waveFrequency={2}
          waveAmplitude={3}
          circleStyle={{ fill: "#fff" }}
          waveColor={color}
          textColor="#000"
        />
      </div>
      <div style={{
        marginTop: 12,
        fontWeight: 600,
        fontSize: 14,
        textAlign: "center",
        color: "#000"
      }}>
        {title}
      </div>
    </div>
  );
};



export default DrDashAdmin;
