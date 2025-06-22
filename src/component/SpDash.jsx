import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import spservice from '../service/spservice';
import authService from '../service/authService';
import { jwtDecode } from 'jwt-decode';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaStar, FaCalendarCheck, FaCog } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const localizer = momentLocalizer(moment);

const COLORS = {
  ACCENT: '#274C77',
  BACKGROUND: '#E7ECEF',
  TEXT: '#000000',
  CARD: '#FFFFFF',
};

const SpDash = () => {
  const [userId, setUserId] = useState(null);
  const [services, setServices] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [appointmentsServices, setAppointmentsServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const navigate = useNavigate();

  const parseData = (arr) =>
    arr.map(item => {
      const key = Object.keys(item)[0];
      return { label: key, value: item[key] };
    });

  const updateDate = (date) => {
    setSelectedDate(date);
    const sameDay = events.filter(a =>
      new Date(a.start).toDateString() === date.toDateString()
    );
    setTodayAppointments(sameDay.sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const getMaxY = (data) => {
    const max = Math.max(...data.map(d => d.value));
    return Math.ceil(max / 5) * 5 || 5;
  };

  const fetchData = async () => {
    try {
      const token = await authService.getToken();
      if (!token) return;

      const decoded = jwtDecode(token);
      const id = decoded.appUserId;
      if (!id) return;
      setUserId(id);

      const [s, r, a, allAppointments, unreadCount] = await Promise.all([
        spservice.getCountServicesBySp(id),
        spservice.getratingsOfServiceByName(id),
        spservice.getAppointmentsPerServiceBySp(id),
        spservice.getAppointmentsBySp(id),
        spservice.getUnreadCount(id)
      ]);

      setServices(s.data);
      setRatings(parseData(r.data));
      setAppointmentsServices(parseData(a.data));
      setAppointments(allAppointments.data);
      setUnreadNotifications(unreadCount.data);

      const formattedEvents = allAppointments.data.map(app => ({
        title: app.petName,
        start: new Date(app.selectedDate),
        end: new Date(app.selectedDate),
        appointmentId: app.appointmentId,
        petName: app.petName,
        startTime: app.startTime,
        endTime: app.endTime,
      }));
      setEvents(formattedEvents);

    } catch (err) {
      console.error("Failed to load dashboard", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      updateDate(new Date());
    }
  }, [events]);

  const CardWrapper = ({ title, icon, children }) => (
    <Card className="shadow-sm h-100" style={{
      backgroundColor: COLORS.CARD,
      color: COLORS.TEXT,
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      marginBottom: "30px"
    }}>
      <Card.Body>
        <h5 style={{ marginBottom: 15 }}>
          {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
          {title}
        </h5>
        {children}
      </Card.Body>
    </Card>
  );

  const ChartWrapper = ({ data }) => (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#aaa" />
        <XAxis dataKey="label" stroke={COLORS.TEXT} />
        <YAxis domain={[0, getMaxY(data)]} stroke={COLORS.TEXT} />
        <Tooltip contentStyle={{ backgroundColor: '#fff', color: '#000' }} />
        <Bar dataKey="value" fill={COLORS.ACCENT} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div style={{ backgroundColor: COLORS.BACKGROUND, minHeight: '100vh', padding: 20, fontFamily: "'Raleway', sans-serif" }}>
      <h3 style={{ color: COLORS.TEXT, textAlign: 'center', fontWeight: '600', marginBottom: 30 }}>
        <FaCog style={{ marginRight: 10 }} />
        Service Dashboard
      </h3>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
        <div style={{
          backgroundColor: COLORS.ACCENT,
          color: COLORS.CARD,
          padding: 20,
          borderRadius: 12,
          fontSize: 22,
          fontWeight: 'bold',
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
        }}>
          <FaCog style={{ marginRight: 10 }} />
          Total Services: {services}
        </div>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <CardWrapper title="Ratings per Service" icon={<FaStar />}>
            <ChartWrapper data={ratings} />
          </CardWrapper>
        </Col>
        <Col md={6}>
          <CardWrapper title="Appointments per Service" icon={<FaCalendarCheck />}>
            <ChartWrapper data={appointmentsServices} />
          </CardWrapper>
        </Col>
      </Row>

      <Container fluid className="py-4">
        <Row className="g-3 mb-2">
          <Col md={12}>
            <Card className="shadow-sm h-100" style={{ backgroundColor: COLORS.CARD, color: COLORS.TEXT }}>
              <Card.Body>
                <h6 className="mb-3">Appointment Calendar</h6>
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
                        color: COLORS.CARD,
                        borderRadius: '4px',
                        padding: '2px 4px',
                      }
                    })}
                    style={{
                      backgroundColor: COLORS.CARD,
                      color: COLORS.TEXT,
                      fontFamily: "'Raleway', sans-serif",
                      borderRadius: 10
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3 mb-4 justify-content-center">
          <Col md={4}>
            <Card className="shadow-sm" style={{
              maxHeight: '150px',
              overflowY: 'auto',
              backgroundColor: COLORS.CARD,
              color: COLORS.TEXT,
            }}>
              <Card.Body>
                <h6 className="mb-3" style={{ fontSize: '1rem' }}>
                  {selectedDate?.toDateString() === new Date().toDateString()
                    ? "Today's Appointments:"
                    : `Appointments on ${selectedDate?.toDateString()}:`}
                </h6>
                {todayAppointments.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>No appointments</p>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {todayAppointments.map((a) => (
                      <Badge key={a.appointmentId} bg="dark" className="p-2" style={{ fontSize: '0.8rem' }}>
                        {a.startTime} – {a.endTime} – {a.petName}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SpDash;
