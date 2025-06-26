import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../service/authService';
import DoctorService from '../service/doctorservice';
import { Container, Card, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { MdNotificationsNone, MdMessage } from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import {jwtDecode} from 'jwt-decode';  // fixed import from { jwtDecode } to jwtDecode
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const localizer = momentLocalizer(moment);

const COLORS = {
  ACCENT: '#64B5F6',  // your main blue color
  TEXT: '#000000',    // black font color
  LIGHT: '#FFFFFF',   // white background for cards or light areas
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
  const [bookingPercentage, setBookingPercentage] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [uniqueUsersCount, setUniqueUsersCount] = useState(0);

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
      const [
        docRes,
        appsRes,
        bookedRes,
        unreadRes,
        bookingPercentageRes,
        attendancePercentageRes,
        uniqueUsersRes,
      ] = await Promise.all([
        DoctorService.getDoctorById(userId),
        DoctorService.getAppointments(userId),
        DoctorService.getBookedAppointments(userId),
        DoctorService.getUnreadCount(userId),
        DoctorService.getPercentageOfBookings(userId),
        DoctorService.getPercentageOfAttendance(userId),
        DoctorService.getNumberOfDifferentUsers(userId),
      ]);

      setDoctorInfo(docRes.data);
      const all = appsRes.data || [];
      const bookedArr = bookedRes.data || [];
      setAppointments(all);
      setBookedCount(bookedArr.length);
      setAvailableCount(all.length - bookedArr.length);
      setUnreadCount(unreadRes.data || 0);
      setBookingPercentage(bookingPercentageRes.data || 0);
      setAttendancePercentage(attendancePercentageRes.data || 0);
      setUniqueUsersCount(uniqueUsersRes.data || 0);
      filterByDate(all, new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function buildChart() {
    const data = [];
    for (let i = -7; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      data.push({
        date: moment(d).format('D/M'),
        booked: appointments.filter(
          (a) =>
            a.booked &&
            new Date(a.selectedDate).toDateString() === d.toDateString()
        ).length,
        available: appointments.filter(
          (a) =>
            !a.booked &&
            new Date(a.selectedDate).toDateString() === d.toDateString()
        ).length,
      });
    }
    return {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: 'Available',
          data: data.map((d) => d.available),
          backgroundColor: COLORS.ACCENT,
        },
        {
          label: 'Booked',
          data: data.map((d) => d.booked),
          backgroundColor: '#444444',
        },
      ],
    };
  }

  function filterByDate(list, date) {
    const sameDayAppointments = list.filter(
      (a) => new Date(a.selectedDate).toDateString() === date.toDateString()
    );
    setTodayAppointments(
      sameDayAppointments.sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
    setSelectedDate(date);
  }

  const handleNotifications = (doctorId) =>
    navigate(`/doctor/getnotifications/${doctorId}`);
  const handleChat = (doctorId) => navigate(`/doctor/chats/${doctorId}`);
  const updateDate = (date) => filterByDate(appointments, date);
const events = appointments
  .filter((app) => 
    app.booked &&                      // ✅ only include booked appointments
    app?.selectedDate && 
    app?.startTime && 
    app?.endTime
  )
  .map((app) => {
    const start = new Date(`${app.selectedDate}T${app.startTime}`);
    const end = new Date(`${app.selectedDate}T${app.endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn('Invalid event dates', app);
      return null;
    }

    return {
      title: app.petName || 'Appointment',
      start,
      end,
    };
  })
  .filter((event) => event !== null);

  if (loading) {
    return (
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" style={{ color: COLORS.ACCENT }} />
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.LIGHT,
        fontFamily: "'Poppins', sans-serif",
        color: COLORS.TEXT,
      }}
    >
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3"
        style={{ backgroundColor: COLORS.ACCENT, color: COLORS.TEXT }}
      >
        <h5 style={{ margin: 0, fontWeight: '700' }}>Doctor Dashboard</h5>
        <div className="d-flex gap-3 align-items-center">
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => handleChat(doctorInfo?.appUserId)}
          >
            <MdMessage size={24} color={COLORS.TEXT} />
          </div>
          <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => handleNotifications(doctorInfo?.appUserId)}
          >
            <MdNotificationsNone size={24} color={COLORS.TEXT} />
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

      {/* Main Content */}
      <Container fluid className="py-4">
        {/* Calendar Row */}
        <Row className="g-3 mb-2">
          <Col md={12}>
            <Card className="shadow-sm h-100" style={{ backgroundColor: COLORS.LIGHT }}>
              <Card.Body>
                <h6 style={{ color: COLORS.TEXT }} className="mb-3">
                  Appointment Calendar
                </h6>
                <div style={{ height: '400px' }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectEvent={(event) => updateDate(new Date(event.start))}
                    onSelectSlot={(slotInfo) => updateDate(new Date(slotInfo.start))}
                    onNavigate={(date) => updateDate(date)}
                    views={['month']}
                    eventPropGetter={() => ({
                      style: {
                        backgroundColor: COLORS.ACCENT,
                        borderRadius: '4px',
                        color: COLORS.TEXT,
                        border: 'none',
                        padding: '2px 4px',
                      },
                    })}
                    style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.TEXT }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Smaller Appointment Box Below Calendar */}
        <Row className="g-3 mb-4 justify-content-center">
          <Col md={4}>
            <Card
              className="shadow-sm"
              style={{
                maxHeight: '150px',
                overflowY: 'auto',
                backgroundColor: COLORS.LIGHT,
                color: COLORS.TEXT,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <Card.Body>
                <h6 className="mb-3" style={{ fontSize: '1rem' }}>
                  {selectedDate.toDateString() === new Date().toDateString()
                    ? "Today's Appointments:"
                    : `Appointments on ${selectedDate.toDateString()}:`}
                </h6>
                {todayAppointments.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    No appointments
                  </p>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {todayAppointments.map((a) => (
                      <Badge
                        key={a.appointmentId}
                        bg="primary"
                        className="p-2"
                        style={{ fontSize: '0.8rem', fontFamily: "'Poppins', sans-serif" }}
                      >
                        {a.startTime} – {a.endTime}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Booking, Attendance, Visitors */}
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card className="shadow-sm text-center" style={{ backgroundColor: COLORS.LIGHT }}>
              <Card.Body>
                <h6 style={{ color: COLORS.TEXT, fontFamily: "'Poppins', sans-serif" }}>
                  Booking %
                </h6>
                <div style={{ width: 100, margin: 'auto' }}>
                  <CircularProgressbar
                    value={bookingPercentage}
                    text={`${bookingPercentage.toFixed(0)}%`}
                    styles={buildStyles({
                      textColor: COLORS.TEXT,
                      pathColor: COLORS.ACCENT,
                      trailColor: '#ccc',
                      fontFamily: "'Poppins', sans-serif",
                    })}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm text-center" style={{ backgroundColor: COLORS.LIGHT }}>
              <Card.Body>
                <h6 style={{ color: COLORS.TEXT, fontFamily: "'Poppins', sans-serif" }}>
                  Attendance %
                </h6>
                <div style={{ width: 100, margin: 'auto' }}>
                  <CircularProgressbar
                    value={attendancePercentage}
                    text={`${attendancePercentage.toFixed(0)}%`}
                    styles={buildStyles({
                      textColor: COLORS.TEXT,
                      pathColor: COLORS.ACCENT,
                      trailColor: '#ccc',
                      fontFamily: "'Poppins', sans-serif",
                    })}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm text-center" style={{ backgroundColor: COLORS.LIGHT }}>
              <Card.Body>
                <h6 style={{ color: COLORS.TEXT, fontFamily: "'Poppins', sans-serif" }}>
                  Visitors
                </h6>
                <h3 style={{ color: COLORS.TEXT, fontFamily: "'Poppins', sans-serif" }}>
                  {uniqueUsersCount}
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Weekly Chart */}
        <Row className="g-3">
          <Col md={12}>
            <Card className="shadow-sm h-100" style={{ backgroundColor: COLORS.LIGHT }}>
              <Card.Body>
                <h6 style={{ color: COLORS.TEXT, fontFamily: "'Poppins', sans-serif" }} className="mb-3">
                  Weekly Overview
                </h6>
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
                            color: COLORS.TEXT,
                            font: { family: "'Poppins', sans-serif", size: 12 },
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: { color: COLORS.TEXT },
                          grid: { display: false },
                        },
                       y: {
  min: 0, // ✅ Force Y-axis to start from 1
  ticks: {
    color: COLORS.TEXT,
    stepSize: 1.0, 
    interval: 1, 
  },
  grid: { color: 'rgba(0,0,0,0.05)' },
}

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
