import React, { useState, useEffect } from 'react';
import spservice from '../service/spservice';
import Calendar from 'react-calendar';
import { useParams, useNavigate } from "react-router-dom";
import { MdNotificationsNone, MdMessage } from 'react-icons/md';
import 'react-calendar/dist/Calendar.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SpDash = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState('');
  const [services, setServices] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [appointmentsPerService, setAppointmentsPerService] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState('');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const navigate = useNavigate();

  const colors = {
    background: '#E7ECEF',
    headerText: '#274C77',
    chartBar: '#6096BA',
    sectionBg: '#A3CEF1',
    secondaryText: '#8B8C89'
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@900&display=swap";
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const fetchAppUserId = async () => {
      try {
        const token = await authService.getToken();
        setToken(token);
        if (token) {
          const decodedToken = jwtDecode(token);
          if (decodedToken.appUserId) setUserId(decodedToken.appUserId);
        }
      } catch (error) {
        console.error("Error fetching ID:", error);
      }
    };
    fetchAppUserId();
  }, []);

  useEffect(() => {
    if (!userId || !token) return;

    spservice.getUserProfile().then((res) => setUserInfo(res)).catch(() => setError('❌ Failed to fetch user profile'));
    spservice.getCountServicesBySp(userId).then(res => setServices(res.data));
    spservice.getratingsOfServiceByName(userId).then(res => setRatings(res.data));
    spservice.getAppointmentsPerServiceBySp(userId).then(res => setAppointmentsPerService(res.data));
    spservice.getAppointmentsBySp(userId).then(res => setAppointments(res.data));
    spservice.getUnreadCount(userId).then(res => setUnreadNotificationsCount(res.data));
  }, [userId, token]);

  const appointmentsToday = appointments.filter(app => {
    const appDate = new Date(app.selectedDate);
    return (
      appDate.toDateString() === selectedDate.toDateString() &&
      app.booked === true
    );
  });

  const buildChartData = (data) => {
    const labels = data.map(entry => Object.keys(entry)[0]);
    const values = data.map(entry => Object.values(entry)[0]);

    return {
      labels,
      datasets: [
        {
          label: 'Count',
          data: values,
          backgroundColor: colors.chartBar,
          borderRadius: 6,
          barThickness: 30, // smaller bars
        },
      ],
    };
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: colors.background,
      minHeight: '100vh',
      padding: '30px 40px',
      color: colors.headerText,
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
      }}>
        <h1 style={{ fontSize: '2.8rem', margin: 0, fontWeight: 900 }}>
          Dashboard
        </h1>
        <div style={{ display: 'flex', gap: 25 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/sp/chats/${userId}`)}>
            <MdMessage size={24} />
          </div>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate(`/sp/getnotifications/${userId}`)}>
            <MdNotificationsNone size={24} />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -10,
                backgroundColor: 'red',
                color: 'white',
                fontSize: '0.6rem',
                padding: '4px 6px',
                borderRadius: '50%',
              }}>{unreadNotificationsCount}</span>
            )}
          </div>
        </div>
      </header>

      <section style={{
        marginBottom: 40,
        borderRadius: 12,
        backgroundColor: colors.sectionBg,
        padding: '30px 40px',
        boxShadow: '0 4px 16px rgb(0 0 0 / 0.1)',
      }}>
        <p style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>
          Total Services: {services}
        </p>
      </section>

      <section style={{
        marginBottom: 40,
        display: 'flex',
        gap: 50,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}>
        <div style={{
          flex: '1 1 320px',
          backgroundColor: colors.sectionBg,
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 16px rgb(0 0 0 / 0.1)',
        }}>
          <h3 style={{ fontWeight: 900, marginBottom: 16, fontSize: '1.6rem' }}>
            Select Date
          </h3>
          <Calendar value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div style={{
          flex: '1 1 320px',
          backgroundColor: colors.sectionBg,
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 4px 16px rgb(0 0 0 / 0.1)',
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: 16 }}>
            Today's Appointments
          </h3>
          {appointmentsToday.length === 0 ? (
            <p style={{ fontSize: '1.2rem', color: colors.secondaryText }}>
              No appointments today.
            </p>
          ) : (
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '1.1rem',
            }}>
              {appointmentsToday.map((appt, idx) => (
                <li key={idx} style={{
                  marginBottom: 12,
                  borderBottom: `1px solid ${colors.chartBar}`,
                  paddingBottom: 8,
                }}>
                  <strong>Time:</strong> {appt.startTime} <br />
                  <strong>Service:</strong> {appt.service?.name || 'N/A'}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

     {/* Charts Side by Side */}
<section style={{
  display: 'flex',
  gap: '40px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginBottom: '40px',
}}>
  {/* Ratings per Service */}
  <div style={{
    flex: 1,
    minWidth: '300px',
    maxWidth: '500px',
    backgroundColor: '#E7ECEF',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  }}>
    <h3 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: 20, color: '#274C77' }}>
      Ratings per Service
    </h3>
    {ratings.length > 0 ? (
      <div style={{ height: '280px' }}>
        <Bar
          data={buildChartData(ratings)}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                ticks: { color: '#274C77' },
                grid: { display: false },
              },
              y: {
                ticks: { color: '#274C77', beginAtZero: true },
                grid: { display: false },
              },
            },
          }}
        />
      </div>
    ) : (
      <p style={{ fontSize: '1.2rem', color: '#8B8C89' }}>No data</p>
    )}
  </div>

  {/* Appointments per Service */}
  <div style={{
    flex: 1,
    minWidth: '300px',
    maxWidth: '500px',
    backgroundColor: '#E7ECEF',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  }}>
    <h3 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: 20, color: '#274C77' }}>
      Appointments per Service
    </h3>
    {appointmentsPerService.length > 0 ? (
      <div style={{ height: '280px' }}>
        <Bar
          data={buildChartData(appointmentsPerService)}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                ticks: { color: '#274C77' },
                grid: { display: false },
              },
              y: {
                ticks: { color: '#274C77', beginAtZero: true },
                grid: { display: false },
              },
            },
          }}
        />
      </div>
    ) : (
      <p style={{ fontSize: '1.2rem', color: '#8B8C89' }}>No data</p>
    )}
  </div>
</section>
    </div>
  );
};

export default SpDash;
