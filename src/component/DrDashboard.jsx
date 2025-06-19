import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../service/authService';
import DoctorService from '../service/doctorservice';
import { Container, Card, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { MdNotificationsNone, MdMessage } from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Register Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Localizer
const localizer = momentLocalizer(moment);

// Add font to head
const crimsonFont = document.createElement('link');
crimsonFont.href = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&display=swap';
crimsonFont.rel = 'stylesheet';
document.head.appendChild(crimsonFont);

const COLORS = {
  DARK: '#0D1B2A',
  MID: '#1B263B',
  ACCENT: '#415A77',
  TEXT: '#778DA9',
  LIGHT: '#E0E1DD',
};

function DrDashboard() {
  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [bookedCount, setBookedCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function init() {
      const token = await AuthService.getToken();
      if (!token) return navigate('/login');
      const { appUserId } = jwtDecode(token);
      await loadData(appUserId);
    }
    init();
  }, [navigate]);

  async function loadData(userId) {
    try {
      const [docRes, appsRes, bookedRes, unreadRes] = await Promise.all([
        DoctorService.getDoctorById(userId),
        DoctorService.getAppointments(userId),
        DoctorService.getBookedAppointments(userId),
        DoctorService.getUnreadCount(userId),
      ]);
      setDoctorInfo(docRes.data);
      const all = appsRes.data || [];
      const bookedArr = bookedRes.data || [];
      setAppointments(all);
      setBookedCount(bookedArr.length);
      setAvailableCount(all.length - bookedArr.length);
      setUnreadCount(unreadRes.data || 0);
      filterToday(all, new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function filterToday(list, date) {
    const filtered = list.filter(
      a =>
        a.booked &&
        new Date(a.selectedDate).toDateString() === date.toDateString()
    );
    setTodayAppointments(
      filtered.sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
    setSelectedDate(date);
  }

  const handleNotifications = doctorId => navigate(`/doctor/getnotifications/${doctorId}`);
  const handleChat = doctorId => navigate(`/doctor/chats/${doctorId}`);
  const updateDate = date => filterToday(appointments, date);

  function buildChart() {
    const data = [];
    for (let i = -7; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      data.push({
        date: moment(d).format('D/M'),
        booked: appointments.filter(a => a.booked && new Date(a.selectedDate).toDateString() === d.toDateString()).length,
        available: appointments.filter(a => !a.booked && new Date(a.selectedDate).toDateString() === d.toDateString()).length,
      });
    }
    return {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Available',
          data: data.map(d => d.available),
          backgroundColor: COLORS.ACCENT,
        },
        {
          label: 'Booked',
          data: data.map(d => d.booked),
          backgroundColor: COLORS.TEXT,
        },
      ],
    };
  }

  const events = appointments
    .filter(app => app?.selectedDate && app?.startTime && app?.endTime)
    .map(app => ({
      title: app.petName || 'Appointment',
      start: new Date(`${app.selectedDate}T${app.startTime}`),
      end: new Date(`${app.selectedDate}T${app.endTime}`),
    }));

  if (loading) {
    return (
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" style={{ color: COLORS.ACCENT }} />
      </Container>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.LIGHT, fontFamily: "'Crimson Pro', serif" }}>
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3"
        style={{ backgroundColor: COLORS.DARK, color: COLORS.LIGHT }}
      >
        <h5 style={{ margin: 0, fontWeight: '700' }}>Doctor Dashboard</h5>
        <div className="d-flex gap-3 align-items-center">
          <div style={{ cursor: 'pointer' }} onClick={() => handleChat(doctorInfo?.appUserId)}>
  <MdMessage size={24} />
</div>

          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleNotifications(doctorInfo?.appUserId)}>
            <MdNotificationsNone size={24} />
            {unreadCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.6rem' }}
              >
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <Container fluid className="py-4">
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="shadow-sm text-white" style={{ backgroundColor: COLORS.MID }}>
              <Card.Body className="text-center">
                <h6>Booked</h6>
                <h3>{bookedCount}</h3>
                <p style={{ fontSize: '0.85rem' }}>Today: {todayAppointments.length}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm text-white" style={{ backgroundColor: COLORS.ACCENT }}>
              <Card.Body className="text-center">
                <h6>Available</h6>
                <h3>{availableCount}</h3>
                <p style={{ fontSize: '0.85rem' }}>This week</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm" style={{ backgroundColor: '#fff' }}>
              <Card.Body>
                <h6 className="mb-3" style={{ color: COLORS.DARK }}>Today's Appointments</h6>
                {todayAppointments.length === 0 ? (
                  <p className="text-muted">No appointments today</p>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {todayAppointments.map(a => (
                      <Badge key={a.appointmentId} bg="dark" className="p-2">
                        {a.startTime} – {a.petName}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3">
          <Col md={8}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h6 style={{ color: COLORS.DARK }} className="mb-3">Appointment Calendar</h6>
                <div style={{ height: '400px' }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={event => updateDate(new Date(event.start))}
                    onNavigate={date => updateDate(date)}
                    eventPropGetter={() => ({
                      style: {
                        backgroundColor: COLORS.ACCENT,
                        borderRadius: '4px',
                        color: 'white',
                        border: 'none',
                        padding: '2px 4px',
                      },
                    })}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h6 style={{ color: COLORS.DARK }} className="mb-3">Weekly Overview</h6>
                <div style={{ height: '400px' }}>
                  <Bar
                    data={buildChart()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: COLORS.DARK,
                            font: { size: 12 },
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: { color: COLORS.DARK },
                          grid: { display: false },
                        },
                        y: {
                          ticks: { color: COLORS.DARK },
                          grid: { color: 'rgba(0,0,0,0.05)' },
                        },
                      },
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DrDashboard;
